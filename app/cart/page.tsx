'use client'

import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()

  // 1. GIAO DIỆN KHI GIỎ HÀNG TRỐNG
  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="inline-block bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_#FFDE00] -rotate-2">
          <div className="text-8xl mb-4">🛒❓</div>
          <h1 className="text-4xl font-comic-title mb-4">GIỎ TRỐNG TRƠN!</h1>
          <p className="font-comic-text text-xl mb-8 text-gray-600">
            Bạn chưa chọn được con "Dưa chuột" nào sao?
          </p>
          <Link 
            href="/products" 
            className="inline-block bg-[#00D1FF] text-black border-4 border-black px-8 py-3 font-comic-title text-2xl shadow-[5px_5px_0px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            ĐI MUA NGAY! 🏃‍♂️
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Tiêu đề trang phong cách Panel */}
      <h1 className="text-5xl font-comic-title mb-10 border-l-[10px] border-[#FF0055] pl-6 uppercase inline-block">
        Giỏ hàng của bạn ({items.length})
      </h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* DANH SÁCH SẢN PHẨM */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border-4 border-black p-5 flex flex-col sm:flex-row gap-6 shadow-[8px_8px_0px_0px_#00D1FF] relative overflow-hidden"
            >
              {/* Ảnh sản phẩm với viền đen */}
              <div className="relative w-full sm:w-32 h-32 border-4 border-black bg-gray-100 shrink-0">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                )}
              </div>

              {/* Thông tin sản phẩm */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link 
                    href={`/products/${item.slug}`} 
                    className="text-2xl font-comic-title hover:text-[#FF0055] transition-colors leading-tight"
                  >
                    {item.name}
                  </Link>
                  <p className="font-comic-text text-xl text-[#FF0055] mt-1">
                    {(item.sale_price ?? item.price).toLocaleString('vi-VN')}₫
                  </p>
                </div>

                {/* Điều chỉnh số lượng phong cách nút bấm Comic */}
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center border-4 border-black bg-white overflow-hidden shadow-[3px_3px_0px_0px_#000]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center font-bold text-2xl hover:bg-[#FFDE00] border-r-4 border-black transition-colors"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center font-bold text-2xl hover:bg-[#FFDE00] border-l-4 border-black transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="font-comic-text text-sm text-gray-500 hover:text-black hover:underline decoration-2 underline-offset-4"
                  >
                    LOẠI BỎ 🗑️
                  </button>
                </div>
              </div>

              {/* Thành tiền hiển thị nổi bật */}
              <div className="text-right flex flex-col justify-end">
                <p className="text-xs font-bold uppercase text-gray-400 mb-1">Thành tiền</p>
                <p className="font-comic-title text-3xl">
                  {((item.sale_price ?? item.price) * item.quantity).toLocaleString('vi-VN')}₫
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* TÓM TẮT ĐƠN HÀNG (SIDEBAR) */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-[#FFDE00] border-4 border-black p-6 shadow-[12px_12px_0px_0px_#000] sticky top-24 rotate-1">
            <h2 className="font-comic-title text-3xl mb-6 border-b-4 border-black pb-2">HÓA ĐƠN 📑</h2>
            
            <div className="space-y-4 font-bold uppercase text-sm mb-6">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{totalPrice().toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Vận chuyển:</span>
                <span className="bg-white border-2 border-black px-2 py-0.5 text-[10px]">FREE SHIP! ⚡</span>
              </div>
              <div className="border-t-4 border-black pt-4 flex flex-col gap-1">
                <span className="text-xs">TỔNG CỘNG:</span>
                <span className="font-comic-title text-4xl text-[#FF0055] drop-shadow-[2px_2px_0px_#000]">
                  {totalPrice().toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-black text-[#FFDE00] text-center py-4 font-comic-title text-2xl shadow-[6px_6px_0px_0px_#FF0055] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:scale-95"
            >
              THANH TOÁN NGAY! →
            </Link>
            
            <p className="text-[10px] font-bold text-center mt-4 uppercase italic">
              * Nhấn để kết thúc giao dịch siêu cấp này
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}