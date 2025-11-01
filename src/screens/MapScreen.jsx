import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import wsService from '../services/websocket';

export default function MapScreen({ navigation }) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    wsService.connect();

    const unsubscribe = wsService.subscribe((message) => {
      if (message.type === 'device_update' && message.data) {
        // Validate data before setting
        const validDevices = message.data.filter(d =>
          d.imei &&
          d.gps &&
          typeof d.gps.latitude === 'number' &&
          typeof d.gps.longitude === 'number'
        );
        setDevices(validDevices);
      }
    });

    return () => {
      unsubscribe();
      wsService.disconnect();
    };
  }, []);

  const handleMarkerPress = (device) => {
    try {
      if (selectedDevice?.imei === device.imei) {
        // Second tap - go to details
        navigation.navigate('DeviceDetail', { device });
      } else {
        // First tap - fly to and zoom
        setSelectedDevice(device);

        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: device.gps.latitude,
            longitude: device.gps.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Marker press error:', error);
    }
  };

  const getMarkerColor = (device) => {
    if (device.status === 'offline') return '#EF4444'; // Red
    if (device.gps && device.gps.speed > 0) return '#3B82F6'; // Blue (moving)
    if (device.assignedScooter) return '#10B981'; // Green (assigned)
    return '#F59E0B'; // Orange (unassigned)
  };

  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.header}>
        <Text style={styles.title}>Woltride Technic</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{devices.length}</Text>
            <Text style={styles.statLabel}>Toplam</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {devices.filter(d => d.status === 'online').length}
            </Text>
            <Text style={styles.statLabel}>Aktif</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {devices.filter(d => d.gps && d.gps.speed > 0).length}
            </Text>
            <Text style={styles.statLabel}>Hareket</Text>
          </View>
        </View>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 39.0,      // Turkey center
          longitude: 35.0,     // Turkey center
          latitudeDelta: 8,    // Zoom out to see whole Turkey
          longitudeDelta: 8,
        }}
      >
        {(() => {
          const validDevices = devices.filter(d =>
            d.gps &&
            d.gps.latitude &&
            d.gps.longitude
          );
          console.log('Total devices:', devices.length, 'Valid devices for markers:', validDevices.length);
          return validDevices.map((device) => {
            console.log('Rendering marker for device:', device.imei, 'at', device.gps.latitude, device.gps.longitude);
            return (
            <Marker
              key={device.imei}
              coordinate={{
                latitude: parseFloat(device.gps.latitude),
                longitude: parseFloat(device.gps.longitude),
              }}
              onPress={() => handleMarkerPress(device)}
              tracksViewChanges={false}
            >
              <View style={{
                backgroundColor: getMarkerColor(device),
                width: 36,
                height: 36,
                borderRadius: 18,
                borderWidth: 3,
                borderColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
                {device.gps.speed > 0 ? (
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>🛴</Text>
                ) : (
                  <View style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'white',
                  }} />
                )}
              </View>
            </Marker>
            );
          });
        })()}
      </MapView>

      {/* Selected Device Info Card */}
      {selectedDevice && (
        <TouchableOpacity
          style={styles.infoCard}
          onPress={() => navigation.navigate('DeviceDetail', { device: selectedDevice })}
        >
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>IMEI:</Text>
            <Text style={styles.infoValue}>{selectedDevice.imei}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Scooter:</Text>
            <Text style={styles.infoValue}>
              {selectedDevice.assignedScooter || 'Atanmamış'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hız:</Text>
            <Text style={styles.infoValue}>
              {selectedDevice.gps ? Math.round(selectedDevice.gps.speed) : 0} km/h
            </Text>
          </View>
          <Text style={styles.tapHint}>Detaylar için dokun</Text>
        </TouchableOpacity>
      )}

      {/* Connection Status */}
      <View style={styles.connectionStatus}>
        <View style={styles.pulsingDot} />
        <Text style={styles.connectionText}>Canlı</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  map: {
    flex: 1,
  },
  infoCard: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  tapHint: {
    fontSize: 12,
    color: '#3B82F6',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  connectionStatus: {
    position: 'absolute',
    top: 60,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 6,
  },
  connectionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
