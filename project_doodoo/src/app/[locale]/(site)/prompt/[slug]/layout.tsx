import Header from '@/components/common/Header'
import React from 'react'
import "../../../../globals.css";


export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header
        showCategoryNav={false}
      />
      <main>{children}</main>
    </>
  )
}

