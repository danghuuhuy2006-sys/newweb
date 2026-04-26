'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-roboto',
})

export default function CartBadge() {
  const totalItems = useCartStore((state) => state.totalItems())

  return (
    <Link 
      href="/cart" 
      className={`${roboto.className} relative inline-flex items-center gap-2 px-4 py-2 bg-white border-4 border-black font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group`}
    >
      <span className="text-lg group-hover:scale-125 transition-transform">🛒</span>
      <span className="hidden sm:inline">Giỏ hàng</span>
      
      {totalItems > 0 && (
        <span className="absolute -top-3 -right-3 bg-[#FF0055] text-white text-[10px] w-7 h-7 border-4 border-black rounded-full flex items-center justify-center font-black shadow-[2px_2px_0px_#000] animate-bounce-short">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}

      {/* Hiệu ứng trang trí khi có hàng */}
      {totalItems > 0 && (
        <div className="absolute -inset-1 border-2 border-dashed border-[#FFDE00] opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
      )}
    </Link>
  )
}