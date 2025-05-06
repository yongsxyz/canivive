import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Swords,
  PackageSearch,
  Trees,
  FlaskConical,
  TrendingUp,
  BadgeDollarSign,
  CalendarCheck2,
} from "lucide-react";

import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Lightning from '@/components/layout/Lightning';
import SplashCursor from '@/components/layout/Glitich';
import ElasticSlider from '@/components/layout/Sounds'

import Orb from '@/components/layout/Circle';
import Aurora from '@/components/layout/Aurora';
import { Volume2 } from "lucide-react";

import Timeline from '@/components/layout/Journey';
import SystemRequirements from '@/components/layout/Requitments';

const Index = () => {
  const characters = ["Tank", "Archer", "Warrior", "Assasins", "Mage", "Healer"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % characters.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [characters.length]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-game-dark to-gray-900 relative overflow-hidden">
      <Navbar />
      <section id="home" className="relative h-screen flex items-center justify-center">

        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-b from-game-dark to-gray-900 opacity-40">
          <div className="relative w-full h-full max-w-4xl mx-auto px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.8 }
                }}
                exit={{
                  opacity: 0,
                  scale: 0.7,
                  transition: { duration: 0.5 }
                }}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >

                <div className="relative w-full max-w-[600px] h-[300px] sm:h-[400px] md:h-[600px] aspect-square">
                  <motion.img
                    src={`karakter/${characters[currentIndex]}.png`}
                    alt={characters[currentIndex]}
                    className="w-full h-full object-contain"
                    initial={{ filter: "brightness(0.8)" }}
                    animate={{
                      filter: "brightness(1.1)",
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl sm:blur-3xl -z-10" />
                </div>
                <motion.div
                  className="mt-4 md:mt-8 text-center px-4"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="hidden sm:block text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center break-words px-2 max-w-full transform -translate-y-2">
                    {characters[currentIndex]}
                  </h2>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
              {characters.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-white w-4 sm:w-6 md:w-8' : 'bg-white/30'}`}
                />
              ))}
            </div>
          </div>
        </div>


        <div className="absolute inset-0 w-full h-full hidden md:block ">
          <Lightning
            hue={220}
            xOffset={1.2}
            speed={0.3}
            intensity={1}
            size={0.8}
          />


        </div>



        <div className="absolute inset-0 w-full h-full hidden md:block">
          <Lightning
            hue={355}
            xOffset={-1.6}
            speed={0.3}
            intensity={1}
            size={0.6}

          />
        </div>


        <div className="container mx-auto px-4 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Epic Adventure Awaits
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Embark on an incredible journey through mystical realms and epic battles
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 justify-center"
            >


       
 
              <div className="flex flex-col items-center" >
              <Link to="/login">
                <div className="relative w-38 h-38  flex items-center justify-center" style={{ cursor: "pointer" }}>
                  <Orb
                    hoverIntensity={0.3}
                    rotateOnHover={true}
                    hue={314}
                    forceHoverState={false}
                  />
                  <span className="absolute text-white font-bold">Play Game</span>
                </div>
                </Link>
                <ElasticSlider
                  leftIcon={<><Volume2 className="text-white w-5 h-5" /></>}
                  rightIcon={""}
                  startingValue={1}
                  defaultValue={100}
                  maxValue={100}
                  isStepped
                  stepSize={2}
                />
              </div>
       
            </motion.div>


          </motion.div>
        </div>
      </section>

      {/*   
  <SplashCursor />
 */}



      <motion.section
        id="discover"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-24 overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-game-primary rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-game-accent rounded-full filter blur-3xl opacity-10 animate-pulse delay-300"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center">
              <span className="text-game-primary text-sm uppercase tracking-wider mr-3">Discover</span>
              <div className="w-8 h-px bg-game-primary"></div>
            </div>
            <h2 className="text-5xl font-bold text-white mt-4 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-game-primary to-game-accent">
                Epic Origins
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Journey into a world where legends are born and destinies are forged
            </p>
          </motion.div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-white">
                  Own the World You Survive In
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Canivive, every tree you chop, every enemy you fight, and every structure you build shapes a living world powered by ICP. As you battle, gather, trade, and expand, your actions leave permanent marks on a decentralized, player-driven frontier.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-white">
                  Designed for the Web3 Era
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Developed from scratch using Three.js, ECS, and Internet Computer (ICP) canisters, Canivive isn’t just a game—it’s a fully on-chain sandbox survival experience. With real asset ownership, no central servers, and deep gameplay systems, your journey isn’t just play.
                </p>
              </div>


              <div className="flex flex-wrap gap-4 pt-4">
                <Button className="bg-game-primary hover:bg-game-primary/90 text-white px-8 py-6 text-lg">
                  Join Now
                </Button>
                <Button variant="outline" className="border-game-accent text-game-accent hover:bg-game-accent/10 px-8 py-6 text-lg">
                  Docs
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden border border-game-primary/30 shadow-2xl shadow-game-primary/20">
                <div className="absolute inset-0 bg-gradient-to-br from-game-dark to-gray-900 flex items-center justify-center">
                  <div className="relative z-10 text-center p-8">
                    <span className="text-xl text-white font-medium">Game Trailer (Soon)</span>
                  </div>
                </div>

                <div className="absolute inset-0 border-2 border-game-primary/20 rounded-xl pointer-events-none"></div>
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-game-primary/50"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-game-primary/50"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-game-primary/50"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-game-primary/50"></div>
              </div>

              {/* Floating stats */}
              <div className="absolute -bottom-6 -left-6 bg-game-dark/90 backdrop-blur-sm border border-game-primary/30 p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-game-primary">10k</div>
                  <div className="text-sm text-gray-300">Active Players</div>

                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-game-dark/90 backdrop-blur-sm border border-game-accent/30 p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-game-accent">97%</div>
                  <div className="text-sm text-gray-300">Positive Reviews</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Signature */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <div className="inline-block border-t border-game-primary/30 pt-6">
              <p className="text-gray-400 ">"We didn't just create a game - we built a world worth believing in."</p>
              <p className="text-game-primary mt-2">- yongsxyz</p>
            </div>
          </motion.div>
        </div>
      </motion.section>


      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative py-24 overflow-hidden"
        id="aaaa" 
      >
        <div className="relative z-10 bg-game-primary/5" >
          <div className="absolute inset-0" style={{ zIndex: -1 }}>
            <Aurora
              colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
              blend={0.5}
              amplitude={-1} // dinaikin
              speed={0.5}
            />
          </div>
          <div className="container mx-auto px-4 py-16" style={{ zIndex: 2 }}>
            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Features</h2>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                Discover what makes our game an unforgettable experience
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}

              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            >
              <FeatureCard
                icon={<ShieldCheck className="h-8 w-8 text-green-400" />}
                title="On-Chain Ownership"
                description="True item and land ownership secured by ICP blockchain."
              />
              <FeatureCard
                icon={<Swords className="h-8 w-8 text-red-500" />}
                title="Faction Wars & PvP"
                description="Join epic large-scale PvP battles for control and glory."
              />
              <FeatureCard
                icon={<PackageSearch className="h-8 w-8 text-blue-400" />}
                title="Looting & Storage"
                description="Gather rare items, store them safely, or trade in marketplace."
              />
              <FeatureCard
                icon={<Trees className="h-8 w-8 text-yellow-500" />}
                title="Farming & Land System"
                description="Own land, cultivate crops, and build your custom homestead."
              />
              <FeatureCard
                icon={<FlaskConical className="h-8 w-8 text-purple-400" />}
                title="Buffs & Crafting"
                description="Boost your power with potions, food, and specialized tools."
              />
              <FeatureCard
                icon={<TrendingUp className="h-8 w-8 text-pink-400" />}
                title="Play-to-Earn"
                description="Trade skins, items, and lands as NFTs using CNV tokens."
              />
              <FeatureCard
                icon={<BadgeDollarSign className="h-8 w-8 text-game-gold" />}
                title="Create NFT"
                description="Make your skins, items, and lands into NFTs and sell them."
              />

              <FeatureCard
                icon={<CalendarCheck2 className="h-8 w-8 text-cyan-400" />}
                title="Daily Quests"
                description="Complete daily challenges and mint Gold on-chain."
              />
            </motion.div>


          </div>


        </div>
      </motion.section>

      <div id="journey">
        <Timeline />
      </div>
      <SystemRequirements />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mb-16"
      >
        <div className="p-8 backdrop-blur-sm border border-game-primary/20">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Begin Your Adventure?
          </h2>
          <p className="text-gray-300 mb-6">
            Join thousands of players in this epic journey
          </p>
          <Link to="/login">
            <Button className="bg-game-accent hover:bg-game-accent/80 text-white px-8 py-4 text-lg">
              Start Playing
            </Button>
          </Link>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
      <Card className="bg-game-dark/50 border-game-primary/20 backdrop-blur-sm hover:border-game-primary/40 transition-colors">
        <CardContent className="p-6">
          <div className="mb-4">{icon}</div>
          <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Index;