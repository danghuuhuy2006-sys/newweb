import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CartBadge from './CartBadge'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-roboto',
})

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin'
  }

  return (
    <header className={`${roboto.className} bg-white border-b-8 border-black sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-6">
        
        {/* LOGO PHONG CÁCH TRUYỆN TRANH */}
        <Link href="/" className="group relative">
          <span className="absolute inset-0 bg-[#FFDE00] border-4 border-black translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></span>
          <span className="relative block bg-white border-4 border-black px-4 py-1 text-2xl font-black text-black uppercase tracking-tighter italic">
            🍑 Không mua không về
          </span>
        </Link>

        {/* SEARCH BAR PANEL */}
        <form action="/search" className="hidden md:flex flex-1 max-w-md group">
          <input
            name="q"
            placeholder="TÌM BẢO VẬT..."
            className="w-full border-4 border-black bg-white px-4 py-2 text-sm font-black uppercase tracking-widest focus:outline-none focus:bg-[#00D1FF]/10 placeholder:text-gray-300"
          />
          <button 
            type="submit" 
            className="bg-black text-white px-6 border-y-4 border-r-4 border-black hover:bg-[#FF0055] transition-colors"
          >
            🔍
          </button>
        </form>

        {/* NAVIGATION LINKS */}
        <nav className="flex items-center gap-6">
          <Link 
            href="/products" 
            className="text-sm font-black uppercase tracking-widest text-black hover:text-[#FF0055] hover:underline decoration-4 underline-offset-8 hidden md:block"
          >
            Sản phẩm
          </Link>

          {/* CART BADGE CONTAINER */}
          <div className="relative group">
            <CartBadge />
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/account" 
                className="bg-[#00D1FF] border-4 border-black px-4 py-2 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                👤 Tài khoản
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-[#FF0055] text-white border-4 border-black px-4 py-2 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rotate-2 hover:rotate-0"
                >
                  ⚙️ Admin
                </Link>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="bg-[#FFDE00] text-black border-4 border-black px-6 py-2 text-sm font-black uppercase tracking-widest shadow-[6px_6px_0px_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}