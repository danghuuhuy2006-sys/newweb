'use client'

import { useCartStore } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createOrder } from './actions'

// Schema validate với Zod 
const checkoutSchema = z.object({
  full_name: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  phone: z.string().regex(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ'),
  address: z.string().min(10, 'Địa chỉ quá ngắn'),
  note: z.string().optional(),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({ resolver: zodResolver(checkoutSchema) })

  async function onSubmit(data: CheckoutForm) {
    const result = await createOrder({
      ...data,
      items,
      total: totalPrice(),
    })

    if (result.success) {
      clearCart()
      router.push('/?ordered=success')
    } else {
      alert('Đặt hàng thất bại: ' + result.error)
    }
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 bg-[#f0f0f0] min-h-screen">
      {/* TIÊU ĐỀ TRANG PHONG CÁCH PANEL [cite: 9] */}
      <h1 className="text-6xl font-comic-title mb-12 border-l-[12px] border-[#00D1FF] pl-6 uppercase inline-block drop-shadow-[3px_3px_0px_#000]">
        Thanh toán đơn hàng
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-12">
        
        {/* KHỐI THÔNG TIN GIAO HÀNG [cite: 9] */}
        <div className="flex-1 space-y-6">
          <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_#000] -rotate-1 relative overflow-hidden">
            {/* Trang trí góc Panel */}
            <div className="absolute top-0 right-0 bg-[#FFDE00] border-b-4 border-l-4 border-black px-4 py-1 font-bold text-xs uppercase shadow-none">
              Ship tận tay! 🚚
            </div>

            <h2 className="font-comic-title text-3xl mb-8 border-b-4 border-black pb-2">Thông tin người nhận</h2>

            <div className="space-y-6">
              {/* Họ tên */}
              <div className="group">
                <label className="font-comic-text text-xl block mb-2 group-focus-within:text-[#FF0055]">
                  Họ và tên *
                </label>
                <input
                  {...register('full_name')}
                  className="w-full bg-gray-50 border-4 border-black px-4 py-3 text-lg font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#FFDE00] transition-all"
                  placeholder="NGUYỄN VĂN A"
                />
                {errors.full_name && (
                  <p className="text-red-500 font-bold text-sm mt-2 italic">⚠ {errors.full_name.message}</p>
                )}
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="font-comic-text text-xl block mb-2">Số điện thoại *</label>
                <input
                  {...register('phone')}
                  className="w-full bg-gray-50 border-4 border-black px-4 py-3 text-lg font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#00D1FF] transition-all"
                  placeholder="0912345678"
                />
                {errors.phone && (
                  <p className="text-red-500 font-bold text-sm mt-2 italic">⚠ {errors.phone.message}</p>
                )}
              </div>

              {/* Địa chỉ */}
              <div>
                <label className="font-comic-text text-xl block mb-2">Địa chỉ giao hàng *</label>
                <textarea
                  {...register('address')}
                  rows={3}
                  className="w-full bg-gray-50 border-4 border-black px-4 py-3 text-lg font-bold focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_0px_#FF0055] transition-all resize-none"
                  placeholder="Số nhà, tên đường, quận/huyện..."
                />
                {errors.address && (
                  <p className="text-red-500 font-bold text-sm mt-2 italic">⚠ {errors.address.message}</p>
                )}
              </div>

              {/* Ghi chú */}
              <div>
                <label className="font-comic-text text-xl block mb-2">Ghi chú (tùy chọn)</label>
                <input
                  {...register('note')}
                  className="w-full bg-gray-50 border-4 border-black px-4 py-3 text-lg font-bold focus:outline-none focus:bg-white transition-all"
                  placeholder="Giao giờ hành chính nhé shop..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* TÓM TẮT ĐƠN HÀNG [cite: 9] */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-[#FFDE00] border-4 border-black p-8 shadow-[12px_12px_0px_0px_#000] sticky top-24 rotate-1">
            <h2 className="font-comic-title text-4xl mb-6 border-b-4 border-black pb-2 text-center">TÓM TẮT 📚</h2>

            <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4 border-b-2 border-black/10 pb-3">
                  <div className="flex-1">
                    <p className="font-bold text-sm uppercase leading-tight">{item.name}</p>
                    <p className="font-comic-text text-xs text-[#FF0055]">SỐ LƯỢNG: {item.quantity}</p>
                  </div>
                  <span className="font-comic-title text-lg shrink-0">
                    {((item.sale_price ?? item.price) * item.quantity).toLocaleString('vi-VN')}₫
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-4 border-black pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-comic-title text-xl uppercase">Tổng cộng:</span>
                <span className="font-comic-title text-4xl text-[#FF0055] drop-shadow-[2px_2px_0px_#000]">
                  {totalPrice().toLocaleString('vi-VN')}₫
                </span>
              </div>
              <p className="text-[10px] font-bold text-right mt-2 uppercase italic">Miễn phí vận chuyển toàn quốc!</p>
            </div>

            {/* NÚT XÁC NHẬN BÙNG NỔ  */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-[#FFDE00] py-5 font-comic-title text-3xl shadow-[6px_6px_0px_0px_#FF0055] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative"
            >
              <span className="relative z-10">
                {isSubmitting ? 'ĐANG XỬ LÝ...' : 'CHỐT ĐƠN! 🔥'}
              </span>
              {/* Hiệu ứng nổ nhỏ khi hover */}
              <div className="absolute -top-4 -right-4 bg-white border-2 border-black text-black px-2 py-0.5 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                POW!
              </div>
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}