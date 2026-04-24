import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/hwabelle-full-logo.jpg";
import { useCart } from "@/hooks/useCart";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/designer", label: "AI Designer" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-divider">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Hwabelle"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm tracking-wide transition-colors hover:text-foreground ${isActive(link.href) ? "text-foreground" : "text-muted-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          <Link
            to="/my-orders"
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors hidden md:block"
            aria-label="My Account"
          >
            <User size={22} />
          </Link>

          <button
            onClick={openCart}
            className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open cart"
            id="cart-button"
          >
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-divider animate-fade-in">
          <nav className="container py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-lg tracking-wide transition-colors hover:text-foreground ${isActive(link.href) ? "text-foreground" : "text-muted-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <Link
              to="/my-orders"
              onClick={() => setIsMenuOpen(false)}
              className={`text-lg tracking-wide transition-colors flex items-center gap-3 hover:text-foreground ${isActive('/my-orders') ? "text-foreground" : "text-muted-foreground"}`}
            >
              <User size={20} />
              My Orders & Access
            </Link>
            <Button
              variant="hero"
              size="lg"
              className="mt-4"
              onClick={() => { setIsMenuOpen(false); openCart(); }}
            >
              <ShoppingBag size={18} className="mr-2" />
              Cart {itemCount > 0 && `(${itemCount})`}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
