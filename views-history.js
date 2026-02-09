// ==================== HISTORY VIEW ====================
// Historia zamówień z wyszukiwaniem, edycją, usuwaniem

const HistoryView = ({ onClose, onReprint, onCopy }) => {
  const { db, actions, version } = useApp();
  const [filter, setFilter] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);

  const filtered = db.orders.filter(
    o =>
      !filter ||
      String(o.orderNumber).includes(filter) ||
      (o.address && o.address.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleDelete = (order) => {
    actions.addLog(`UI: handleDelete called for #${order.orderNumber}`);
    if (window.confirm(`Usunąć zamówienie #${order.orderNumber}?`)) {
      actions.addLog(`UI: User confirmed delete`);
      actions.deleteOrder(order.id);
    } else {
      actions.addLog(`UI: User cancelled delete`);
    }
  };

  const handleSaveEdit = (orderData) => {
    actions.updateOrder(orderData.id, orderData);
    setEditingOrder(null);
  };

  if (editingOrder) {
    return <CartView initialData={editingOrder} onClose={() => setEditingOrder(null)} onOrder={handleSaveEdit} />;
  }

  return (
    <Modal onClose={onClose} title="Historia">
      <div className="p-3 space-y-3" key={version}>
        <DebugPanel />
        
        <Input placeholder="ðŸ” Szukaj..." value={filter} onChange={e => setFilter(e.target.value)} />

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <Icon.History size={48} className="mx-auto mb-3 opacity-30" />
            <p>Brak zamówień</p>
          </div>
        ) : (
          filtered.map(order => (
            <div key={`${order.id}-${version}`} className="bg-white rounded-xl p-3 border-2 border-stone-200">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">#{order.orderNumber}</span>
                    {order.isTakeout && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Wynos</span>
                    )}
                  </div>
                  <div className="text-sm text-stone-500">
                    {formatDateFull(order.timestamp)} • {formatTime(order.timestamp)}
                  </div>
                  {order.address && (
                    <div className="text-sm text-stone-600 truncate mt-1">
                      {order.city} {order.address}
                    </div>
                  )}
                  <div className="font-semibold text-amber-600 mt-1">
                    {order.items.length} poz. • {formatPrice(order.total)}
                  </div>
                  <div className="text-xs text-stone-300 mt-1">id: {order.id}</div>
                </div>

                <div className="flex flex-col gap-1 ml-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => onReprint(order)}
                      className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center active:scale-95"
                    >
                      <Icon.Printer size={16} />
                    </button>
                    <button
                      onClick={() => onCopy(order)}
                      className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center active:scale-95"
                    >
                      <Icon.Copy size={16} />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingOrder(order)}
                      className="w-9 h-9 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center active:scale-95"
                    >
                      <Icon.Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(order)}
                      className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center active:scale-95"
                    >
                      <Icon.Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};
