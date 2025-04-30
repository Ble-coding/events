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
  { name: 'Événements', href: '/events' },
  { name: 'Salles', href: '/venues' },
  { name: 'Blogs', href: '/blogs' },

  { name: 'Contact', href: '/contact' },
]

export function AppMenu() {
  const { props, url } = usePage<PageProps>()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { auth } = props

  const isActive = (href: string) => {
    if (href === '/') {
      return url === '/'
    }
    return url.startsWith(href)
  }

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
    isScrolled
      ? 'bg-white/90 dark:bg-[#070504]/90 backdrop-blur-md shadow-sm'
      : 'bg-white dark:bg-[#070504]'
  )}
>

      <div className="container flex items-center justify-between">
        <AppLogo />


       {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
           <Link
           key={link.href}
           href={link.href}
           className={cn(
             'nav-link py-2 font-medium',
             isActive(link.href) && 'nav-link-active'
           )}
         >
           {link.name}
         </Link>
        ))}

        {/* Show login only if NOT connected */}
        {!auth.user && (
            <Button
            variant="outline"
            size="sm"
            className="ml-4 border-guilo text-guilo hover:bg-guilo/10"
            asChild
            >
            <a href={route('login')} target="_blank">
                <Lock className="w-4 h-4 mr-2" /> Se connecter
            </a>
            </Button>
        )}
        </nav>


        {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-md animate-fade-in">
        <nav className="container py-6 flex flex-col space-y-4">
  {navLinks.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      className={cn(
        'py-2 px-4 rounded-md font-medium transition-colors',
        isActive(link.href) && 'nav-link-active'
      )}
    >
      {link.name}
    </Link>


  ))}

  {/* Admin button in mobile */}
  {!auth.user ? (
    <a
      href={route('login')}
      target="_blank"
      className="py-2 px-4 rounded-md font-medium flex items-center text-guilo border border-guilo/30 hover:bg-guilo/10"
    >
      <Lock className="w-4 h-4 mr-2" /> Se connecter
    </a>
  ) : (
    <Link
      href={route('dashboard')}
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
