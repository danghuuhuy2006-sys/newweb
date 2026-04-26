const STATUS_MAP: Record<string, { label: string; color: string; shadow: string }> = {
  pending:   { label: 'CHỜ XÁC NHẬN', color: 'bg-[#FFDE00]', shadow: 'shadow-[#000]' },
  confirmed: { label: 'ĐÃ XÁC NHẬN',  color: 'bg-[#00D1FF]', shadow: 'shadow-[#000]' },
  shipping:  { label: 'ĐANG GIAO',    color: 'bg-[#FF0055]', shadow: 'shadow-[#000]' },
  delivered: { label: 'ĐÃ GIAO',      color: 'bg-[#34A853]', shadow: 'shadow-[#000]' },
  cancelled: { label: 'ĐÃ HỦY',       color: 'bg-gray-400',  shadow: 'shadow-[#000]' },
}

export default function OrderHistory({ orders }: { orders: any[] }) {
  if (orders.length === 0) {
    return (
      /* TRẠNG THÁI TRỐNG PHONG CÁCH COMIC */
      <div className="bg-white border-4 border-black p-12 shadow-[8px_8px_0px_0px_#ccc] text-center rotate-1">
        <div className="text-6xl mb-4">🏜️</div>
        <p className="font-comic-text text-2xl text-gray-400 uppercase italic">
          Bầu trời trống rỗng... Bạn chưa có đơn nào!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border-4 border-black p-6 shadow-[12px_12px_0px_0px_#000] relative">
      {/* Tiêu đề dán nhãn */}
      <div className="absolute -top-6 -left-4 bg-black text-[#FFDE00] border-4 border-black px-6 py-2 -rotate-2 shadow-[4px_4px_0px_0px_#FF0055]">
        <h2 className="font-comic-title text-2xl uppercase tracking-tighter">Nhật ký mua hàng</h2>
      </div>

      <div className="space-y-8 mt-6">
        {orders.map((order) => {
          const status = STATUS_MAP[order.status] ?? { label: order.status, color: 'bg-gray-100', shadow: 'shadow-none' }
          
          return (
            /* MỖI ĐƠN HÀNG LÀ MỘT PANEL */
            <div key={order.id} className="border-4 border-black p-5 shadow-[6px_6px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all bg-white group">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 border-b-4 border-black border-dashed pb-4">
                <div>
                  <p className="font-mono text-sm font-black bg-gray-100 px-2 py-1 inline-block border-2 border-black mb-2">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm font-bold text-gray-500 ml-1">
                    NGÀY LÊN ĐƠN: {new Date(order.created_at).toLocaleDateString('vi-VN')}
                  </p>
                  <p className="font-comic-title text-3xl text-[#FF0055] mt-1 drop-shadow-[2px_2px_0px_#000]">
                    {order.total.toLocaleString('vi-VN')}₫
                  </p>
                </div>
                
                {/* Badge trạng thái phong cách nhãn dán */}
                <span className={`font-comic-title text-lg px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_#000] -rotate-3 ${status.color} text-black`}>
                  {status.label}
                </span>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="space-y-3">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-lg font-comic-text group-hover:text-[#00D1FF] transition-colors">
                    <span className="truncate flex-1 mr-4">
                      ● {item.products?.name ?? 'VẬT PHẨM LẠ'} <span className="text-black font-black underline">x{item.quantity}</span>
                    </span>
                    <span className="shrink-0 font-bold">
                      {(item.unit_price * item.quantity).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                ))}
              </div>

              {/* Trang trí góc Panel */}
              <div className="flex justify-end mt-4">
                <div className="w-8 h-2 bg-black"></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}