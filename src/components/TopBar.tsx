'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useAuth } from '../app/context/AuthContext'
import { useCart } from '../app/context/CartContext'

/* ─── SVG Icon Components ─────────────────────────────────────────── */

const IconNewlyLaunched = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
    </svg>
)

const IconGhee = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M8 3h8a1 1 0 011 1v2H7V4a1 1 0 011-1z" />
        <path d="M6 6h12l-1.5 13.5a1.5 1.5 0 01-1.5 1.5H9a1.5 1.5 0 01-1.5-1.5L6 6z" />
        <path d="M9 11c0 1.657 1.343 3 3 3s3-1.343 3-3" />
    </svg>
)

const IconOils = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9 2h6v4H9z" />
        <path d="M7 6h10l1 14H6L7 6z" />
        <path d="M12 10v6" />
        <path d="M9 13h6" />
    </svg>
)

const IconComboPacks = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="2" y="7" width="9" height="13" rx="1" />
        <rect x="13" y="7" width="9" height="13" rx="1" />
        <path d="M5 7V4a1 1 0 011-1h12a1 1 0 011 1v3" />
    </svg>
)

const IconAllProducts = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8M12 8v8" />
    </svg>
)

const IconShop = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
)

const IconBlogs = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
)

const IconSearch = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)

const IconCart = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
    </svg>
)

const IconHome = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
)

const IconAll = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
    </svg>
)

const IconDealZone = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
)

const IconTrending = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
)

const IconAccount = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

/* ─── Component ──────────────────────────────────────────────────── */

export default function TopBar() {
    const pathname = usePathname()
    const isHome = pathname === '/' || pathname === ''
    const isGhee = pathname === '/ghee' || pathname.startsWith('/ghee/')
    const isHoney = pathname === '/honey' || pathname.startsWith('/honey/')
    const isBlogs = pathname === '/blogs' || pathname.startsWith('/blogs/')
    const isAbout = pathname === '/about' || pathname.startsWith('/about/')
    const isContact = pathname === '/contact' || pathname.startsWith('/contact/')
    const { user, logout } = useAuth()
    const { totalItems, setIsCartOpen } = useCart()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
    const [isShopOpen, setIsShopOpen] = React.useState(false)
    // Lock body scroll when mobile menu is open
    React.useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isMobileMenuOpen])

    const navItems = [
        { href: '/', label: 'Home', icon: <IconHome />, active: isHome },
        // { href: '/ghee', label: 'Ghee', icon: <IconGhee />, active: isGhee },
        // { href: '/honey', label: 'Honey', icon: <IconOils />, active: isHoney },
        { href: '/blogs', label: 'Blogs', icon: <IconBlogs />, active: isBlogs },
        { href: '/about', label: 'About', icon: <IconShop />, active: isAbout },
        { href: '/contact', label: 'Contact', icon: <IconComboPacks />, active: isContact },
    ]

    const menuCategories = [
        { href: '/ghee', label: 'A2 Ghee', icon: <IconGhee />, arrow: false, subItems: null },
        { href: '/honey', label: 'Honey', icon: <IconOils />, arrow: false, subItems: null },
        { href: '/blogs', label: 'Blogs', icon: <IconBlogs />, arrow: true, subItems: null },
        { href: '/about', label: 'About Us', icon: <IconAllProducts />, arrow: false, subItems: null },
        { href: '/contact', label: 'Contact', icon: <IconComboPacks />, arrow: false, subItems: null },
    ]

    return (
        <>
            {/* ── Main Header ──────────────────────────────────────────── */}
            <header className="bg-white/90 backdrop-blur-md fixed w-full top-10 z-50 border-b border-gray-100 shadow-sm">

                {/* ── Desktop: single row — logo left | nav center | cart+auth right ── */}
                <div className="hidden md:flex items-center h-14 px-6 gap-6">

                    {/* Logo — left */}
                    <Link href="/" className="flex-shrink-0 flex items-center">
                        <Image
                            src="/logomark.svg"
                            alt="YugaFarms Logo"
                            width={120}
                            height={40}
                            className="object-contain h-10 w-auto"
                            priority
                        />
                    </Link>

                    {/* Nav links — center (flex-1 + justify-center) */}
                    <div className="flex-1 flex items-center justify-center gap-7">
                        {navItems.map(item => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 group ${item.active
                                    ? 'text-[#4b2e19]'
                                    : 'text-[#555] hover:text-[#4b2e19]'
                                    }`}
                            >
                                <span className={`transition-colors ${item.active ? 'text-[#4b2e19]' : 'text-[#4b2e19]/50 group-hover:text-[#4b2e19]'}`}>
                                    {item.icon}
                                </span>
                                {item.label.toUpperCase()}
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#4b2e19] rounded-full transition-all duration-300 ${item.active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                            </Link>
                        ))}

                        {/* Shop with hover dropdown */}
                        <div className="relative group">
                            <button
                                className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
                                    isGhee || isHoney ? 'text-[#4b2e19]' : 'text-[#555] hover:text-[#4b2e19]'
                                }`}
                            >
                                <span className={`transition-colors ${isGhee || isHoney ? 'text-[#4b2e19]' : 'text-[#4b2e19]/50 group-hover:text-[#4b2e19]'}`}>
                                    <IconShop />
                                </span>
                                SHOP
                                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#4b2e19] rounded-full transition-all duration-300 ${isGhee || isHoney ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                            </button>
                            {/* Dropdown */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-[70]">
                                <Link href="/ghee" className="flex items-center gap-3 px-4 py-3 text-sm text-[#2D2D2D] hover:bg-[#fdf7f2] hover:text-[#4b2e19] transition-colors border-b border-gray-100">
                                    <span className="text-[#4b2e19]/70"><IconGhee /></span>
                                    <span className="font-medium">Ghee</span>
                                </Link>
                                <Link href="/honey" className="flex items-center gap-3 px-4 py-3 text-sm text-[#2D2D2D] hover:bg-[#fdf7f2] hover:text-[#4b2e19] transition-colors">
                                    <span className="text-[#4b2e19]/70"><IconOils /></span>
                                    <span className="font-medium">Honey</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Cart + Auth — right */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center justify-center w-9 h-9 rounded-full text-[#4b2e19] hover:bg-[#4b2e19]/8 transition-colors duration-200"
                            aria-label="Cart"
                        >
                            <IconCart />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-[#4b2e19] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                                    {totalItems > 9 ? '9+' : totalItems}
                                </span>
                            )}
                        </button>
                        {user ? (
                            <ProfileMenu username={user.username} email={user.email} onLogout={logout} />
                        ) : (
                            <Link href="/login" className="text-sm bg-[#4b2e19] text-[#f5d26a] px-4 py-1.5 rounded-full hover:opacity-90 font-medium transition-opacity">
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* ── Mobile: hamburger left | logo center | cart right ── */}
                <div className="flex md:hidden items-center justify-between px-4 h-14">
                    {/* Hamburger */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex items-center justify-center w-9 h-9 rounded-full text-[#4b2e19] hover:bg-[#4b2e19]/8 transition-colors duration-200"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        )}
                    </button>

                    {/* Logo — centered absolutely */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center">
                        <Image
                            src="/logomark.svg"
                            alt="YugaFarms Logo"
                            width={120}
                            height={40}
                            className="object-contain h-10 w-auto"
                            priority
                        />
                    </Link>

                    <div className="flex items-center gap-1.5 shrink-0 z-[51]">
                        {user ? (
                            <ProfileMenu username={user.username} email={user.email} onLogout={logout} />
                        ) : (
                            <Link
                                href="/login"
                                className="text-xs bg-[#4b2e19] text-[#f5d26a] px-3 py-1.5 rounded-full font-medium hover:opacity-90"
                            >
                                Login
                            </Link>
                        )}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center justify-center w-9 h-9 rounded-full text-[#4b2e19] hover:bg-[#4b2e19]/8 transition-colors duration-200"
                            aria-label="Cart"
                        >
                            <IconCart />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-[#4b2e19] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                                    {totalItems > 9 ? '9+' : totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

            </header>

            {/* ── Mobile Full-Screen Menu ───────────────────────────────── */}
            {/* Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-[55] md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                className={`fixed top-[104px] left-0 bottom-0 w-full max-w-sm bg-[#f9f9f9] z-[56] md:hidden flex flex-col transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{ overflowY: 'auto' }}
            >
                {/* Category Links */}
                <nav className="flex-1">
                    <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white hover:bg-[#fdf7f2] transition-colors duration-150 group"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-[#4b2e19]/70 group-hover:text-[#4b2e19] transition-colors">
                                <IconHome />
                            </span>
                            <span className="text-[15px] font-medium text-[#2D2D2D] group-hover:text-[#4b2e19] transition-colors">
                                Home
                            </span>
                        </div>
                    </Link>
                    {user && (
                        <div className="border-b border-gray-200 bg-white">
                            <Link
                                href="/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 hover:bg-[#fdf7f2] transition-colors"
                            >
                                <span className="text-[#4b2e19]/70"><IconAccount /></span>
                                <span className="text-[15px] font-medium text-[#2D2D2D]">Manage profile</span>
                            </Link>
                            <Link
                                href="/orders"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-4 px-5 py-4 border-b border-gray-200 hover:bg-[#fdf7f2] transition-colors"
                            >
                                <span className="text-[#4b2e19]/70"><IconCart /></span>
                                <span className="text-[15px] font-medium text-[#2D2D2D]">My orders</span>
                            </Link>
                        </div>
                    )}
                    {menuCategories.map((item, idx) => {
                        // Shop: accordion with sub-items
                        if (item.subItems) {
                            return (
                                <div key={idx}>
                                    <button
                                        onClick={() => setIsShopOpen(v => !v)}
                                        className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white hover:bg-[#fdf7f2] transition-colors duration-150 group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-[#4b2e19]/70 group-hover:text-[#4b2e19] transition-colors">
                                                {item.icon}
                                            </span>
                                            <span className="text-[15px] font-medium text-[#2D2D2D] group-hover:text-[#4b2e19] transition-colors">
                                                {item.label}
                                            </span>
                                        </div>
                                        <svg
                                            className={`w-4 h-4 text-[#999] transition-transform duration-200 ${isShopOpen ? 'rotate-90' : ''}`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                                        </svg>
                                    </button>

                                    {/* Sub-items */}
                                    <div className={`overflow-hidden transition-all duration-300 ${isShopOpen ? 'max-h-40' : 'max-h-0'}`}>
                                        {item.subItems.map((sub, sIdx) => (
                                            <Link
                                                key={sIdx}
                                                href={sub.href}
                                                onClick={() => { setIsMobileMenuOpen(false); setIsShopOpen(false); }}
                                                className="flex items-center gap-4 pl-14 pr-5 py-3.5 border-b border-gray-100 bg-[#fdf7f2] hover:bg-[#f5ede3] transition-colors duration-150 group"
                                            >
                                                <span className="text-[#4b2e19]/60 group-hover:text-[#4b2e19] transition-colors">
                                                    {sub.icon}
                                                </span>
                                                <span className="text-[14px] font-medium text-[#4b2e19]/80 group-hover:text-[#4b2e19] transition-colors">
                                                    {sub.label}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )
                        }

                        // Regular item
                        return (
                            <Link
                                key={idx}
                                href={item.href!}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white hover:bg-[#fdf7f2] transition-colors duration-150 group"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-[#4b2e19]/70 group-hover:text-[#4b2e19] transition-colors">
                                        {item.icon}
                                    </span>
                                    <span className="text-[15px] font-medium text-[#2D2D2D] group-hover:text-[#4b2e19] transition-colors">
                                        {item.label}
                                    </span>
                                </div>
                                {item.arrow && (
                                    <svg className="w-4 h-4 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                                    </svg>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer: Log in + Social */}
                <div className="px-5 py-6 bg-[#f9f9f9] border-t border-gray-200">
                    {user ? (
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-10 w-10 rounded-full bg-[#4b2e19] text-[#f5d26a] font-bold flex items-center justify-center text-sm">
                                {(user.username || user.email || '?').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[#4b2e19]">{user.username}</p>
                                <button onClick={logout} className="text-xs text-[#7a1a1a] hover:underline">Logout</button>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-base font-medium text-[#2D2D2D] hover:text-[#4b2e19] mb-5 transition-colors"
                        >
                            Log in
                        </Link>
                    )}

                    {/* Social Icons */}
                    <div className="flex items-center gap-5">
                        {/* X / Twitter */}
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-[#4b2e19] transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        {/* Facebook */}
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-[#4b2e19] transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" strokeWidth="0" />
                            </svg>
                        </a>
                        {/* Instagram */}
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-[#4b2e19] transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>
                        {/* Email */}
                        <a href="mailto:contact@yugafarms.com" className="text-[#555] hover:text-[#4b2e19] transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}

/* ─── Profile Dropdown ────────────────────────────────────────────── */

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
                className="h-9 w-9 rounded-full bg-[#4b2e19] text-[#f5d26a] font-semibold flex items-center justify-center hover:opacity-90 text-sm"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                {initials}
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-[80]">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm font-semibold text-[#4b2e19] truncate">{username}</div>
                        <div className="text-xs text-gray-400 truncate">{email}</div>
                    </div>
                    <div className="py-1">
                        <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#2D2D2D] hover:bg-[#fdf7f2] transition-colors">
                            <IconAccount />
                            Manage profile
                        </Link>
                        <Link href="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#2D2D2D] hover:bg-[#fdf7f2] transition-colors">
                            <IconCart />
                            My Orders
                        </Link>
                        <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}