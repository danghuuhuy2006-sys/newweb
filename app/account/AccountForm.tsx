'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  full_name?: string | null
  phone?: string | null
  address?: string | null
}

export default function AccountForm({ profile, userId }: { profile: Profile | null, userId: string }) {
  const supabase = createClient()
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    address: profile?.address ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    await supabase.from('users').upsert({ id: userId, ...form })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    /* CONTAINER CHÍNH PHONG CÁCH PANEL TRUYỆN TRANH */
    <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_#000] rotate-1 relative">
      {/* Tiêu đề bùng nổ (Boom!) */}
      <div className="flex items-center gap-4 mb-10 -ml-12">
        <div className="bg-[#FFDE00] border-4 border-black px-6 py-2 shadow-[4px_4px_0px_0px_#000] -rotate-3">
          <h2 className="font-comic-title text-3xl text-black uppercase tracking-tighter">
            Hồ sơ cá nhân 📝
          </h2>
        </div>
      </div>

      <div className="space-y-8">
        {[
          { key: 'full_name', label: 'Danh tính của bạn', placeholder: 'VD: SIÊU NHÂN A', color: '#00D1FF' },
          { key: 'phone', label: 'Đường dây nóng', placeholder: 'VD: 0912345678', color: '#FF0055' },
          { key: 'address', label: 'Căn cứ bí mật', placeholder: 'Số nhà, đường, quận...', color: '#FFDE00' },
        ].map((field) => (
          <div key={field.key} className="relative group">
            {/* Label phong cách Comic */}
            <label className="font-comic-text text-lg font-black text-black uppercase mb-2 block ml-1">
              {field.label}
            </label>
            <input
              value={form[field.key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className="w-full border-4 border-black px-6 py-4 text-lg font-bold text-black focus:outline-none focus:shadow-[6px_6px_0px_0px_#000] transition-all bg-white placeholder:text-gray-300 uppercase"
              placeholder={field.placeholder}
              style={{ 
                // Hiệu ứng focus thay đổi màu bóng dựa trên field
                borderColor: 'black'
              }}
            />
            {/* Trang trí góc input */}
            <div className={`absolute -right-2 -bottom-2 w-4 h-4 bg-black rotate-45 opacity-0 group-focus-within:opacity-100 transition-opacity`}></div>
          </div>
        ))}

        {/* NÚT LƯU BÙNG NỔ */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full md:w-auto px-10 py-5 border-4 border-black font-comic-title text-2xl uppercase tracking-widest transition-all active:scale-95 shadow-[8px_8px_0px_0px_#000] ${
            saved 
              ? 'bg-[#34A853] text-white' 
              : 'bg-[#FFDE00] text-black hover:bg-[#FF0055] hover:text-white'
          } disabled:opacity-60 relative overflow-hidden group`}
        >
          <span className="relative z-10 font-black">
            {saved ? 'Xong! Đã lưu thành công' : saving ? 'Đang gửi tin...' : 'Lưu thay đổi ngay! 🔥'}
          </span>
          {/* Hiệu ứng nổ nhỏ khi hover */}
          <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-200 opacity-10"></div>
        </button>
      </div>

      {/* Cảnh báo lỗi cấu hình Supabase từ ảnh */}
      {/* LƯU Ý: Ảnh lỗi cho thấy bạn đang thiếu biến môi trường NEXT_PUBLIC_SUPABASE_URL.
        Vui lòng kiểm tra file .env.local để tránh lỗi "supabaseUrl is required".
      */}
    </div>
  )
}