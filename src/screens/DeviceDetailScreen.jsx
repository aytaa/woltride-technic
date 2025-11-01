import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { IO_ELEMENT_MAP, getIOValue, IMPORTANT_IOS } from '../constants/ioElements';

export default function DeviceDetailScreen({ route, navigation }) {
  const { device } = route.params;

  const InfoRow = ({ label, value, color }) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, color && { color }]}>{value}</Text>
    </View>
  );

  const renderIcon = (icon) => {
    if (!icon) return null;
    if (icon.family === 'Ionicons') {
      return <Ionicons name={icon.name} size={24} color="#3B82F6" style={{ marginRight: 12 }} />;
    }
    if (icon.family === 'MaterialIcons') {
      return <MaterialIcons name={icon.name} size={24} color="#3B82F6" style={{ marginRight: 12 }} />;
    }
    return null;
  };

  const getStatusColor = () => {
    if (device.status === 'offline') return '#EF4444';
    if (device.gps.speed > 0) return '#3B82F6';
    return '#10B981';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cihaz Detayları</Text>
      </View>

      {/* Status Card */}
      <View style={[styles.card, styles.statusCard, { borderLeftColor: getStatusColor() }]}>
        <Text style={styles.cardTitle}>Durum</Text>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {device.status === 'online' ? '🟢 Çevrimiçi' : '🔴 Çevrimdışı'}
        </Text>
        {device.gps.speed > 0 && (
          <Text style={styles.movingText}>🚀 Hareket Halinde</Text>
        )}
      </View>

      {/* Device Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cihaz Bilgileri</Text>
        <InfoRow label="IMEI" value={device.imei} />
        <InfoRow
          label="Atanan Scooter"
          value={device.assignedScooter || 'Atanmamış'}
          color={device.assignedScooter ? '#10B981' : '#F59E0B'}
        />
        <InfoRow
          label="Son Görülme"
          value={new Date(device.lastSeen).toLocaleString('tr-TR')}
        />
      </View>

      {/* GPS Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Konum Bilgileri</Text>
        <InfoRow label="Enlem" value={device.gps.latitude.toFixed(6)} />
        <InfoRow label="Boylam" value={device.gps.longitude.toFixed(6)} />
        <InfoRow label="Yükseklik" value={`${device.gps.altitude} m`} />
        <InfoRow
          label="Hız"
          value={`${Math.round(device.gps.speed)} km/h`}
          color={device.gps.speed > 0 ? '#3B82F6' : undefined}
        />
        <InfoRow label="Yön" value={`${device.gps.angle}°`} />
        <InfoRow label="Uydu Sayısı" value={device.gps.satellites} />
      </View>

      {/* Important Metrics Card */}
      {device.io?.elements && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚡ Önemli Ölçümler</Text>
          {IMPORTANT_IOS.map(ioId => {
            const value = device.io.elements[ioId];
            if (value === undefined) return null;

            const ioData = getIOValue(ioId, value);
            return (
              <View key={ioId} style={styles.ioRow}>
                <View style={styles.ioLeft}>
                  {renderIcon(ioData.icon)}
                  <Text style={styles.ioLabel}>{ioData.label}</Text>
                </View>
                <Text style={[
                  styles.ioValue,
                  ioData.color && { color: ioData.color }
                ]}>
                  {ioData.value}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* All IO Elements Card */}
      {device.io?.elements && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Tüm IO Verileri</Text>
          {Object.entries(device.io.elements).map(([key, value]) => {
            const ioData = getIOValue(parseInt(key), value);
            return (
              <View key={key} style={styles.ioRow}>
                <View style={styles.ioLeft}>
                  {renderIcon(ioData.icon)}
                  <View>
                    <Text style={styles.ioLabel}>{ioData.label}</Text>
                    <Text style={styles.ioDescription}>{ioData.description}</Text>
                  </View>
                </View>
                <Text style={[
                  styles.ioValue,
                  ioData.color && { color: ioData.color }
                ]}>
                  {ioData.value}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    fontSize: 16,
    color: '#3B82F6',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusCard: {
    borderLeftWidth: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  movingText: {
    fontSize: 16,
    color: '#3B82F6',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  ioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  ioLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  ioDescription: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  ioValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});
