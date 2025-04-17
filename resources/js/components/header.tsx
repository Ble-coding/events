
import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Menu, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';


// export function Header() {
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = usePage().url;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Galerie', path: '/galerie' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300',
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-90"
        >
          <img src="/logo.png" alt="Guil'O Services" className="h-14 mr-2" />
          <span className="font-playfair text-guilo text-2xl font-semibold">Guil'O Services</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                'nav-link py-2 font-medium transition-colors',
                location === link.path
                  ? 'text-guilo'
                  : 'text-primary hover:text-guilo'
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
            <Link href="/admin">
              <Lock className="w-4 h-4 mr-2" /> Admin
            </Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-guilo hover:bg-guilo/10"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-md animate-fade-in">
          <nav className="container py-6 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  'py-2 px-4 rounded-md font-medium transition-colors',
                  location === link.path
                    ? 'bg-guilo/10 text-guilo'
                    : 'text-primary hover:bg-guilo/5 hover:text-guilo'
                )}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/admin"
              className="py-2 px-4 rounded-md font-medium flex items-center text-guilo border border-guilo/30 hover:bg-guilo/10"
            >
              <Lock className="w-4 h-4 mr-2" /> Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
