'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  sale_price: number | null
  image_url: string | null
  stock: number
}

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  function handleAdd() {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        sale_price: product.sale_price,
        image_url: product.image_url,
      })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (product.stock === 0) {
    return (
      <button 
        disabled 
        className="w-full py-4 border-4 border-black bg-gray-200 text-gray-500 font-black uppercase tracking-widest cursor-not-allowed grayscale"
      >
        HẾT BẢO VẬT
      </button>
    )
  }

  return (
    <div className="space-y-6">
      {/* BỘ CHỌN SỐ LƯỢNG */}
      <div className="flex items-center gap-4">
        <span className="font-black text-xs uppercase tracking-widest text-black">Số lượng:</span>
        <div className="flex items-center border-4 border-black bg-white shadow-[4px_4px_0px_#000] overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-12 h-12 flex items-center justify-center bg-[#FFDE00] border-r-4 border-black hover:bg-black hover:text-white transition-colors font-black text-xl"
          >
            −
          </button>
          <span className="w-12 text-center font-black text-lg">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="w-12 h-12 flex items-center justify-center bg-[#00D1FF] border-l-4 border-black hover:bg-black hover:text-white transition-colors font-black text-xl"
          >
            +
          </button>
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase italic">Còn lại: {product.stock}</span>
      </div>

      {/* NÚT THÊM GIỎ HÀNG */}
      <button
        onClick={handleAdd}
        className={`
          w-full py-5 border-4 border-black font-comic-title text-xl uppercase tracking-tighter shadow-[8px_8px_0px_#000]
          transition-all active:shadow-none active:translate-x-1 active:translate-y-1
          ${added 
            ? 'bg-[#34A853] text-white animate-bounce-short' 
            : 'bg-[#FFDE00] text-black hover:bg-[#FF0055] hover:text-white'
          }
        `}
      >
        {added ? '💥 ĐÃ THÊM!' : '🛒 THU THẬP NGAY'}
      </button>
    </div>
  )
}