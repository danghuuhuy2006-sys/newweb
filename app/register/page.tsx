'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { z } from 'zod'

// 1. Schema validate với Zod
const registerSchema = z.object({
  full_name: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .min(6, 'Mật khẩu tối thiểu 6 ký tự')
    .refine((value) => !/\s/.test(value), {
      message: 'Mật khẩu không được chứa khoảng trắng',
    }),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [form, setForm] = useState<RegisterForm>({ 
    full_name: '', 
    email: '', 
    password: '' 
  })
  
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterForm, string>>>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  // Danh sách các trường input
  const inputFields: { 
    name: keyof RegisterForm; 
    label: string; 
    type: string; 
    placeholder: string 
  }[] = [
    { name: 'full_name', label: 'Họ và tên', type: 'text', placeholder: 'NGUYỄN VĂN A' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'YOU@EXAMPLE.COM' },
    { name: 'password', label: 'Mật khẩu', type: 'password', placeholder: '••••••••' },
  ]

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setServerError('')

    const result = registerSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterForm, string>> = {}
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof RegisterForm
        if (path) fieldErrors[path] = issue.message
      })
      setErrors(fieldErrors)
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setServerError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('users').upsert({
        id: data.user.id,
        full_name: form.full_name,
      })
    }

    router.push('/login?registered=1')
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f0f0f0] px-4 py-10">
      {/* Container chính phong cách Panel truyện tranh */}
      <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000] p-8 w-full max-w-md rotate-1 relative overflow-hidden">
        {/* Trang trí góc Panel */}
        <div className="absolute -top-2 -right-2 bg-[#FF0055] text-white font-bold px-4 py-1 border-4 border-black -rotate-12 shadow-[4px_4px_0px_0px_#000] z-10 text-xs">
          MỚI!
        </div>

        <h1 className="text-5xl font-comic-title text-black mb-2 uppercase tracking-tighter drop-shadow-[2px_2px_0px_#FFDE00]">
          Tạo tài khoản
        </h1>
        <p className="font-comic-text text-lg text-gray-600 mb-8">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-[#FF0055] hover:underline decoration-2 underline-offset-4">
            Đăng nhập ngay
          </Link>
        </p>

        {/* Thông báo lỗi từ server phong cách Action Bubble */}
        {serverError && (
          <div className="bg-[#FFDE00] border-4 border-black text-black font-bold px-4 py-3 mb-6 shadow-[4px_4px_0px_0px_#000] -rotate-1 animate-pulse">
            ⚠ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {inputFields.map((field) => (
            <div key={field.name}>
              <label className="font-comic-text text-xl block mb-2">
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                value={form[field.name]}
                onChange={handleChange}
                className="w-full border-4 border-black px-4 py-3 text-lg font-bold focus:outline-none focus:bg-[#00D1FF]/10 focus:shadow-[4px_4px_0px_0px_#00D1FF] transition-all placeholder:text-gray-300 uppercase"
                placeholder={field.placeholder}
              />
              {errors[field.name] && (
                <p className="text-[#FF0055] font-bold text-sm mt-2 italic drop-shadow-[1px_1px_0px_#fff]">
                  ⚠ {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {/* Nút đăng ký bùng nổ */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-[#FFDE00] py-5 font-comic-title text-4xl shadow-[8px_8px_0px_0px_#FF0055] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 active:scale-95 group relative"
          >
            <span className="relative z-10 uppercase">
              {loading ? 'ĐANG TẠO...' : 'GIA NHẬP! 🔥'}
            </span>
            {/* Hiệu ứng nổ nhỏ khi hover */}
            <div className="absolute -top-3 -left-3 bg-white border-2 border-black text-black px-2 py-0.5 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-black">
              BAM!
            </div>
          </button>
        </form>
      </div>
    </main>
  )
}