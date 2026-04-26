import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AccountForm from './AccountForm'
import OrderHistory from './OrderHistory'
import LogoutButton from '@/components/layout/LogoutButton'

export const revalidate = 0;

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch profile
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch lịch sử đơn hàng + items
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, image_url))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 bg-[#f0f0f0] min-h-screen">
      {/* TIÊU ĐỀ TRANG PHONG CÁCH BOOM! */}
      <div className="mb-12 relative">
        <h1 className="text-6xl font-comic-title bg-black text-[#FFDE00] border-4 border-black px-8 py-4 inline-block shadow-[10px_10px_0px_0px_#FF0055] -rotate-1 uppercase tracking-tighter">
          Tổng hành dinh
        </h1>
        <div className="absolute -bottom-4 left-10 bg-white border-4 border-black px-4 py-1 font-comic-text text-xl rotate-2 shadow-[4px_4px_0px_0px_#000]">
          Chào mừng trở lại, {profile?.full_name?.split(' ').pop() || 'Anh hùng'}! ⚡
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-10 items-start">
        {/* SIDEBAR - THẺ ID NHÂN VẬT */}
        <div className="md:col-span-1 sticky top-24">
          <div className="bg-white border-4 border-black p-8 text-center shadow-[12px_12px_0px_0px_#00D1FF] rotate-1">
            <div className="relative w-32 h-32 mx-auto mb-6">
              {/* Khung ảnh đại diện phong cách Panel */}
              <div className="w-full h-full border-4 border-black bg-[#FFDE00] shadow-[6px_6px_0px_0px_#000] overflow-hidden flex items-center justify-center text-5xl">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                ) : '👤'}
              </div>
              {/* Badge Rank giả lập phong cách comic */}
              <div className="absolute -bottom-2 -right-2 bg-[#FF0055] text-white border-2 border-black px-2 py-1 text-xs font-black rotate-12">
                LEVEL 99
              </div>
            </div>

            <div className="space-y-2 border-t-4 border-black border-dashed pt-6">
              <p className="font-comic-title text-2xl text-black uppercase break-words">
                {profile?.full_name || 'VÔ DANH HIỆP SĨ'}
              </p>
              <p className="font-comic-text text-lg text-gray-500 italic bg-gray-100 border-2 border-black py-1 px-2 inline-block">
                {user.email}
              </p>
            </div>

            <div className="mt-8">
              <LogoutButton />
            </div>
          </div>
          
          {/* Một khối trang trí phụ */}
          <div className="mt-6 bg-[#FFDE00] border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000] -rotate-2 hidden md:block">
            <p className="font-comic-text font-bold text-center">"Đừng bao giờ từ bỏ việc sưu tầm đồ lạ!"</p>
          </div>
        </div>

        {/* NỘI DUNG CHÍNH */}
        <div className="md:col-span-2 space-y-12">
          {/* Panel Thông tin cá nhân */}
          <section className="relative">
             <AccountForm profile={profile} userId={user.id} />
          </section>

          {/* Panel Lịch sử đơn hàng */}
          <section className="relative">
             <OrderHistory orders={orders ?? []} />
          </section>
        </div>
      </div>
    </main>
  )
}