export const IO_ELEMENT_MAP = {
  21: {
    name: 'GSM Sinyali',
    unit: '',
    icon: { family: 'Ionicons', name: 'cellular' },
    description: 'GSM sinyal gücü (0-5)',
    format: (value) => `${value}/5`
  },
  24: {
    name: 'Hız',
    unit: 'km/h',
    icon: { family: 'Ionicons', name: 'speedometer' },
    description: 'Araç hızı',
    format: (value) => `${value} km/h`
  },
  66: {
    name: 'Harici Voltaj',
    unit: 'V',
    icon: { family: 'MaterialIcons', name: 'power' },
    description: 'Harici güç kaynağı voltajı',
    format: (value) => `${(value / 1000).toFixed(2)}V`
  },
  67: {
    name: 'Batarya Voltajı',
    unit: 'V',
    icon: { family: 'Ionicons', name: 'battery-half' },
    description: 'Dahili batarya voltajı',
    format: (value) => `${(value / 1000).toFixed(2)}V`
  },
  68: {
    name: 'Batarya Akımı',
    unit: 'mA',
    icon: { family: 'Ionicons', name: 'flash' },
    description: 'Batarya akımı',
    format: (value) => `${value}mA`
  },
  69: {
    name: 'GPS Durumu',
    unit: '',
    icon: { family: 'MaterialIcons', name: 'gps-fixed' },
    description: 'GPS kilit durumu',
    format: (value) => value === 0 ? 'Yok' : value === 1 ? 'Var' : 'DGPS'
  },
  113: {
    name: 'Batarya Seviyesi',
    unit: '%',
    icon: { family: 'Ionicons', name: 'battery-charging' },
    description: 'Batarya yüzdesi',
    format: (value) => `${value}%`,
    getColor: (value) => value > 60 ? '#10B981' : value > 30 ? '#F59E0B' : '#EF4444'
  },
  181: {
    name: 'PDOP',
    unit: '',
    icon: { family: 'Ionicons', name: 'location' },
    description: 'Konum hassasiyeti',
    format: (value) => (value / 10).toFixed(1)
  },
  182: {
    name: 'HDOP',
    unit: '',
    icon: { family: 'Ionicons', name: 'locate' },
    description: 'Yatay hassasiyet',
    format: (value) => (value / 10).toFixed(1)
  },
  200: {
    name: 'Uyku Modu',
    unit: '',
    icon: { family: 'Ionicons', name: 'moon' },
    description: 'Cihaz uyku durumu',
    format: (value) => value === 0 ? 'Aktif' : 'Uyuyor'
  },
  239: {
    name: 'Kontak',
    unit: '',
    icon: { family: 'Ionicons', name: 'key' },
    description: 'Kontak durumu',
    format: (value) => value === 0 ? 'Kapalı' : 'Açık',
    getColor: (value) => value === 1 ? '#10B981' : '#6B7280'
  },
  240: {
    name: 'Hareket',
    unit: '',
    icon: { family: 'Ionicons', name: 'walk' },
    description: 'Hareket algılama',
    format: (value) => value === 0 ? 'Durgun' : 'Hareketli',
    getColor: (value) => value === 1 ? '#3B82F6' : '#6B7280'
  },
  241: {
    name: 'GSM Operatör',
    unit: '',
    icon: { family: 'Ionicons', name: 'phone-portrait' },
    description: 'GSM operatör kodu',
    format: (value) => value.toString()
  }
};

// Get formatted value
export const getIOValue = (id, value) => {
  const element = IO_ELEMENT_MAP[id];
  if (!element) return { label: `IO ${id}`, value: value.toString() };

  return {
    label: element.name,
    value: element.format ? element.format(value) : value.toString(),
    icon: element.icon,
    description: element.description,
    color: element.getColor ? element.getColor(value) : undefined
  };
};

// Get important IO elements (for summary view)
export const IMPORTANT_IOS = [113, 67, 21, 239, 240, 69];
