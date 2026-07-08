"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const {cartCount} = useCart();
  const {favoritesCount} = useFavorites();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isActive = (path: string) => {
    if (!isClient) return false;
    return pathname === path;
  };

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuOpen &&
        e.target &&
        !(e.target as HTMLElement).closest('.mobile-menu-toggle') &&
        !(e.target as HTMLElement).closest('.mobile-nav')
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  // Don't render header on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = user
  ? [
      { name: "Home", path: "/dashboard" },
      { name: "Plants", path: "/plants" },
      { name: "Orders", path: "/orders"},
      { name: "Profile", path: "/profile" },
      { name: "Favorites", path: "/favorites"}
    ]
  : [
      { name: "Home", path: "/" },
      { name: "Plants", path: "/plants" },
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" }
    ];

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="shrink-0">
            <Link href={user ? "/dashboard" : "/"} className="text-xl font-bold text-green-600">
              Nursere
            </Link>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-10 items-center">
              {navLinks.map(link => {
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`relative px-1 text-base transition-colors duration-300
                      ${active ? "text-green-600 font-bold" : "text-gray-700 font-medium hover:text-green-600"}
                    `}
                  >
                    {link.name}

                    {/* underline indicator */}
                    <span
                      className={`absolute left-0 -bottom-1 h-0.5 bg-green-600 transition-all duration-300
                        ${active ? "w-full" : "w-0 group-hover:w-full"}
                      `}
                    />
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Auth & Cart Buttons */}
          <div className="flex items-center">
            {/* Cart Icon */}
            {user && (
              <>
                <Link
                  href="/favorites"
                  className="relative mr-4 p-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {favoritesCount > 99 ? '99+' : favoritesCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/cart"
                  className="relative mr-4 p-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign out
              </button>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-green-600"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Sign up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="ml-4 md:hidden mobile-menu-toggle">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
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
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu (unchanged) */}
      {mobileMenuOpen && (
        <div className="md:hidden mobile-nav" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {[
              { name: "Home", path: "/" },
              { name: "Plants", path: "/plants" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
              ...(user ? [{ name: "Profile", path: "/profile" }, { name: "Cart", path: "/cart" }, { name: "Favorites", path: "/favorites" }] : [])
            ].map(link => (
              <Link
                key={link.path}
                href={link.path}
                className={`block pl-3 pr-4 py-2 text-base font-medium border-l-4 ${
                  pathname === link.path 
                    ? 'text-green-600 border-green-600 bg-green-50' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                }`}
                onClick={toggleMobileMenu}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="px-4">
                <button
                  onClick={() => {
                    toggleMobileMenu();
                    logout();
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-2 px-4">
                <Link
                  href="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  onClick={toggleMobileMenu}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={toggleMobileMenu}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
