import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const supabase = await createClient()

  // Thực hiện truy vấn tìm kiếm
  const { data: products } = q
    ? await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .ilike('name', `%${q}%`)   
        .limit(24)
    : { data: [] }

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 bg-[#f0f0f0] min-h-screen">
      {/* TIÊU ĐỀ TÌM KIẾM PHONG CÁCH PANEL */}
      <div className="mb-10 relative">
        <h1 className="text-5xl md:text-6xl font-comic-title bg-[#FFDE00] border-4 border-black p-6 inline-block shadow-[8px_8px_0px_0px_#000] -rotate-1 uppercase tracking-tighter">
          {q ? `KẾT QUẢ CHO: "${q}"` : 'TÌM KIẾM'}
        </h1>
        {/* Badge số lượng sản phẩm */}
        <div className="absolute -bottom-4 right-0 md:right-1/4 bg-[#FF0055] text-white border-4 border-black px-4 py-1 font-comic-text text-xl rotate-3 shadow-[4px_4px_0px_0px_#000]">
          TÌM THẤY {products?.length ?? 0} MÓN! 🎯
        </div>
      </div>

      {/* HIỂN THỊ KẾT QUẢ */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mt-16">
          {products.map((product) => (
            <div key={product.id} className="hover:scale-[1.03] transition-transform duration-200">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        /* TRẠNG THÁI KHÔNG TÌM THẤY */
        <div className="bg-white border-4 border-black p-16 text-center shadow-[12px_12px_0px_0px_#00D1FF] rotate-1 max-w-2xl mx-auto mt-20">
          <div className="text-8xl mb-6 drop-shadow-[4px_4px_0px_#000]">🕵️‍♂️</div>
          <h2 className="font-comic-title text-4xl mb-4 uppercase">KHÔNG THẤY GÌ HẾT!</h2>
          <p className="font-comic-text text-xl text-gray-600 italic">
            {q 
              ? 'Có vẻ như món đồ này đã bị đánh cắp hoặc chưa từng tồn tại...' 
              : 'Hãy nhập gì đó vào ô tìm kiếm để bắt đầu cuộc truy vết!'}
          </p>
          <div className="mt-8 border-t-4 border-black border-dashed pt-8">
            <p className="font-bold text-sm uppercase">Gợi ý từ thám tử:</p>
            <p className="text-sm font-medium text-gray-500 italic">"Thử kiểm tra lại chính tả hoặc dùng từ khóa khác xem sao!"</p>
          </div>
        </div>
      )}
    </main>
  )
}