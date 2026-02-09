// ==================== IKONY SVG ====================

const Icon = {
  ChevronLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevronUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>,
  ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  Minus: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Plus: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash2: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit2: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
  Tag: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Settings: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6"/></svg>,
  History: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>,
  ShoppingCart: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  Copy: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Printer: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  X: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>,
  MapPin: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Package: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  Key: ({ size = 18 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
};

// ==================== BUTTON ====================

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-gradient-amber text-white shadow-medium hover:shadow-strong',
    success: 'bg-gradient-emerald text-white shadow-medium hover:shadow-strong',
    danger: 'bg-rose-500 text-white shadow-medium hover:bg-rose-600',
    secondary: 'bg-stone-200 hover:bg-stone-300 text-stone-700 shadow-soft',
  };

  return (
    <button
      className={`py-2.5 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ==================== TILE ====================

const Tile = ({ children, onClick, active }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-xl text-left border-2 w-full tile-hover transition-all ${
      active ? 'border-primary-400 bg-amber-50 shadow-medium' : 'bg-white border-stone-200 hover:border-primary-300 shadow-soft'
    }`}
  >
    {children}
  </button>
);

// ==================== MODAL ====================

const Modal = ({ children, onClose, title, footer }) => (
  <div className="fixed inset-0 z-50 flex flex-col bg-stone-100">
    <div className="flex items-center justify-between p-2 bg-white border-b shrink-0 shadow-soft">
      <button
        onClick={onClose}
        className="w-9 h-9 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
      >
        <Icon.ChevronLeft />
      </button>
      <h2 className="font-bold text-base truncate px-2">{title}</h2>
      <div className="w-9" />
    </div>
    <div className="flex-1 overflow-y-auto">{children}</div>
    {footer && <div className="p-2 bg-white border-t shrink-0 shadow-strong">{footer}</div>}
  </div>
);

// ==================== SECTION ====================

const Section = ({ title, children, collapsible = false, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <div
        className={`flex items-center justify-between mb-2 ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wide">{title}</div>
        {collapsible && (isOpen ? <Icon.ChevronUp /> : <Icon.ChevronDown />)}
      </div>
      {(!collapsible || isOpen) && children}
    </div>
  );
};

// ==================== CHIP ====================

const Chip = ({ active, onClick, children, inactive, small }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center rounded-full font-medium border-2 chip-interactive ${
      small ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
    } ${
      active
        ? 'bg-primary-100 text-primary-800 border-primary-400 shadow-soft'
        : inactive
        ? 'bg-red-100 text-red-600 border-red-300 line-through'
        : 'bg-white text-stone-600 border-stone-300 hover:border-primary-300 shadow-soft'
    }`}
  >
    {children}
  </button>
);

// ==================== INPUT ====================

const Input = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-xs font-semibold text-stone-500 mb-1">{label}</label>}
    <input
      className="w-full bg-white"
      {...props}
    />
  </div>
);

// ==================== SELECT ====================

const Select = ({ label, options, ...props }) => (
  <div>
    {label && <label className="block text-xs font-semibold text-stone-500 mb-1">{label}</label>}
    <select
      className="w-full bg-white"
      {...props}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// ==================== TOGGLE ====================

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer select-none">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    <div className={`relative w-11 h-6 rounded-full ${checked ? 'bg-amber-500' : 'bg-stone-300'}`}>
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </div>
    <span className="text-sm font-medium">{label}</span>
  </label>
);

// ==================== DEBUG PANEL ====================

const DebugPanel = () => {
  const { db, version, logs } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-2 mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left font-bold text-yellow-800 text-sm"
      >
        🍝› DEBUG (v{version}, orders: {db.orders.length}) {isOpen ? 'â–¼' : 'â–¶'}
      </button>
      {isOpen && (
        <div className="mt-2 text-xs font-mono bg-black text-green-400 p-2 rounded max-h-40 overflow-y-auto">
          {logs.length === 0 ? <div>Brak logów</div> : logs.map((log, index) => <div key={index}>{log}</div>)}
        </div>
      )}
    </div>
  );
};

// ==================== PIZZA TILE ====================

const PizzaTile = ({ pizza, sizeIdx, onClick }) => (
  <Tile onClick={() => onClick(pizza)}>
    <div className="font-semibold text-stone-700 text-sm truncate">{pizza.name}</div>
    <div className="flex justify-between items-center mt-1.5">
      <span className="text-xs text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded font-medium">
        {pizza.nr}
      </span>
      <span className="font-bold text-primary-600 price-primary-glow">{formatPrice(pizza.p[sizeIdx])}</span>
    </div>
  </Tile>
);
