import { motion } from "framer-motion";
import { Facebook, Github, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-game-dark/90 border-t border-game-primary/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Canivive</h3>
            <p className="text-gray-400">
              Join the adventure and become a legend in our epic gaming universe.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-game-primary transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-game-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-game-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Connect With Us</h3>
            <div className="flex items-center space-x-4">
  <motion.a
    whileHover={{ scale: 1.1 }}
    href="https://oc.app/group/hznfs-bqaaa-aaaac-aqtla-cai/?ref=ln6nh-5aaaa-aaaac-aq6ja-cai"
    className="text-gray-400 hover:text-game-primary"
  >
    <img src="/openchat.png" alt="openchat" className="h-8 w-8 object-contain" />
  </motion.a>

  <motion.a
    whileHover={{ scale: 1.1 }}
    href="https://x.com/canivive"
    className="text-gray-400 hover:text-game-primary"
  >
    <img src="/x.png" alt="x" className="h-8 w-8 object-contain" />
  </motion.a>
  <motion.a
    whileHover={{ scale: 1.1 }}
    href="https://github.com/yongsxyz/canivive"
    className="text-gray-400 hover:text-game-primary"
  >
    <Github className="h-8 w-8" />
  </motion.a>
</div>

          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">© 2025 Canivive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;