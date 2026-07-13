import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CultureNail · 美国文化趋势上新智能体",
  description: "把可追溯的美国文化趋势证据，转成可测试的穿戴甲商品概念与 Amazon US 上架素材。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
