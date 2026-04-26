'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  async function handleLogout() {
    // Hiệu ứng xác nhận nhanh trước khi đăng xuất nếu cần, 
    // ở đây ta thực hiện đăng xuất ngay lập tức
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="
        relative inline-flex items-center gap-2 
        bg-[#FF0055] text-white 
        border-4 border-black 
        px-4 py-2 
        text-xs font-black uppercase tracking-widest 
        shadow-[4px_4px_0px_#000] 
        hover:shadow-none hover:translate-x-1 hover:translate-y-1 
        transition-all 
        active:bg-black
      "
    >
      <span className="text-sm">🚪</span>
      Đăng xuất
      
      {/* Hiệu ứng tia chớp trang trí nhỏ khi hover */}
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FFDE00] border-2 border-black rotate-45 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </button>
  )
}