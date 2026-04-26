import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const navItems = [
  { href: '/admin',          label: '📊 DASHBOARD' },
  { href: '/admin/products', label: '📦 SẢN PHẨM' },
  { href: '/admin/orders',   label: '🧾 ĐƠN HÀNG' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen bg-[#f0f0f0]">
      {/* Sidebar - Cột báo chí */}
      <aside className="w-72 bg-white border-r-8 border-black shrink-0 sticky top-0 h-screen flex flex-col p-6 shadow-[10px_0px_0px_0px_#FFDE00]">
        <div className="mb-12">
          <Link href="/admin" className="block">
            <div className="bg-black text-[#FFDE00] border-4 border-black p-4 rotate-[-2deg] shadow-[4px_4px_0px_0px_#FF0055]">
              <p className="text-3xl font-comic-title uppercase leading-none">Admin<br/>Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block font-comic-title text-2xl border-4 border-black p-3 bg-white hover:bg-[#00D1FF] hover:translate-x-2 transition-all shadow-[4px_4px_0px_0px_#000] active:shadow-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="mt-auto border-t-8 border-black border-double pt-6">
          <div className="bg-[#FF0055] text-white border-4 border-black p-3 shadow-[4px_4px_0px_0px_#000] rotate-1">
            <p className="text-xs font-black uppercase truncate">{user.email}</p>
            <p className="text-xl font-comic-title uppercase">QUẢN TRỊ VIÊN</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-12 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}