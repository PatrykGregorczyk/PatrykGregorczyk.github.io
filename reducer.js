// ==================== ACTION TYPES ====================

const ACTIONS = {
  // Data
  SET_DATA: 'SET_DATA',
  RESET_DATA: 'RESET_DATA',
  
  // Orders
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER: 'UPDATE_ORDER',
  DELETE_ORDER: 'DELETE_ORDER',
  
  // Pizzas
  ADD_PIZZA: 'ADD_PIZZA',
  UPDATE_PIZZA: 'UPDATE_PIZZA',
  DELETE_PIZZA: 'DELETE_PIZZA',
  
  // Menu
  ADD_MENU_ITEM: 'ADD_MENU_ITEM',
  UPDATE_MENU_ITEM: 'UPDATE_MENU_ITEM',
  DELETE_MENU_ITEM: 'DELETE_MENU_ITEM',
  
  // Addons
  ADD_ADDON: 'ADD_ADDON',
  UPDATE_ADDON: 'UPDATE_ADDON',
  DELETE_ADDON: 'DELETE_ADDON',
  
  // Sauces
  ADD_SAUCE: 'ADD_SAUCE',
  UPDATE_SAUCE: 'UPDATE_SAUCE',
  DELETE_SAUCE: 'DELETE_SAUCE',
  
  // Discounts
  ADD_DISCOUNT: 'ADD_DISCOUNT',
  UPDATE_DISCOUNT: 'UPDATE_DISCOUNT',
  DELETE_DISCOUNT: 'DELETE_DISCOUNT',
  
  // Promotions
  ADD_PROMO: 'ADD_PROMO',
  UPDATE_PROMO: 'UPDATE_PROMO',
  DELETE_PROMO: 'DELETE_PROMO',
  
  // Packaging
  ADD_PACKAGING: 'ADD_PACKAGING',
  UPDATE_PACKAGING: 'UPDATE_PACKAGING',
  DELETE_PACKAGING: 'DELETE_PACKAGING',
  
  // Locations - Cities
  ADD_CITY: 'ADD_CITY',
  UPDATE_CITY: 'UPDATE_CITY',
  DELETE_CITY: 'DELETE_CITY',
  
  // Locations - Streets
  ADD_STREET: 'ADD_STREET',
  UPDATE_STREET: 'UPDATE_STREET',
  DELETE_STREET: 'DELETE_STREET',
  
  // Locations - Landmarks
  ADD_LANDMARK: 'ADD_LANDMARK',
  UPDATE_LANDMARK: 'UPDATE_LANDMARK',
  DELETE_LANDMARK: 'DELETE_LANDMARK',
  
  // Settings
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  
  // Debug
  ADD_LOG: 'ADD_LOG',
  CLEAR_LOGS: 'CLEAR_LOGS',
};

// ==================== REDUCER ====================

const dataReducer = (state, action) => {
  const timestamp = new Date().toLocaleTimeString();
  
  switch (action.type) {
    // ========== DATA ==========
    case ACTIONS.SET_DATA:
      return {
        ...state,
        data: action.payload,
        version: state.version + 1,
      };
      
    case ACTIONS.RESET_DATA:
      return {
        ...state,
        data: DataService.reset(),
        version: state.version + 1,
        logs: [`[${timestamp}] DATA RESET`],
      };

    // ========== ORDERS ==========
    case ACTIONS.ADD_ORDER:
      return {
        ...state,
        data: {
          ...state.data,
          orders: [action.payload, ...state.data.orders].slice(0, 500),
        },
        version: state.version + 1,
        logs: [`[${timestamp}] ADD_ORDER #${action.payload.orderNumber}`, ...state.logs].slice(0, 20),
      };
      
    case ACTIONS.UPDATE_ORDER:
      return {
        ...state,
        data: {
          ...state.data,
          orders: state.data.orders.map(o =>
            o.id === action.payload.id ? { ...o, ...action.payload.updates } : o
          ),
        },
        version: state.version + 1,
        logs: [`[${timestamp}] UPDATE_ORDER id=${action.payload.id}`, ...state.logs].slice(0, 20),
      };
      
    case ACTIONS.DELETE_ORDER: {
      const newOrders = state.data.orders.filter(o => o.id !== action.payload);
      return {
        ...state,
        data: {
          ...state.data,
          orders: newOrders,
        },
        version: state.version + 1,
        logs: [
          `[${timestamp}] DELETE_ORDER id=${action.payload} (${state.data.orders.length} -> ${newOrders.length})`,
          ...state.logs
        ].slice(0, 20),
      };
    }

    // ========== PIZZAS ==========
    case ACTIONS.ADD_PIZZA:
      return {
        ...state,
        data: {
          ...state.data,
          pizzas: [...state.data.pizzas, action.payload],
        },
        version: state.version + 1,
      };
      
    case ACTIONS.UPDATE_PIZZA:
      return {
        ...state,
        data: {
          ...state.data,
          pizzas: state.data.pizzas.map(p =>
            p.nr === action.payload.nr ? { ...p, ...action.payload.updates } : p
          ),
        },
        version: state.version + 1,
      };
      
    case ACTIONS.DELETE_PIZZA: {
      const newPizzas = state.data.pizzas.filter(p => p.nr !== action.payload);
      return {
        ...state,
        data: {
          ...state.data,
          pizzas: newPizzas,
        },
        version: state.version + 1,
        logs: [`[${timestamp}] DELETE_PIZZA nr=${action.payload}`, ...state.logs].slice(0, 20),
      };
    }

    // ========== MENU ==========
    case ACTIONS.ADD_MENU_ITEM:
      return {
        ...state,
        data: {
          ...state.data,
          menu: [...state.data.menu, action.payload],
        },
        version: state.version + 1,
      };
      
    case ACTIONS.UPDATE_MENU_ITEM:
      return {
        ...state,
        data: {
          ...state.data,
          menu: state.data.menu.map(m =>
            m.id === action.payload.id ? { ...m, ...action.payload.updates } : m
          ),
        },
        version: state.version + 1,
      };
      
    case ACTIONS.DELETE_MENU_ITEM: {
      const newMenu = state.data.menu.filter(m => m.id !== action.payload);
      return {
        ...state,
        data: {
          ...state.data,
          menu: newMenu,
        },
        version: state.version + 1,
        logs: [`[${timestamp}] DELETE_MENU_ITEM id=${action.payload}`, ...state.logs].slice(0, 20),
      };
    }

    // ========== ADDONS ==========
    case ACTIONS.ADD_ADDON:
      return {
        ...state,
        data: { ...state.data, addons: [...state.data.addons, action.payload] },
        version: state.version + 1,
      };
      
    case ACTIONS.UPDATE_ADDON:
      return {
        ...state,
        data: {
          ...state.data,
          addons: state.data.addons.map(a => a.id === action.payload.id ? { ...a, ...action.payload.updates } : a),
        },
        version: state.version + 1,
      };
      
    case ACTIONS.DELETE_ADDON:
      return {
        ...state,
        data: { ...state.data, addons: state.data.addons.filter(a => a.id !== action.payload) },
        version: state.version + 1,
      };

    // ========== SAUCES ==========
    case ACTIONS.ADD_SAUCE:
      return {
        ...state,
        data: { ...state.data, sauces: [...state.data.sauces, action.payload] },
        version: state.version + 1,
      };
      
    case ACTIONS.UPDATE_SAUCE:
      return {
        ...state,
        data: {
          ...state.data,
          sauces: state.data.sauces.map(s => s.id === action.payload.id ? { ...s, ...action.payload.updates } : s),
        },
        version: state.version + 1,
      };
      
    case ACTIONS.DELETE_SAUCE:
      return {
        ...state,
        data: { ...state.data, sauces: state.data.sauces.filter(s => s.id !== action.payload) },
        version: state.version + 1,
      };

    // ========== DISCOUNTS ==========
    case ACTIONS.ADD_DISCOUNT:
      return {
        ...state,
        data: { ...state.data, discounts: [...state.data.discounts, action.payload] },
        version: state.version + 1,
      };
      
    case ACTIONS.UPDATE_DISCOUNT:
      return {
        ...state,
        data: {
          ...state.data,
          discounts: state.data.discounts.map(d => d.id === action.payload.id ? { ...d, ...action.payload.updates } : d),
        },
        version: state.version + 1,
      };
      
    case ACTIONS.DELETE_DISCOUNT:
      return {
        ...state,
        data: { ...state.data, discounts: state.data.discounts.filter(d => d.id !== action.payload) },
        version: state.version + 1,
      };

    // ========== PROMOTIONS ==========
    case ACTIONS.ADD_PROMO:
      return {
        ...state,
        data: { ...state.data, promotions: [...state.data.promotions, action.payload] },
        version: state.version + 1,
      };
      
    case ACTIONS.UPDATE_PROMO:
      return {
        ...state,
        data: {
          ...state.data,
          promotions: state.data.promotions.map(p => p.id === action.payload.id ? { ...p, ...action.payload.updates } : p),
        },
        version: state.version + 1,
      };
      
    case ACTIONS.DELETE_PROMO:
      return {
        ...state,
        data: { ...state.data, promotions: state.data.promotions.filter(p => p.id !== action.payload) },
        version: state.version + 1,
      };

    // ========== PACKAGING ==========
    case ACTIONS.ADD_PACKAGING:
      return {
        ...state,
        data: { ...state.data, packaging: [...state.data.packaging, action.payload] },
        version: state.version + 1,
      };
      
    case ACTIONS.UPDATE_PACKAGING:
      return {
        ...state,
        data: {
          ...state.data,
          packaging: state.data.packaging.map(p => p.id === action.payload.id ? { ...p, ...action.payload.updates } : p),
        },
        version: state.version + 1,
      };
      
    case ACTIONS.DELETE_PACKAGING:
      return {
        ...state,
        data: { ...state.data, packaging: state.data.packaging.filter(p => p.id !== action.payload) },
        version: state.version + 1,
      };

    // ========== LOCATIONS - CITIES ==========
    case ACTIONS.ADD_CITY:
      return {
        ...state,
        data: {
          ...state.data,
          locations: {
            ...state.data.locations,
            cities: [...state.data.locations.cities, action.payload],
          },
        },
        version: state.version + 1,
      };
      
    case ACTIONS.UPDATE_CITY:
      return {
        ...state,
        data: {
          ...state.data,
          locations: {
            ...state.data.locations,
            cities: state.data.locations.cities.map(c => c.id === action.payload.id ? { ...c, ...action.payload.updates } : c),
          },
        },
        version: state.version + 1,
      };
      
    case ACTIONS.DELETE_CITY:
      return {
        ...state,
        data: {
          ...state.data,
          locations: {
            ...state.data.locations,
            cities: state.data.locations.cities.filter(c => c.id !== action.payload),
            streets: state.data.locations.streets.filter(s => s.cityId !== action.payload),
          },
        },
        version: state.version + 1,
      };

    // ========== LOCATIONS - STREETS ==========
    case ACTIONS.ADD_STREET:
      return {
        ...state,
        data: {
          ...state.data,
          locations: {
            ...state.data.locations,
            streets: [...state.data.locations.streets, action.payload],
          },
        },
        version: state.version + 1,
      };
      
    case ACTIONS.UPDATE_STREET:
      return {
        ...state,
        data: {
          ...state.data,
          locations: {
            ...state.data.locations,
            streets: state.data.locations.streets.map(s => s.id === action.payload.id ? { ...s, ...action.payload.updates } : s),
          },
        },
        version: state.version + 1,
      };
      
    case ACTIONS.DELETE_STREET:
      return {
        ...state,
        data: {
          ...state.data,
          locations: {
            ...state.data.locations,
            streets: state.data.locations.streets.filter(s => s.id !== action.payload),
          },
        },
        version: state.version + 1,
      };

    // ========== LOCATIONS - LANDMARKS ==========
    case ACTIONS.ADD_LANDMARK:
      return {
        ...state,
        data: {
          ...state.data,
          locations: {
            ...state.data.locations,
            landmarks: [...state.data.locations.landmarks, action.payload],
          },
        },
        version: state.version + 1,
      };
      
    case ACTIONS.UPDATE_LANDMARK:
      return {
        ...state,
        data: {
          ...state.data,
          locations: {
            ...state.data.locations,
            landmarks: state.data.locations.landmarks.map(l => l.id === action.payload.id ? { ...l, ...action.payload.updates } : l),
          },
        },
        version: state.version + 1,
      };
      
    case ACTIONS.DELETE_LANDMARK:
      return {
        ...state,
        data: {
          ...state.data,
          locations: {
            ...state.data.locations,
            landmarks: state.data.locations.landmarks.filter(l => l.id !== action.payload),
          },
        },
        version: state.version + 1,
      };

    // ========== SETTINGS ==========
    case ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        data: {
          ...state.data,
          settings: { ...state.data.settings, ...action.payload },
        },
        version: state.version + 1,
      };

    // ========== DEBUG ==========
    case ACTIONS.ADD_LOG:
      return {
        ...state,
        logs: [`[${timestamp}] ${action.payload}`, ...state.logs].slice(0, 20),
      };
      
    case ACTIONS.CLEAR_LOGS:
      return {
        ...state,
        logs: [],
      };

    default:
      return state;
  }
};
