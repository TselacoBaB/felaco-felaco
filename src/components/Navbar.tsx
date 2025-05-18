import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="w-full py-4 px-6 md:px-12 flex justify-between items-center z-50 bg-white/80 backdrop-blur-md sticky top-0">
      <div className="flex items-center gap-2">
        <Link to="/">
          <img src="/lovable-uploads/icon_logo_f.png" alt="Felaco Logo" className="h-10 w-auto" />
        </Link>
        <Link to="/">
          <span className="text-2xl font-bold gradient-text">Felaco</span>
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
        <a href="#for-creators" className="text-gray-600 hover:text-gray-900 font-medium">For Creators</a>
        <a href="#for-fans" className="text-gray-600 hover:text-gray-900 font-medium">For Fans</a>
        <div className="flex gap-4">
          {user ? (
            <>
              <Link to="/app">
                <Button variant="outline" className="rounded-full">Go to App</Button>
              </Link>
              <Button className="cta-button px-6 py-2" onClick={() => signOut()}>Sign Out</Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" className="rounded-full">Log In</Button>
              </Link>
              <Link to="/auth?tab=signup">
                <Button className="cta-button px-6 py-2">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation Toggle */}
      <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 md:hidden flex flex-col gap-4 z-50">
          <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium py-2">Features</a>
          <a href="#for-creators" className="text-gray-600 hover:text-gray-900 font-medium py-2">For Creators</a>
          <a href="#for-fans" className="text-gray-600 hover:text-gray-900 font-medium py-2">For Fans</a>
          <div className="flex flex-col gap-3 pt-2">
            {user ? (
              <>
                <Link to="/app">
                  <Button variant="outline" className="rounded-full w-full">Go to App</Button>
                </Link>
                <Button className="cta-button w-full py-2" onClick={() => signOut()}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" className="rounded-full w-full">Log In</Button>
                </Link>
                <Link to="/auth?tab=signup">
                  <Button className="cta-button w-full py-2">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
