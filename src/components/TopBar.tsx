'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useAuth } from '../app/context/AuthContext'

export default function TopBar() {
    const pathname = usePathname()
    const isHome = pathname === '/' || pathname === ''
    const { user, logout } = useAuth()
    
    return (
        <>
            {/* Offers Strip */}
            <div className="fixed top-0 left-0 right-0 z-[60] bg-[#4b2e19] text-[#f5d26a] text-sm">
                <div className="relative overflow-hidden h-9 flex items-center">
                    <div className="marquee-track will-change-transform font-semibold">
                        <div className="marquee-group">
                            <span className="mx-6">✨ Lower Prices with GST 2.0</span>
                            <span className="mx-6">🍫 Navratri Special ✨ Flat 15% OFF</span>
                            <span className="mx-6">🎁 Free Hamper on Orders ₹1999+</span>
                            <span className="mx-6">🚚 Free Shipping on ₹699+ orders</span>
                            <span className="mx-6">🧈 Pure Ghee • Lab Tested</span>
                        </div>
                        <div className="marquee-group" aria-hidden="true">
                            <span className="mx-6">✨ Lower Prices with GST 2.0</span>
                            <span className="mx-6">🍫 Navratri Special ✨ Flat 15% OFF</span>
                            <span className="mx-6">🎁 Free Hamper on Orders ₹1999+</span>
                            <span className="mx-6">🚚 Free Shipping on ₹699+ orders</span>
                            <span className="mx-6">🧈 Pure Ghee • Lab Tested</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <header className="bg-[#fdf7f2]/70 backdrop-blur-md py-3 md:py-4 fixed w-full top-9 z-50 border-b border-[#2D2D2D]/10">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center group">
                            <Image
                                src="/file.svg"
                                alt="YugaFarms Logo"
                                width={40}
                                height={40}
                                className="object-contain transition-transform duration-300 group-hover:scale-110"
                            />
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/" className={`relative transition-colors duration-300 font-medium group ${
                                isHome 
                                    ? 'text-[#4b2e19]' 
                                    : 'text-[#2D2D2D] hover:text-[#4b2e19]'
                            }`}>
                                HOME
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#f5d26a] transition-all duration-300 ${
                                    isHome 
                                        ? 'w-full' 
                                        : 'w-0 group-hover:w-full'
                                }`}></span>
                            </Link>
                            <Link href="/ghee" className="relative text-[#2D2D2D] hover:text-[#4b2e19] transition-colors duration-300 font-medium group">
                                GHEE
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f5d26a] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link href="/honey" className="relative text-[#2D2D2D] hover:text-[#4b2e19] transition-colors duration-300 font-medium group">
                                HONEY
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f5d26a] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link href="/about" className="relative text-[#2D2D2D] hover:text-[#4b2e19] transition-colors duration-300 font-medium group">
                                ABOUT US
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f5d26a] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                            <Link href="/lab-reports" className="relative text-[#2D2D2D] hover:text-[#4b2e19] transition-colors duration-300 font-medium group">
                                REPORTS
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f5d26a] transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center space-x-4">
                            {/* Cart Icon */}
                            <button className="relative text-[#2D2D2D] hover:text-[#4b2e19] transition-all duration-300 group p-2 rounded-full hover:bg-[#f5d26a]/10">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {/* Cart Badge */}
                                <span className="absolute -top-1 -right-1 bg-[#f5d26a] text-[#4b2e19] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    3
                                </span>
                            </button>

                            {/* Auth */}
                            {user ? (
                                <ProfileMenu username={user.username} email={user.email} onLogout={logout} />
                            ) : (
                                <Link href="/login" className="text-sm bg-[#4b2e19] text-[#f5d26a] px-3 py-1 rounded-lg hover:opacity-90">Login</Link>
                            )}

                            {/* Mobile Menu Button */}
                            <button className="md:hidden text-[#2D2D2D] hover:text-[#4b2e19] transition-colors duration-300 p-2 rounded-full hover:bg-[#f5d26a]/10">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </nav >
                </div >
            </header >
        </>
    )
}

function ProfileMenu({ username, email, onLogout }: { username: string; email: string; onLogout: () => void }) {
    const [open, setOpen] = React.useState(false)
    const initials = React.useMemo(() => {
        const name = username || email || "";
        const parts = name.trim().split(/\s+/)
        const letters = parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2)
        return letters.toUpperCase()
    }, [username, email])

    React.useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (!target.closest?.('#ygf-profile-menu')) setOpen(false)
        }
        document.addEventListener('click', onDoc)
        return () => document.removeEventListener('click', onDoc)
    }, [])

    return (
        <div id="ygf-profile-menu" className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className="h-9 w-9 rounded-full bg-[#4b2e19] text-[#f5d26a] font-semibold flex items-center justify-center hover:opacity-90"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                {initials}
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#2D2D2D]/10 rounded-lg shadow-lg overflow-hidden z-[70]">
                    <div className="px-3 py-2 border-b border-[#2D2D2D]/10">
                        <div className="text-sm font-semibold text-[#4b2e19] truncate">{username}</div>
                        <div className="text-xs text-[#2D2D2D]/70 truncate">{email}</div>
                    </div>
                    <div className="py-1">
                        <Link href="/profile" className="block px-3 py-2 text-sm text-[#2D2D2D] hover:bg-[#fdf7f2]">Manage profile</Link>
                        <Link href="/orders" className="block px-3 py-2 text-sm text-[#2D2D2D] hover:bg-[#fdf7f2]">My Orders</Link>
                        <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm text-[#7a1a1a] hover:bg-[#fdf7f2]">Logout</button>
                    </div>
                </div>
            )}
        </div>
    )
}