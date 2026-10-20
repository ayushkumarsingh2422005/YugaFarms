import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
    return (
        <footer className="bg-[#fdf7f2] pt-6 md:pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <Link href="/" className="flex items-center">
                            <Image src="/logo.svg" alt="YugaFarms Logo" width={80} height={80} className="object-contain" />
                            {/* <span className="ml-2 font-[Pacifico] text-xl text-[#4b2e19]">YugaFarms</span> */}
                        </Link>
                        <p className="mt-3 text-sm text-[#2D2D2D]/70 max-w-xs">Pure, traditionally crafted ghee and oils made the slow way — from farm to your plate.</p>

                        {/* Social Icons */}
                        <div className="flex gap-3 md:gap-4 mt-6">
                            <a href="https://www.facebook.com/share/18AjWTPdeU" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-[#4b2e19] hover:bg-[#4b2e19] hover:text-[#f5d26a] hover:-translate-y-1 transition-all duration-300 shadow-sm border border-[#4b2e19]/10" aria-label="Facebook">
                                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                                    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/yugafarms" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-[#4b2e19] hover:bg-[#4b2e19] hover:text-[#f5d26a] hover:-translate-y-1 transition-all duration-300 shadow-sm border border-[#4b2e19]/10" aria-label="Instagram">
                                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/channel/UCyFFPds3_EFeCNBpSNkMU2w" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-[#4b2e19] hover:bg-[#4b2e19] hover:text-[#f5d26a] hover:-translate-y-1 transition-all duration-300 shadow-sm border border-[#4b2e19]/10" aria-label="YouTube">
                                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            <a href="mailto:support@yugafarms.com"
                                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-[#4b2e19] hover:bg-[#4b2e19] hover:text-[#f5d26a] hover:-translate-y-1 transition-all duration-300 shadow-sm border border-[#4b2e19]/10"
                                aria-label="Email"
                            >
                                <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                                    <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#4b2e19] mb-3">Policies</h4>
                        <ul className="space-y-2 text-sm text-[#2D2D2D]/80">
                            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                            <li><Link href="/terms-of-service">Terms of Service</Link></li>
                            <li><Link href="/shipping-policy">Shipping Policy</Link></li>
                            <li><Link href="/refund-policy">Refund & Returns</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#4b2e19] mb-3">Company</h4>
                        <ul className="space-y-2 text-sm text-[#2D2D2D]/80">
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/recipes">Recipes</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                            <li><Link href="/lab-reports">Lab Reports</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-[#4b2e19] mb-3">Get in touch</h4>
                        <ul className="space-y-2 text-sm text-[#2D2D2D]/80">
                            <li>Email: support@yugafarms.com</li>
                            <li>Phone: +91 96713 24344</li>
                            <li>Address: Janouli, Palwal, Haryana, 121102</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-[#4b2e19]/10 text-xs text-[#2D2D2D]/60 flex flex-col md:flex-row items-center justify-between">
                    <span>© {new Date().getFullYear()} YugaFarms. All rights reserved.</span>
                    {/* DigiCraft branding — restore later
                    <div className="mt-2 md:mt-0 space-x-4">
                        Designed and Developed by <Link href="https://www.digicraft.one" className="text-[#2f4f2f] font-medium underline underline-offset-4 hover:text-[#4b2e19]">DigiCraft</Link>
                    </div>
                    */}
                </div>
            </div>
        </footer>
    );
}