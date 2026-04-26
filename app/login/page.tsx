'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email hoặc mật khẩu không đúng')
    } else {
      router.push('/')
      router.refresh()
    }
    setLoading(false)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0f0f0] px-4">
      {/* Container chính phong cách Panel truyện tranh */}
      <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-8 w-full max-w-md rotate-1">
        <h1 className="text-5xl font-comic-title text-black mb-2 uppercase tracking-tighter drop-shadow-[2px_2px_0px_#FFDE00]">
          Đăng nhập
        </h1>
        <p className="font-comic-text text-lg text-gray-600 mb-8">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-[#FF0055] hover:underline decoration-2 underline-offset-4">
            Đăng ký ngay
          </Link>
        </p>

        {/* Thông báo lỗi phong cách cảnh báo Comic */}
        {error && (
          <div className="bg-[#FFDE00] border-4 border-black text-black font-bold px-4 py-3 mb-6 shadow-[4px_4px_0px_0px_#000] -rotate-1">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="font-comic-text text-xl block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-4 border-black px-4 py-3 text-lg font-bold focus:outline-none focus:bg-[#00D1FF]/10 focus:shadow-[4px_4px_0px_0px_#00D1FF] transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="font-comic-text text-xl block mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-4 border-black px-4 py-3 text-lg font-bold focus:outline-none focus:bg-[#FF0055]/10 focus:shadow-[4px_4px_0px_0px_#FF0055] transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-[#FFDE00] py-4 font-comic-title text-3xl shadow-[6px_6px_0px_0px_#FF0055] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 active:scale-95"
          >
            {loading ? 'ĐANG VÀO...' : 'VÀO CỬA! 🚪'}
          </button>
        </form>

        <div className="my-8 flex items-center gap-3">
          <div className="flex-1 h-1 bg-black" />
          <span className="font-comic-text text-sm uppercase font-black">HOẶC</span>
          <div className="flex-1 h-1 bg-black" />
        </div>

        {/* Nút đăng nhập Google phong cách nút bấm nổi */}
        <button
          onClick={handleGoogle}
          className="w-full border-4 border-black bg-white py-3 font-bold text-lg shadow-[4px_4px_0px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          TIẾP TỤC VỚI GOOGLE
        </button>
      </div>
    </main>
  )
}