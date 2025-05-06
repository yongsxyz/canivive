import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import GooeyNav from './NavbarButtons';
import useGameSettings from "@/context/Settings";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(true);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const { toggleSettings } = useGameSettings();
  

  const items = [
    { label: "Home", href: "#home" },
    { label: "Discover", href: "#discover" },
    { label: "Features", href: "#aaaa" },
    { label: "Journey", href: "#journey" },
    { label: "Settings", href: "#settings" },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(false);
      setScrolled(true);
    } else if (latest <= 0) {
      setHidden(true);
      setScrolled(false);
    }
  });

  useEffect(() => {
    if (window.scrollY > 150) {
      setHidden(false);
      setScrolled(true);
    }
  }, []);

  const smoothScroll = (targetId: string) => {
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {

      
      window.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  
  return (
    <motion.nav
      // initial={{ y: -100, opacity: 0 }}
      // animate={{ 
      //   y: hidden ? -100 : 0,
      //   opacity: hidden ? 0 : 1
      // }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed w-full z-50 ${scrolled ? ' backdrop-blur-sm' : ''}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-16">
          <div className={`flex items-center justify-between rounded-full px-6 py-2 ${scrolled ? 'bg-game-dark/80 backdrop-blur-sm border border-game-primary/20' : ''
            }`}>
            <Link to="/" className="text-2xl font-bold text-game-primary">
              Canivive
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <motion.div
                className="text-gray-300 hover:text-game-primary transition-colors"
              >
                <GooeyNav
                  items={items}
                  particleCount={5}
                  particleDistances={[90, 10]}
                  particleR={100}
                  initialActiveIndex={0}
                  animationTime={1}
                  timeVariance={300}
                  colors={[3, 2, 5, 1, 2, 3, 1, 4]}
                />
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden pb-4 pt-2 mt-2 bg-game-dark/90 backdrop-blur-md rounded-lg border border-game-primary/20"
          >
            <div className="flex flex-col space-y-4 px-4 py-2">
              <Link
                to="#"
                onClick={() => {smoothScroll('home'); setIsOpen(false);}}
                className="text-gray-300 hover:text-game-primary px-4 py-2 rounded-md hover:bg-game-primary/10 transition-colors"
              >
                Home
              </Link>
              <Link
                to="#"
                onClick={() => {smoothScroll('discover'); setIsOpen(false);}}
                className="text-gray-300 hover:text-game-primary px-4 py-2 rounded-md hover:bg-game-primary/10 transition-colors"
              >
                Discover
              </Link>
              <Link
                to="#"
                onClick={() => {smoothScroll('aaaa'); setIsOpen(false);}}
                className="text-gray-300 hover:text-game-primary px-4 py-2 rounded-md hover:bg-game-primary/10 transition-colors"
              >
                Features
              </Link>
              <Link
                to="#"
                onClick={() => {smoothScroll('journey'); setIsOpen(false);}}
                className="text-gray-300 hover:text-game-primary px-4 py-2 rounded-md hover:bg-game-primary/10 transition-colors"
              >
                Journey
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;