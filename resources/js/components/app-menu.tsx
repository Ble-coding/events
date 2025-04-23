import React, { useState, useEffect } from 'react'
import { usePage, Link } from '@inertiajs/react'
import { Lock, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import AppLogo from '@/components/app-logo'

type User = {
  id: number
  name: string
  email: string
  // ajoute d'autres propriétés si besoin
}

type PageProps = {
  auth: {
    user: User | null
  }
}

const navLinks = [
  { name: 'Accueil', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Galerie', href: '/galerie' },
  { name: 'Contact', href: '/contact' },
]

export function AppMenu() {
  const { props, url } = usePage<PageProps>()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { auth } = props

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [url])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
      )}
    >
      <div className="container flex items-center justify-between">
        <AppLogo />

        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'nav-link py-2 font-medium transition-colors',
                url === link.href ? 'text-guilo' : 'text-primary hover:text-guilo'
              )}
            >
              {link.name}
            </Link>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="ml-4 border-guilo text-guilo hover:bg-guilo/10"
            asChild
          >
            {auth.user ? (
              <Link href={route('dashboard')}>
                <Lock className="w-4 h-4 mr-2" /> Admin
              </Link>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                >
                  Se connecter
                </Link>
                {/* <Link
                  href={route('creation')}
                  className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                >
                  Register
                </Link> */}
              </>
            )}
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-guilo hover:bg-guilo/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-md animate-fade-in">
          <nav className="container py-6 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'py-2 px-4 rounded-md font-medium transition-colors',
                  url === link.href
                    ? 'bg-guilo/10 text-guilo'
                    : 'text-primary hover:bg-guilo/5 hover:text-guilo'
                )}
              >
                {link.name}
              </Link>
            ))}


{auth.user ? (
  <Link
    href={route('dashboard')}
    className="py-2 px-4 rounded-md font-medium flex items-center text-guilo border border-guilo/30 hover:bg-guilo/10"
  >
    <Lock className="w-4 h-4 mr-2" /> Admin
  </Link>
) : (
  <Link
    href="/login"
    className="py-2 px-4 rounded-md font-medium flex items-center text-guilo border border-guilo/30 hover:bg-guilo/10"
  >
    <Lock className="w-4 h-4 mr-2" /> Admin
  </Link>
)}

          </nav>
        </div>
      )}
    </header>
  )
}
