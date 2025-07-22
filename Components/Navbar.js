'use client';
import React from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from 'react';
import Link from 'next/link';

const Navbar = ({ isUsernamePage }) => {
    const { data: session, status } = useSession();
    const [showdropdown, setshowdropdown] = useState(false);

    // Add loading state check
    if (status === "loading") {
        return (
            <nav className={`${isUsernamePage ? 'bg-black/40 backdrop-blur-xl border-b border-white/10 text-white' : 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 text-gray-900'} flex justify-between px-6 items-center h-16 fixed top-0 left-0 right-0 z-50 shadow-lg`}>
                <div>
                    <Link className="logo flex font-bold text-xl justify-center items-center gap-3 transition-all duration-300 hover:scale-105" href={"/"}>
                        <div className="relative">
                            <img src="/teas.gif" width={40} alt="" className='hover:cursor-pointer rounded-full shadow-md' />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
                        </div>
                        <span className='hover:cursor-pointer bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-semibold tracking-wide'>Get me a Chai</span>
                    </Link>
                </div>
                <div className='relative'>
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent"></div>
                        <span className="text-sm font-medium">Loading...</span>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className={`${isUsernamePage ? 'bg-black/40 backdrop-blur-xl border-b border-white/10 text-white' : 'bg-white/95 backdrop-blur-xl border-b border-gray-200/50 text-gray-900'} flex justify-between px-6 items-center h-16 fixed top-0 left-0 right-0 z-50 shadow-lg transition-all duration-300`}>
            <div>
                <Link className="logo flex font-bold text-xl justify-center items-center gap-3 transition-all duration-300 hover:scale-105" href={"/"}>
                    <div className="relative">
                        <img src="/teas.gif" width={40} alt="" className='hover:cursor-pointer rounded-full shadow-md' />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
                    </div>
                    <span className='hover:cursor-pointer bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-semibold tracking-wide'>Get me a Chai</span>
                </Link>
            </div>
            
            <div className='relative flex items-center gap-3'>
                {session ? (
                    <>
                        <button
                            onClick={() => setshowdropdown(!showdropdown)}
                            onBlur={() => {
                                setTimeout(() => {
                                    setshowdropdown(false);
                                }, 200);
                            }}
                            className={`${isUsernamePage ? 'bg-white/10 hover:bg-white/20 text-white border-white/20' : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200'} flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-105 font-medium`}
                            type="button"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {(session.user.name || session.user.email).charAt(0).toUpperCase()}
                            </div>
                            <span className="hidden sm:inline-block">
                                {session.user.name || session.user.email}
                            </span>
                            <svg className="w-4 h-4 transition-transform duration-200" 
                                 style={{ transform: showdropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div className={`absolute top-full right-0 mt-2 w-56 ${showdropdown ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"} bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-xl transition-all duration-300 overflow-hidden`}>
                            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {(session.user.name || session.user.email).charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Welcome back!</p>
                                        <p className="text-gray-600 text-xs truncate max-w-32">
                                            {session.user.name || session.user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="py-2">
                                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200 group">
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span className="font-medium">Dashboard</span>
                                </Link>
                                
                                <Link href={`/${session.user.to_user || session.user.username}`} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200 group">
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="font-medium">Your Page</span>
                                </Link>
                                
                                <Link href={`/`} className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-all duration-200 group">
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span className="font-medium">Home</span>
                                </Link>
                                
                                <div className="border-t border-gray-100 mt-2 pt-2">
                                    <button
                                        onClick={() => signOut({ callbackUrl: `${window.location.origin}/Login` })}
                                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 group w-full text-left"
                                    >
                                        <svg className="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span className="font-medium">Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => signOut({ callbackUrl: `${window.location.origin}/Login` })}
                            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link href={"/Login"}>
                            <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-200">
                                Login
                            </button>
                        </Link>
                        <Link href={"/signup"}>
                            <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:shadow-lg hover:scale-105">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;