import { ReactNode } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-wrapper">
      <Navbar />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  )
}
