import type { Metadata } from "next";
import { Bangers, Permanent_Marker, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar"; // Đảm bảo bạn đã tạo file này
import Footer from "@/components/layout/Footer"; // Đảm bảo bạn đã tạo file này

// 1. Khai báo các Font chữ phong cách truyện tranh 
const bangers = Bangers({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-bangers',
});

const permanentMarker = Permanent_Marker({
  weight: '400',
  subsets: ["latin"],
  variable: '--font-permanent-marker',
});

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ["latin", "vietnamese"],
  variable: '--font-roboto',
});

// 2. Cấu hình Metadata cho SEO [cite: 10]
export const metadata: Metadata = {
  title: "Comic Store | Thế giới Manga Siêu Cấp",
  description: "Website bán truyện tranh bản quyền với phong cách cực chất",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${roboto.variable} ${bangers.variable} ${permanentMarker.variable} font-sans bg-[#f0f0f0] text-black antialiased`}
      >
        {/* Lớp nền hiệu ứng chấm bi (Halftone) toàn trang */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_10%,transparent_10%)] bg-[length:25px_25px] z-0"></div>

        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Header/Navbar xuất hiện ở mọi trang [cite: 6] */}
          <Navbar />

          {/* Nội dung thay đổi theo từng Route [cite: 10] */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Footer xuất hiện ở mọi trang */}
          <Footer />
        </div>
      </body>
    </html>
  );
}