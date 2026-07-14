import Footer from '@/components/common/Footer'
import Header from '@/components/common/Header'
import React from 'react'
import "./globals.css";


export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

