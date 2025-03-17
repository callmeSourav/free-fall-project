'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FiHome, FiCompass, FiEdit2, FiInfo } from 'react-icons/fi'
import Logo from './Logo'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const mobileMenu = document.getElementById('mobile-menu')
    if (mobileMenu) {
      mobileMenu.classList.toggle('hidden', !isMenuOpen)
    }
  }, [isMenuOpen])

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
              <FiHome className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link href="/share" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
              <FiEdit2 className="w-5 h-5" />
              <span>Share</span>
            </Link>
            <Link href="/explore" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
              <FiCompass className="w-5 h-5" />
              <span>Explore</span>
            </Link>
            <Link href="/about" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
              <FiInfo className="w-5 h-5" />
              <span>About</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden hidden bg-white border-t" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <FiHome className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link
            href="/share"
            className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <FiEdit2 className="w-5 h-5" />
            <span>Share</span>
          </Link>
          <Link
            href="/explore"
            className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <FiCompass className="w-5 h-5" />
            <span>Explore</span>
          </Link>
          <Link
            href="/about"
            className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <FiInfo className="w-5 h-5" />
            <span>About</span>
          </Link>
        </div>
      </div>
    </nav>
  )
} 