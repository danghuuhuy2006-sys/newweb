import Image from 'next/image'
import Link from 'next/link'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-roboto',
})

type Product = {
  id: string
  name: string
  slug: string
  price: number
  sale_price: number | null
  image_url: string | null
}

export default function ProductCard({ product }: { product: Product }) {
  const displayPrice = product.sale_price ?? product.price
  const hasDiscount = product.sale_price && product.sale_price < product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.sale_price! / product.price) * 100)
    : 0

  return (
    <Link href={`/products/${product.slug}`} className={`${roboto.className} group block`}>
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden transition-all group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 group-active:scale-95">
        
        {/* KHUNG ẢNH PANEL */}
        <div className="relative aspect-square bg-[#F0F0F0] border-b-4 border-black overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black/20 text-5xl">
              🖼️
            </div>
          )}

          {/* NHÃN GIẢM GIÁ BÙNG NỔ */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-[#FF0055] text-white text-xs font-black px-3 py-1 border-2 border-black shadow-[3px_3px_0px_#000] inline-block -rotate-6 group-hover:rotate-12 transition-transform uppercase">
                TIẾT KIỆM {discountPercent}%
              </span>
            </div>
          )}
          
          {/* LỚP PHỦ DECOR KHI HOVER */}
          <div className="absolute inset-0 bg-[#00D1FF]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>

        {/* NỘI DUNG THÔNG TIN */}
        <div className="p-4 space-y-3">
          <h3 className="font-black text-black uppercase tracking-tighter line-clamp-2 text-base leading-tight group-hover:text-[#FF0055] transition-colors">
            {product.name}
          </h3>
          
          <div className="flex flex-col gap-1">
            {hasDiscount && (
              <span className="text-gray-400 text-xs line-through font-bold decoration-black/30">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
            )}
            <div className="flex justify-between items-center">
              <span className="bg-[#FFDE00] border-2 border-black px-2 py-0.5 text-lg font-black text-black shadow-[2px_2px_0px_#000]">
                {displayPrice.toLocaleString('vi-VN')}₫
              </span>
              <span className="text-xl opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                🚀
              </span>
            </div>
          </div>
        </div>

        {/* THANH TRẠNG THÁI CUỐI THẺ */}
        <div className="h-2 bg-black w-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
      </div>
    </Link>
  )
}