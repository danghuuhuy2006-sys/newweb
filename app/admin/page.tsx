import { supabaseAdmin } from '@/lib/supabase/admin'
import Link from 'next/link'

export default async function AdminDashboard() {
  // Fetch thống kê song song
  const [
    { count: totalProducts },
    { count: totalOrders },
    { data: recentOrders },
    { data: revenue },
  ] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders')
      .select('id, total, status, created_at')
      .order('created_at', { ascending: false })
      .limit(8),
    supabaseAdmin.from('orders')
      .select('total')
      .eq('status', 'delivered'),
  ])

  const totalRevenue = revenue?.reduce((sum, o) => sum + o.total, 0) ?? 0

  // Cấu hình màu sắc rực rỡ phong cách Comic
  const stats = [
    { label: 'Sản phẩm tại shop', value: totalProducts ?? 0, icon: '📦', color: 'bg-[#00D1FF]', shadow: 'shadow-[#000]', href: '/admin/products' },
    { label: 'Đơn hàng đã nhận', value: totalOrders ?? 0, icon: '🧾', color: 'bg-[#FFDE00]', shadow: 'shadow-[#000]', href: '/admin/orders' },
    { label: 'Doanh thu cửa hàng', value: totalRevenue.toLocaleString('vi-VN') + '₫', icon: '💰', color: 'bg-[#FF0055]', shadow: 'shadow-[#000]', href: '#' },
  ]

  const STATUS_MAP: Record<string, { label: string; color: string }> = {
    pending:   { label: 'CHỜ XÁC NHẬN', color: 'bg-[#FFDE00]' },
    confirmed: { label: 'ĐÃ XÁC NHẬN',  color: 'bg-[#00D1FF]' },
    shipping:  { label: 'ĐANG GIAO',    color: 'bg-[#FF0055] text-white' },
    delivered: { label: 'ĐÃ GIAO',      color: 'bg-[#34A853] text-white' },
    cancelled: { label: 'ĐÃ HỦY',       color: 'bg-gray-400' },
  }

  return (
    <div className="space-y-12">
      {/* Welcome Header phong cách Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="relative">
          <p className="bg-black text-white font-black text-xs uppercase tracking-[0.2em] px-3 py-1 inline-block mb-2 rotate-1">
            Chế độ quản trị viên
          </p>
          <h1 className="text-5xl font-comic-title text-black drop-shadow-[4px_4px_0px_#FFDE00] uppercase tracking-tighter">
            Dưa chuột không cá 🥒
          </h1>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-black text-[#FFDE00] border-4 border-black px-8 py-4 font-comic-title text-xl uppercase shadow-[6px_6px_0px_0px_#FF0055] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:scale-95"
        >
          + Thêm sản phẩm mới
        </Link>
      </div>

      {/* Thống kê dạng Card bùng nổ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s, index) => (
          <Link 
            key={s.label} 
            href={s.href} 
            className={`block border-4 border-black p-8 transition-all hover:-translate-y-2 ${s.color} ${s.shadow} shadow-[8px_8px_0px_0px_#000] ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-4xl font-black mb-1 text-black tracking-tighter drop-shadow-[2px_2px_0px_#fff]">{s.value}</p>
                <p className="text-sm font-comic-title uppercase text-black font-black">{s.label}</p>
              </div>
              <span className="text-4xl filter grayscale brightness-0">{s.icon}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Đơn hàng gần đây - Khung tranh lớn */}
      <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b-4 border-black bg-black text-white">
          <h2 className="font-comic-title text-2xl uppercase italic tracking-widest">Đơn hàng mới nhất</h2>
          <Link href="/admin/orders" className="text-sm font-black text-[#00D1FF] hover:underline decoration-4">
            XEM TẤT CẢ →
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f0f0f0] border-b-4 border-black text-black uppercase font-black text-xs">
                <th className="px-8 py-5 border-r-4 border-black">Mã định danh</th>
                <th className="px-8 py-5 border-r-4 border-black">Ngày đặt</th>
                <th className="px-8 py-5 border-r-4 border-black text-right">Thành tiền</th>
                <th className="px-8 py-5 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y-4 divide-black">
              {recentOrders?.map((order) => {
                const status = STATUS_MAP[order.status]
                return (
                  <tr key={order.id} className="hover:bg-[#00D1FF]/10 transition-colors group">
                    <td className="px-8 py-5 font-mono text-sm font-black text-black border-r-4 border-black">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-8 py-5 text-black font-bold border-r-4 border-black italic">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-8 py-5 font-comic-title text-right