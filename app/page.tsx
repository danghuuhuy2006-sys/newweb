import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch danh mục từ database
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .limit(6)

  // Fetch sản phẩm mới nhất
  const { data: newProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <main className="bg-[#f0f0f0] min-h-screen">
      {/* Banner hero phong cách Comic */}
      <section className="bg-[#00D1FF] border-b-[4px] border-black py-20 px-4 text-center overflow-hidden relative">
        <div className="relative z-10">
          <h1 className="text-6xl md:text-8xl font-comic-title text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] -rotate-2 mb-6">
            CHÀO MỪNG ĐẾN VỚI <br /> KHÔNG MUA KHÔNG VỀ
          </h1>
          <p className="text-2xl font-comic-text bg-white border-4 border-black px-6 py-2 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
            Ở đây có mấy con lạ
          </p>
          <div className="block">
            <Link
              href="/products"
              className="bg-[#FFDE00] text-black text-2xl font-comic-title border-4 border-black px-12 py-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all inline-block"
            >
              MUA ĐI NHÉ! 😡
            </Link>
          </div>
        </div>
        {/* Hiệu ứng chấm bi Halftone trang trí */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_10%,transparent_10%)] bg-[length:20px_20px]"></div>
      </section>

      {/* Danh mục nổi bật theo dạng khung hình Panel */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-5xl font-comic-title mb-10 border-l-[10px] border-[#FF0055] pl-4 uppercase">
          Danh mục nổi bật
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="bg-white border-4 border-black p-4 text-center shadow-[6px_6px_0px_0px_#FFDE00] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
            >
              <div className="w-16 h-16 bg-[#00D1FF] border-2 border-black rounded-full mx-auto mb-3 flex items-center justify-center text-3xl shadow-[3px_3px_0px_0px_#000]">
                {cat.icon || '📚'}
              </div>
              <span className="text-lg font-bold uppercase tracking-tight group-hover:text-[#FF0055] transition">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sản phẩm mới nhất - Grid Layout */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-5xl font-comic-title border-l-[10px] border-[#00D1FF] pl-4 uppercase">
            Sản phẩm mới nhất
          </h2>
          <Link 
            href="/products" 
            className="font-comic-text text-xl text-[#FF0055] hover:underline decoration-4 underline-offset-4"
          >
            Xem tất cả 🌸
          </Link>
        </div>
        
        {/* Grid sản phẩm [cite: 10] */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {newProducts?.map((product) => (
            <div key={product.id} className="hover:scale-[1.02] transition-transform">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Thông báo đẩy (Call to Action) */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-[#FF0055] border-4 border-black p-8 shadow-[12px_12px_0px_0px_#000] text-center rotate-1">
          <h3 className="text-4xl font-comic-title text-white mb-4">BẠN ĐÃ ĐĂNG KÝ CHƯA?</h3>
          <p className="text-xl font-comic-text text-white mb-6">Đừng để lỡ các chương truyện (sản phẩm) mới nhất!</p>
          <button className="bg-white border-4 border-black px-8 py-2 font-bold uppercase shadow-[4px_4px_0px_0px_#000]">
            ĐĂNG KÝ NGAY!
          </button>
        </div>
      </section>
    </main>
  )
}