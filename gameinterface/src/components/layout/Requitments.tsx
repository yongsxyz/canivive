import { motion } from "framer-motion";
import { useState } from "react";

const SystemRequirements = () => {
  const [activeTab, setActiveTab] = useState("minimum");
  const [activePlatform, setActivePlatform] = useState("pc");
  
  const requirements = {
    pc: {
      minimum: [
        { component: "OS", value: "Windows 10 64-bit" },
        { component: "CPU", value: "Intel i5-6600K / AMD Ryzen 5 1600" },
        { component: "GPU", value: "GTX 1060 4GB / RX 580 8GB" },
        { component: "RAM", value: "8GB DDR4" },
        { component: "Storage", value: "5GB SSD" },
      ],
      recommended: [
        { component: "OS", value: "Windows 11 64-bit" },
        { component: "CPU", value: "Intel i7-10700K / AMD Ryzen 7 3700X" },
        { component: "GPU", value: "RTX 2070 Super / RX 5700 XT" },
        { component: "RAM", value: "32GB DDR4" },
        { component: "Storage", value: "10GB NVMe SSD" },
      ]
    },
    mobile: {
      minimum: [
        { component: "OS", value: "Android 10 / iOS 13" },
        { component: "Chipset", value: "Snapdragon 845 / A12 Bionic" },
        { component: "GPU", value: "Adreno 630 / Apple GPU" },
        { component: "RAM", value: "4GB" },
        { component: "Storage", value: "5GB" },
      ],
      recommended: [
        { component: "OS", value: "Android 12 / iOS 15" },
        { component: "Chipset", value: "Snapdragon 8 Gen 1 / A15 Bionic" },
        { component: "GPU", value: "Adreno 730 / Apple 5-core GPU" },
        { component: "RAM", value: "8GB" },
        { component: "Storage", value: "5GB" },
      ]
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const buttonVariants = {
    active: {
      backgroundColor: "#9d89f5",
      color: "#ffffff",
      scale: 1.05
    },
    inactive: {
      backgroundColor: "rgba(31, 41, 55, 0.7)", // dark
      color: "#d1d5db"
    },
    hover: {
      color: "#ffffff",
      backgroundColor: "rgba(157, 137, 245, 0.7)" // 70% opacity hover
    }
  };
  
  const platformVariants = {
    active: {
      backgroundColor: "#9d89f5",
      color: "#ffffff",
      borderColor: "#9d89f5"
    },
    inactive: {
      backgroundColor: "transparent",
      color: "#d1d5db",
      borderColor: "#374151"
    },
    hover: {
      color: "#ffffff",
      backgroundColor: "rgba(157, 137, 245, 0.3)" // 30% opacity hover
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
      backgroundColor: "rgba(157, 137, 245, 0.1)" // sedikit highlight ungu saat hover card
    }
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-16 bg-game-dark/50 rounded-xl border border-game-primary/20 p-6 sm:p-8 max-w-7xl mx-auto shadow-xl backdrop-blur-sm"
    >
      <motion.h3
        className="text-3xl font-bold text-white mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-game-primary/60 to-game-primary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        System Requirements
      </motion.h3>

      <div className="flex flex-col items-center mb-8 gap-4">
        {/* Platform Selector */}
        <motion.div
          className="inline-flex bg-game-dark/80 rounded-lg p-1 border border-game-primary/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            className="px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base border"
            variants={platformVariants}
            animate={activePlatform === "pc" ? "active" : "inactive"}
            whileHover="hover"
            onClick={() => setActivePlatform("pc")}
          >
            <i className="fas fa-desktop mr-2"></i> PC
          </motion.button>
          <motion.button
            className="px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base border"
            variants={platformVariants}
            animate={activePlatform === "mobile" ? "active" : "inactive"}
            whileHover="hover"
            onClick={() => setActivePlatform("mobile")}
          >
            <i className="fas fa-mobile-alt mr-2"></i> Mobile
          </motion.button>
        </motion.div>

        {/* Tab Selector */}
        <motion.div
          className="inline-flex bg-game-dark/80 rounded-lg p-1 border border-game-primary/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className="px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base"
            variants={buttonVariants}
            animate={activeTab === "minimum" ? "active" : "inactive"}
            whileHover="hover"
            onClick={() => setActiveTab("minimum")}
          >
            Minimum
          </motion.button>
          <motion.button
            className="px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base"
            variants={buttonVariants}
            animate={activeTab === "recommended" ? "active" : "inactive"}
            whileHover="hover"
            onClick={() => setActiveTab("recommended")}
          >
            Recommended
          </motion.button>
        </motion.div>
      </div>

      {/* Requirements Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={`${activePlatform}-${activeTab}`}
      >
        {requirements[activePlatform][activeTab].map((req, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover="hover"
            className="bg-game-dark/80 p-5 sm:p-6 rounded-lg border border-game-primary/10 hover:border-game-primary transition-all cursor-pointer flex flex-col items-start"
          >
            <div className="text-game-primary text-xs sm:text-sm  uppercase tracking-wider mb-2">
              {req.component}
            </div>
            <div className="text-white text-base sm:text-lg font-medium">
              {req.value}
            </div>
            {idx === 0 && (
              <div className="mt-4 text-xs text-gray-400 font-medium self-end">
                {activePlatform === "pc" ? "🖥️ PC Version" : "📱 Mobile Version"}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-8 text-center text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>* Requirements may change during development</p>
        <p className="mt-1">* SSD recommended for best performance</p>
      </motion.div>
    </motion.div>
  );
};

export default SystemRequirements;