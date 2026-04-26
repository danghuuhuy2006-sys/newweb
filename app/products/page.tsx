import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'
import Link from 'next/link'

type SearchParams = {
  category?: string
  sort?: string
  page?: string
  min_price?: string
  max_price?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const page = Number(params.page ?? 1)
  const pageSize = 12
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  // 1. Lấy danh mục để hiển thị filter
  const { data: categories } = await supabase.from('categories').select('*')

  // 2. Build query sản phẩm
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)', { count: 'exact' })
    .eq('is_active', true)
    .range(from, to)

  if (params.category) {
    const cat = categories?.find((c) => c.slug === params.category)
    if (cat) query = query.eq('category_id', cat.id)
  }

  if (params.min_price) query = query.gte('price', Number(params.min_price))
  if (params.max_price) query = query.lte('price', Number(params.max_price))

  switch (params.sort) {
    case 'price_asc':  query = query.order('price', { ascending: true }); break
    case 'price_desc': query = query.order('price', { ascending: false }); break
    case 'newest':     query = query.order('created_at', { ascending: false }); break
    default:           query = query.order('created_at', { ascending: false })
  }

  const { data: products, count } = await query
  const totalPages = Math.ceil((count ?? 0) / pageSize)

  // Helper tạo URL
  function buildUrl(newParams: Record<string, string | undefined>) {
    const merged = { ...params, ...newParams, page: '1' }
    const qs = Object.entries(merged)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join('&')
    return `/products${qs ? '?' + qs : ''}`
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 bg-[#f0f0f0] min-h-screen">
      {/* TIÊU ĐỀ TRANG PHONG CÁCH PANEL */}
      <h1 className="text-6xl font-comic-title mb-12 border-l-[12px] border-[#FFDE00] pl-6 uppercase inline-block drop-shadow-[4px_4px_0px_#000]">
        Cửa hàng siêu cấp
      </h1>

      <div className="flex flex-col md:flex-row gap-10">
        {/* SIDEBAR FILTER PHONG CÁCH COMIC */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          {/* Lọc danh mục */}
          <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_#00D1FF] rotate-1">
            <h3 className="font-comic-title text-2xl mb-4 border-b-4 border-black pb-1">Danh mục</h3>
            <div className="space-y-2">
              <Link
                href={buildUrl({ category: undefined })}
                className={`block font-bold text-sm px-3 py-2 border-2 border-black transition-all ${!params.category ? 'bg-[#FFDE00] shadow-[3px_3px_0px_0px_#000]' : 'hover:bg-gray-100 shadow-none'}`}
              >
                TẤT CẢ SẢN PHẨM
              </Link>
              {categories?.map((cat) => (
                <Link
                  key={cat.id}
                  href={buildUrl({ category: cat.slug })}
                  className={`block font-bold text-sm px-3 py-2 border-2 border-black transition-all ${params.category === cat.slug ? 'bg-[#FFDE00] shadow-[3px_3px_0px_0px_#000]' : 'hover:bg-gray-100 shadow-none'}`}
                >
                  {cat.name.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          {/* Lọc giá */}
          <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_#FF0055] -rotate-1">
            <h3 className="font-comic-title text-2xl mb-4 border-b-4 border-black pb-1">Khoảng giá</h3>
            <div className="space-y-2">
              {[
                {label: 'TẤT CẢ GIÁ', min: undefined, max: undefined}, 
                { label: 'DƯỚI 1 TRIỆU', max: '1000000' },
                { label: '1 – 5 TRIỆU', min: '1000000', max: '5000000' },
                { label: '5 – 20 TRIỆU', min: '5000000', max: '20000000' },
                { label: 'TRÊN 20 TRIỆU', min: '20000000' },
              ].map((range) => (
                <Link
                  key={range.label}
                  href={buildUrl({ min_price: range.min, max_price: range.max })}
                  className="block font-bold text-xs px-3 py-2 border-2 border-black hover:bg-[#FF0055] hover:text-white transition-colors"
                >
                  {range.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* NỘI DUNG CHÍNH */}
        <div className="flex-1">
          {/* Sort bar & Counter */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <p className="font-comic-text text-xl bg-white border-2 border-black px-4 py-1 shadow-[4px_4px_0px_0px_#000]">
              {count} món hàng được tìm thấy!
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { label: 'MỚI NHẤT', value: 'newest' },
                { label: 'GIÁ THẤP ➜ CAO', value: 'price_asc' },
                { label: 'GIÁ CAO ➜ THẤP', value: 'price_desc' },
              ].map((opt) => (
                <Link
                  key={opt.value}
                  href={buildUrl({ sort: opt.value })}
                  className={`text-xs font-black px-4 py-2 border-4 border-black transition-all ${params.sort === opt.value ? 'bg-black text-white shadow-none translate-x-1 translate-y-1' : 'bg-white shadow-[4px_4px_0px_0px_#000] hover:bg-[#00D1FF]'}`}
                >
                  {opt.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Grid sản phẩm */}
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product.id} className="hover:scale-[1.03] transition-transform">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white border-4 border-black shadow-[10px_10px_0px_0px_#ccc]">
              <div className="text-6xl mb-4">💨</div>
              <h2 className="font-comic-title text-3xl uppercase">Không thấy gì hết!</h2>
              <p className="font-comic-text text-lg">Thử chỉnh bộ lọc xem sao nhé bạn ơi...</p>
            </div>
          )}

          {/* Phân trang phong cách Comic */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildUrl({ page: String(p) })}
                  className={`w-12 h-12 flex items-center justify-center border-4 border-black font-comic-title text-2xl transition-all ${p === page ? 'bg-[#FF0055] text-white shadow-none translate-x-1 translate-y-1' : 'bg-white shadow-[4px_4px_0px_0px_#000] hover:bg-[#FFDE00]'}`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}