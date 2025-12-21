import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-gray-50 to-gray-100">
      <Navbar />
      <main className="grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout