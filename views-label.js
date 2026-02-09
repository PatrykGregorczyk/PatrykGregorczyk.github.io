// ==================== ORDER LABEL ====================
// Podgląd i wydruk etykiety zamówienia dla drukarki 58mm

const OrderLabel = ({ order, onClose, onConfirm }) => {
  const { db } = useApp();
  const svgRef = useRef();

  const pizzas = order.items.filter(i => i.type === 'pizza' && i.qty > 0);
  const others = order.items.filter(i => i.type !== 'pizza' && i.qty > 0);

  const orderTime = formatTime(order.timestamp);
  const orderDate = formatDate(order.timestamp);
  const deliveryMinutes = parseInt(order.deliveryTime) || 30;

  const scheduled = order.isScheduled && order.scheduledTime;
  const deliveryTime = scheduled
    ? order.scheduledTime
    : formatTime(new Date(new Date(order.timestamp).getTime() + deliveryMinutes * 60000));

  let deliveryDateStr = '';
  if (scheduled && order.scheduledDate && !isToday(order.scheduledDate)) {
    const d = new Date(order.scheduledDate);
    deliveryDateStr = String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0');
  }

  const W = 220;
  const HEADER_H = 36;
  const hasAddress = !order.isTakeout && order.address;
  const ADDRESS_H = hasAddress ? 44 : 0;

  let contentHeight = 0;
  if (pizzas.length > 0) {
    contentHeight += 14;
    pizzas.forEach(item => {
      contentHeight += 28;
      if (item.notes) contentHeight += 12;
      if (item.discount) contentHeight += 12;
    });
  }
  if (others.length > 0) {
    contentHeight += 14;
    contentHeight += others.length * 14;
  }
  if (order.globalDiscount) contentHeight += 14;
  contentHeight += 36;

  const HEIGHT = HEADER_H + ADDRESS_H + contentHeight + 8;

  const handlePrint = () => {
    const svg = new XMLSerializer().serializeToString(svgRef.current);
    const win = window.open('', '_blank');
    win.document.write(
      '<html><head><style>@page{size:58mm auto;margin:0}body{margin:0;display:flex;justify-content:center}</style></head><body>' +
        svg +
        '</body></html>'
    );
    win.document.close();
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  const headerBg = scheduled ? '#1a1a1a' : '#f5f5f4';
  const headerText = scheduled ? 'white' : '#1a1a1a';
  const dateColor = scheduled ? '#fbbf24' : '#1a1a1a';

  const renderContent = () => {
    let y = HEADER_H + ADDRESS_H;
    const elements = [];

    if (pizzas.length > 0) {
      elements.push(
        <text key="pizzas-header" x="8" y={y + 10} fontSize="8" fontWeight="bold" fill="#888">PIZZE</text>
      );
      y += 14;

      pizzas.forEach((item, i) => {
        const sizeIdx = getSizeIndex(item.size, db.settings);
        const sl = getSizeLetter(sizeIdx, db.settings);

        elements.push(
          <g key={`pizza-${i}`} transform={`translate(0, ${y})`}>
            <text x="8" y="10" fontSize="9" fill="#555">
              {item.name}{item.qty > 1 && ` x${item.qty}`}
            </text>
            <text x="8" y="24" fontSize="13" fontWeight="bold">
              {sl} <tspan fontStyle="italic" fontSize="15">{item.pizzaNr}</tspan>
              {item.isSplit && `/${item.splitPizzaNr}`}
            </text>
          </g>
        );
        y += 28;

        if (item.notes) {
          elements.push(
            <text key={`note-${i}`} x="14" y={y + 8} fontSize="7" fontStyle="italic" fill="#666">
              ! {item.notes}
            </text>
          );
          y += 12;
        }

        if (item.discount) {
          elements.push(
            <text key={`disc-${i}`} x="14" y={y + 8} fontSize="7" fill="#7c3aed">
              {item.discount.name}
            </text>
          );
          y += 12;
        }
      });
    }

    if (others.length > 0) {
      elements.push(
        <text key="others-header" x="8" y={y + 10} fontSize="8" fontWeight="bold" fill="#888">INNE</text>
      );
      y += 14;

      others.forEach((item, i) => {
        elements.push(
          <text key={`other-${i}`} x="8" y={y + 10} fontSize="9">
            {item.qty > 1 ? `${item.qty}x ` : ''}{item.name}
          </text>
        );
        y += 14;
      });
    }

    if (order.globalDiscount) {
      elements.push(
        <text key="global-disc" x="8" y={y + 10} fontSize="8" fill="#7c3aed">
          {order.globalDiscount.name}
        </text>
      );
      y += 14;
    }

    const payLabel = db.settings.paymentTypes.find(p => p.id === order.paymentType)?.label || 'Gotówka';

    elements.push(
      <g key="footer" transform={`translate(0, ${y})`}>
        <line x1="8" y1="4" x2={W - 8} y2="4" stroke="#ccc" strokeDasharray="3,3" />
        <text x="8" y="20" fontSize="10" fontWeight="bold">{payLabel}</text>
        {order.packaging > 0 && (
          <text x={W - 8} y="20" textAnchor="end" fontSize="8" fill="#666">
            opak: {formatPrice(order.packaging)}
          </text>
        )}
        <text x={W - 8} y="34" textAnchor="end" fontSize="14" fontWeight="900">
          {formatPrice(order.total)}
        </text>
      </g>
    );

    return elements;
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900 flex flex-col">
      <div className="flex justify-between items-center p-3 bg-stone-800">
        <span className="text-white font-bold">Podgląd</span>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handlePrint}>
            <Icon.Printer size={16} /> Drukuj
          </Button>
          <button onClick={onClose} className="w-10 h-10 rounded-lg bg-stone-700 text-white flex items-center justify-center">
            <Icon.X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex justify-center">
        <svg ref={svgRef} width={W} height={HEIGHT} viewBox={`0 0 ${W} ${HEIGHT}`} style={{ background: 'white', borderRadius: 12 }}>
          <rect x="0" y="0" width={W} height={HEADER_H} fill={headerBg} />
          {deliveryDateStr && (
            <text x="8" y="22" fontSize="12" fontWeight="bold" fill={dateColor}>{deliveryDateStr}</text>
          )}
          <text x={W / 2} y="24" fontSize="20" fontWeight="900" textAnchor="middle" fill={headerText}>
            {deliveryTime}
          </text>
          <text x={W - 8} y="14" fontSize="9" textAnchor="end" fill={scheduled ? '#888' : '#666'}>
            {orderTime}
          </text>
          <text x={W - 8} y="26" fontSize="8" textAnchor="end" fill={scheduled ? '#666' : '#999'}>
            {orderDate}
          </text>
          {!deliveryDateStr && (
            <text x="8" y="24" fontSize="16" fontWeight="900" fill={dateColor}>{order.orderNumber}.</text>
          )}

          {hasAddress && (
            <g transform={`translate(0, ${HEADER_H})`}>
              <rect x="0" y="0" width={W} height={ADDRESS_H} fill="#f0f0f0" />
              <text x="8" y="14" fontSize="11" fontWeight="bold">{order.city}</text>
              <text x="8" y="28" fontSize="10">{order.address}</text>
              <text x="8" y="40" fontSize="9" fill="#666">
                tel: {order.phone || '-'} {order.doorCode && `[${order.doorCode}]`}
              </text>
            </g>
          )}

          {renderContent()}
        </svg>
      </div>

      <div className="p-3 bg-stone-800">
        <Button variant="success" className="w-full" onClick={onConfirm}>
          <Icon.Check size={18} /> Zatwierdź
        </Button>
      </div>
    </div>
  );
};
