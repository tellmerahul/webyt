"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from './auth';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const {loginAndConnect,logout} = useAuth();
    const [token, setToken] = useState(null);


    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const authToken = localStorage.getItem('authToken');
            setToken(authToken);
        }
    }, []);
    

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    const navigation = useMemo(() => [
        { name: 'Home', url: '/' },
        { name: 'Features', url: '#features' },
        { name: 'About', url: '#about' },
        { name: 'Pricing', url: '#pricing' },
        { name: 'Contact', url: '#contact' }
    ], []);

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 ${isScrolled ? 'bg-black bg-opacity-90 shadow-md' : 'bg-black'} transition duration-300`}>

                <div className="container mx-auto flex justify-between items-center p-3">
                    <div className='flex justify-start items-center'>
                        <Link href="/" className="text-xl font-bold text-gray-800 items-center flex">
                            <span className='text-[30px] font-extrabold text-xl lg:text-2xl text-purple-600'>Web
                                <span className='text-red-600'>YT</span>
                            </span>
                        </Link>
                    </div>
                    <div className="hidden lg:flex space-x-6 items-center">

                        {navigation?.map((item) => (
                            <Link key={item.name} href={item.url} className="text-gray-200 text-md hover:text-gray-400 font-semibold">
                                {item.name}
                            </Link>
                        ))}
                        {
                            !token ? <span className="text-gray-200 text-md hover:text-gray-400 font-semibold" onClick={loginAndConnect}>Login</span> : <span className="text-gray-200 text-md hover:text-gray-400 font-semibold" onClick={logout}>LogOut</span>
                        }
                    </div>
                    <div className="lg:hidden">
                        <button onClick={toggleMenu} className={`text-gray-200 focus:outline-none ${!isOpen ? 'block' : 'hidden'}`}>
                            <svg
                                className={`w-6 h-6 transition-transform transform ${isOpen ? 'rotate-180' : 'rotate-0'} duration-300`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <div
                    className={`fixed inset-0 z-40 bg-blue-600 bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={toggleMenu}
                />

                <div
                    className={`bg-black fixed inset-y-0 right-0 w-full h-[100lvh] p-4 transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <button onClick={toggleMenu} className="text-gray-800 w-full flex items-center justify-between focus:outline-none mb-4">
                        <Link href="/" className='flex'>
                            <span className='font-extrabold text-xl lg:text-2xl text-purple-600'>Web
                                <span className='text-red-600'>YT</span>
                            </span>
                        </Link>
                        <svg
                            className="w-6 h-6 justify-end text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="flex flex-col space-y-4 text-center items-center">
                        {navigation?.map((item) => (
                            <Link
                                key={item.name}
                                href={item.url}
                                className="text-white text-lg hover:bg-gray-100 p-2 rounded"
                                onClick={toggleMenu}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {
                            !token ? <span className="text-gray-200 text-md hover:text-gray-400 font-semibold" onClick={loginAndConnect}>Login</span> : <span className="text-gray-200 text-md hover:text-gray-400 font-semibold">LogOut</span>
                        }
                    </div>
                </div>
            </nav>
        </>
    );
}