// ==================== DEFAULT DATA ====================
// Wszystkie domyślne dane aplikacji

const DEFAULT_DATA = {
  settings: {
    restaurantName: 'Da Grasso',
    theme: 'classic',
    sizes: [
      { id: 'S', label: 'mała', short: 'm' },
      { id: 'M', label: 'średnia', short: 'ś' },
      { id: 'L', label: 'duża', short: 'd' }
    ],
    splitSurcharge: 5,
    defaultFreeSauces: 2,
    cartWidth: 33,  // Szerokość koszyka w procentach
    deliveryTimes: ['30', '45', '60', '90'],
    paymentTypes: [
      { id: 'cash', label: 'Gotówka', icon: '💵' },
      { id: 'card', label: 'Karta', icon: '💳' },
      { id: 'online', label: 'Online', icon: '📱' }
    ],
    quickNotes: ['PRZYPIECZONA', 'BEZ CEBULI', 'NA CIENKIM', 'DUŻO SOSU']
  },

  themes: {
    classic: {
      name: 'Klasyczny',
      primary: 'amber',
      cartBg: 'stone-50',
      cartBorder: 'stone-200'
    },
    ocean: {
      name: 'Ocean',
      primary: 'sky',
      cartBg: 'sky-50',
      cartBorder: 'sky-200'
    },
    forest: {
      name: 'Las',
      primary: 'emerald',
      cartBg: 'emerald-50',
      cartBorder: 'emerald-200'
    },
    sunset: {
      name: 'Zachód słońca',
      primary: 'orange',
      cartBg: 'orange-50',
      cartBorder: 'orange-200'
    },
    lavender: {
      name: 'Lawenda',
      primary: 'purple',
      cartBg: 'purple-50',
      cartBorder: 'purple-200'
    },
    rose: {
      name: 'Róża',
      primary: 'rose',
      cartBg: 'rose-50',
      cartBorder: 'rose-200'
    }
  },

  packaging: [
    { id: 1, name: 'Pudełko S', price: 1 },
    { id: 2, name: 'Pudełko M', price: 1.5 },
    { id: 3, name: 'Pudełko L', price: 2 },
    { id: 4, name: 'Pojemnik mały', price: 0.5 },
    { id: 5, name: 'Pojemnik duży', price: 1 }
  ],

  addons: [
    // Serowe
    { id: 1, name: 'ser', price: 4, category: 'serowe', forType: 'pizza' },
    { id: 2, name: 'mozzarella', price: 5, category: 'serowe', forType: 'pizza' },
    { id: 3, name: 'feta', price: 5, category: 'serowe', forType: 'both' },
    { id: 4, name: 'gorgonzola', price: 5, category: 'serowe', forType: 'pizza' },
    { id: 5, name: 'parmezan', price: 5, category: 'serowe', forType: 'pizza' },
    // Mięsne
    { id: 10, name: 'szynka', price: 5, category: 'mięsne', forType: 'pizza' },
    { id: 11, name: 'salami', price: 5, category: 'mięsne', forType: 'pizza' },
    { id: 12, name: 'pepperoni', price: 5, category: 'mięsne', forType: 'pizza' },
    { id: 13, name: 'boczek', price: 5, category: 'mięsne', forType: 'both' },
    { id: 14, name: 'kurczak', price: 6, category: 'mięsne', forType: 'both' },
    // Warzywne
    { id: 20, name: 'pieczarki', price: 3, category: 'warzywne', forType: 'pizza' },
    { id: 21, name: 'cebula', price: 2, category: 'warzywne', forType: 'both' },
    { id: 22, name: 'papryka', price: 3, category: 'warzywne', forType: 'pizza' },
    { id: 23, name: 'pomidor', price: 3, category: 'warzywne', forType: 'both' },
    { id: 24, name: 'oliwki', price: 4, category: 'warzywne', forType: 'pizza' },
    { id: 25, name: 'jalapeño', price: 4, category: 'warzywne', forType: 'both' },
    { id: 26, name: 'ananas', price: 4, category: 'warzywne', forType: 'pizza' },
    { id: 30, name: 'sałata', price: 2, category: 'warzywne', forType: 'menu' },
    { id: 31, name: 'ogórek', price: 2, category: 'warzywne', forType: 'menu' },
    // Inne
    { id: 50, name: 'jajko', price: 3, category: 'inne', forType: 'pizza' },
    { id: 51, name: 'podwójne mięso', price: 8, category: 'inne', forType: 'menu' },
  ],

  sauces: [
    { id: 1, name: 'czosnkowy', price: 3 },
    { id: 2, name: 'pomidorowy', price: 3 },
    { id: 3, name: 'ostry', price: 3 },
    { id: 4, name: 'BBQ', price: 3 },
    { id: 5, name: 'serowy', price: 3 },
  ],

  pizzas: [
    {
      nr: 1, name: 'Margherita', p: [22, 28, 36], pkg: [1, 2, 3],
      availableAddons: [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 25, 26, 50],
      defaultAddons: { 1: 1 },
      freeSauces: [1, 2], freeSaucesCount: 2
    },
    {
      nr: 2, name: 'Funghi', p: [24, 30, 38], pkg: [1, 2, 3],
      availableAddons: [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 25, 26, 50],
      defaultAddons: { 1: 1, 20: 1 },
      freeSauces: [1, 2], freeSaucesCount: 2
    },
    {
      nr: 3, name: 'Capriciosa', p: [26, 32, 42], pkg: [1, 2, 3],
      availableAddons: [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 25, 26, 50],
      defaultAddons: { 1: 1, 10: 1, 20: 1 },
      freeSauces: [1, 2], freeSaucesCount: 2
    },
    {
      nr: 4, name: 'Salame', p: [26, 32, 42], pkg: [1, 2, 3],
      availableAddons: [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 25, 26, 50],
      defaultAddons: { 1: 1, 11: 2 },
      freeSauces: [1, 2, 3], freeSaucesCount: 2
    },
    {
      nr: 5, name: 'Hawajska', p: [26, 32, 42], pkg: [1, 2, 3],
      availableAddons: [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 25, 26, 50],
      defaultAddons: { 1: 1, 10: 1, 26: 1 },
      freeSauces: [1, 2], freeSaucesCount: 2
    },
    {
      nr: 6, name: 'Pepperoni', p: [27, 34, 44], pkg: [1, 2, 3],
      availableAddons: [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 25, 26, 50],
      defaultAddons: { 1: 1, 12: 1 },
      freeSauces: [1, 3], freeSaucesCount: 2
    },
    {
      nr: 7, name: 'Serowa', p: [28, 35, 45], pkg: [1, 2, 3],
      availableAddons: [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 25, 26, 50],
      defaultAddons: { 1: 1, 2: 1, 4: 1, 5: 1 },
      freeSauces: [5], freeSaucesCount: 1
    },
  ],

  menu: [
    { id: 101, cat: 'przekąski', name: 'Nuggetsy 6szt', price: 14, pkg: 4, availableAddons: [], defaultAddons: {} },
    { id: 104, cat: 'przekąski', name: 'Placki ziemniaczane', price: 12, pkg: 4, availableAddons: [], defaultAddons: {} },
    { id: 102, cat: 'przekąski', name: 'Frytki', price: 10, pkg: 4, availableAddons: [3], defaultAddons: {} },
    { id: 103, cat: 'przekąski', name: 'Skrzydełka 8szt', price: 18, pkg: 4, availableAddons: [], defaultAddons: {} },
    {
      id: 301, cat: 'burgery', name: 'Burger Classic', price: 26, pkg: 4,
      availableAddons: [3, 13, 25, 21, 23, 30, 31, 51],
      defaultAddons: { 23: 1, 30: 1, 21: 1 }
    },
    {
      id: 302, cat: 'burgery', name: 'Burger Cheese', price: 28, pkg: 4,
      availableAddons: [3, 13, 25, 21, 23, 30, 31, 51],
      defaultAddons: { 3: 1, 23: 1, 30: 1, 21: 1 }
    },
    {
      id: 303, cat: 'burgery', name: 'Burger Bacon', price: 30, pkg: 4,
      availableAddons: [3, 13, 25, 21, 23, 30, 31, 51],
      defaultAddons: { 13: 1, 23: 1, 30: 1, 21: 1 }
    },
    { id: 401, cat: 'sałatki', name: 'Sałatka Grecka', price: 18, pkg: 4, availableAddons: [3], defaultAddons: {} },
    { id: 402, cat: 'sałatki', name: 'Sałatka Cezar', price: 20, pkg: 4, availableAddons: [14], defaultAddons: {} },
    { id: 451, cat: 'makarony', name: 'Carbonara', price: 22, pkg: 5, availableAddons: [13], defaultAddons: {} },
    { id: 452, cat: 'makarony', name: 'Bolognese', price: 24, pkg: 5, availableAddons: [], defaultAddons: {} },
    { id: 501, cat: 'napoje', name: 'Coca-Cola 0.5L', price: 7, availableAddons: [], defaultAddons: {} },
    { id: 502, cat: 'napoje', name: 'Fanta 0.5L', price: 7, availableAddons: [], defaultAddons: {} },
    { id: 503, cat: 'napoje', name: 'Sprite 0.5L', price: 7, availableAddons: [], defaultAddons: {} },
    { id: 504, cat: 'napoje', name: 'Woda 0.5L', price: 5, availableAddons: [], defaultAddons: {} },
    { id: 701, cat: 'alkohole', name: 'Piwo Tyskie 0.5L', price: 10, alco: true, availableAddons: [], defaultAddons: {} },
    { id: 702, cat: 'alkohole', name: 'Piwo ٻywiec 0.5L', price: 10, alco: true, availableAddons: [], defaultAddons: {} },
    { id: 801, cat: 'desery', name: 'Lody waniliowe', price: 12, pkg: 4, availableAddons: [], defaultAddons: {} },
    { id: 802, cat: 'desery', name: 'Tiramisu', price: 15, pkg: 4, availableAddons: [], defaultAddons: {} },
  ],

  discounts: [
    { id: 1, name: 'Mundurówka', type: 'size-upgrade', sizeFrom: 'L', sizeTo: 'M', active: true, perItem: true },
    { id: 2, name: 'Pizza 25zł', type: 'fixed', fixedPrice: 25, active: true, perItem: true },
    { id: 3, name: 'Studenci 15%', type: 'percent', percent: 15, active: true, perItem: false, noAlco: true },
  ],

  promotions: [
    { id: 1, name: '2 duże za 90zł', type: 'combo', price: 90, size: 'L', count: 2, pizzas: [1, 2, 3, 4, 5, 6, 7], active: true }
  ],

  locations: {
    cities: [
      { id: 1, name: 'Chełm', deliveryFee: 0, minOrder: 30 },
      { id: 2, name: 'Pokrówka', deliveryFee: 5, minOrder: 40 },
      { id: 3, name: 'Okszów', deliveryFee: 8, minOrder: 50 },
    ],
    streets: [
      { id: 1, cityId: 1, name: 'Lubelska', aliases: [], maxNumber: null },
      { id: 2, cityId: 1, name: 'Aleja Armii Wojska Polskiego', aliases: ['AWP', 'Al. Armii WP'], maxNumber: 150 },
      { id: 3, cityId: 1, name: 'Hrubieszowska', aliases: [], maxNumber: 120 },
      { id: 4, cityId: 1, name: 'Lwowska', aliases: [], maxNumber: 80 },
      { id: 5, cityId: 1, name: 'Kolejowa', aliases: [], maxNumber: null },
      { id: 6, cityId: 2, name: 'Główna', aliases: [], maxNumber: 50 },
      { id: 7, cityId: 3, name: 'Chełmska', aliases: [], maxNumber: 40 },
    ],
    landmarks: [
      { id: 1, name: 'Orlen Hrubieszowska', cityId: 1, streetId: 3, number: '45' },
      { id: 2, name: 'Kaufland', cityId: 1, streetId: 4, number: '10' },
      { id: 3, name: 'Dworzec PKP', cityId: 1, streetId: 5, number: '1' },
    ]
  },

  orders: [],
};

// ==================== STORAGE SERVICE ====================
// Obsługa localStorage

const STORAGE_KEY = 'dagrasso_v13';

const DataService = {
  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_DATA,
          ...parsed,
          settings: { ...DEFAULT_DATA.settings, ...(parsed.settings || {}) },
          locations: { 
            ...DEFAULT_DATA.locations, 
            ...(parsed.locations || {}),
            cities: parsed.locations?.cities || DEFAULT_DATA.locations.cities,
            streets: parsed.locations?.streets || DEFAULT_DATA.locations.streets,
            landmarks: parsed.locations?.landmarks || DEFAULT_DATA.locations.landmarks,
          },
        };
      }
    } catch (e) {
      console.error('DataService.load error:', e);
    }
    return { ...DEFAULT_DATA };
  },

  save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('DataService.save error:', e);
    }
  },

  reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('DataService.reset error:', e);
    }
    return { ...DEFAULT_DATA };
  }
};
