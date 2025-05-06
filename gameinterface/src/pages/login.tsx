import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Wallet, List, Settings2, RefreshCw, Heading, Globe, Map, LogOut, Youtube, Twitter, } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LeaderboardModal from "@/components/leaderboard/LeaderboardModal";

import useGameSettings from "@/context/Settings";

import Grid from '@/components/layout/Grid';
import { useAuth } from "@/context/authcontext";


const serverList = [
    {
        id: 1,
        name: "Alpha Server",
        region: "Asia",
        ping: 45,
        status: "Online",
    },
    {
        id: 2,
        name: "Beta Server",
        region: "Europe",
        ping: 68,
        status: "Online"
    },
    {
        id: 3,
        name: "Gamma Server",
        region: "North America",
        ping: 120,
        status: "Online"
    }
];

const regionTypes = [
    "All Regions",
    "Asia",
    "Europe",
    "North America"
];

const characterTypes = [
    {
        title: "Mage",
        description: "Wielders of arcane magic, mages command powerful spells and elemental forces.",
        image: "/news/Mage.jpg"
    },
];

const Index = () => {
    const [isWalletConnected, setIsWalletConnected] = React.useState(false);
    const [showServerModal, setShowServerModal] = React.useState(false);
    const [selectedRegion, setSelectedRegion] = React.useState("All Regions");
    const [showLeaderboardModal, setShowLeaderboardModal] = React.useState(false);
    const { toggleSettings } = useGameSettings();

    const { isAuthenticated, principal, login, logout } = useAuth();

    const navigate = useNavigate();

    const handleConnectWallet = async () => {
        try {
          setIsWalletConnected(true);
          await login();
        } catch (error) {
          setIsWalletConnected(false); 
        }
      };

    const handleJoinWorld = () => {
        setShowServerModal(true);
    };

    const handleLogout = () => {
        setIsWalletConnected(false);
        setShowServerModal(false);
        logout();
    };

    const [selectedServer, setSelectedServer] = React.useState<number | null>(null);

    const handleServerSelect = (serverId: number) => {
        setSelectedServer(serverId);
    };

    const handleRegionSelect = (region: string) => {
        setSelectedRegion(region);
    };

    const filteredServers = selectedRegion === "All Regions"
        ? serverList
        : serverList.filter(server => server.region === selectedRegion);

    const handleJoinServer = () => {
        if (selectedServer) {
            setShowServerModal(false);
            navigate('/environment');
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
          setIsWalletConnected(true); 
        } else {
          setIsWalletConnected(false);
        }
      }, [isAuthenticated]);
    

    return (

        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0">
                <Grid
                    speed={0.5}
                    squareSize={40}
                    direction='diagonal'
                    borderColor='#fff'
                    hoverFillColor='#222'
                />
            </div>


            <div className="w-full max-w-[1000px] rounded-2xl overflow-hidden bg-black/60 backdrop-blur-lg border border-game-primary/30 shadow-2xl grid md:grid-cols-2 gap-4 p-4">
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-900/50 to-transparent">
                    <div className="text-center mb-6 sm:mb-8">
                        <img
                            src="/canivive.png"
                            alt="Canivive Logo"
                            className="mx-auto mb-3 sm:mb-4 h-32 sm:h-40 w-auto"
                        />
                        <p className="text-gray-300 text-xs sm:text-sm px-2">
                            Join the adventure and become a legend in our epic gaming universe.
                        </p>
                    </div>

                    <div className="w-full max-w-xs sm:max-w-md space-y-4">
                        {!isAuthenticated  ? (
                            <Button
                                onClick={handleConnectWallet}
                                className="w-full bg-game-primary hover:bg-game-secondary text-white font-bold py-4 sm:py-5 text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-lg"
                            >
                                <Wallet className="mr-2 sm:mr-3" size={18} />
                                Connect Wallet
                            </Button>
                        ) : (
                            <>
                                <Button
                                    onClick={handleJoinWorld}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 sm:py-5 text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-lg"
                                >
                                    <List className="mr-2 sm:mr-3" size={18} />
                                    Join World
                                </Button>

                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    <Button
                                        variant="ghost"
                                        className="text-game-light hover:bg-game-tertiary text-xs sm:text-sm"
                                        onClick={() => setShowLeaderboardModal(true)}
                                    >
                                        <RefreshCw className="mr-1 sm:mr-2" size={14} />
                                        <span className="sm:inline hidden">Leaderboards</span>
                                        <span className="sm:hidden">Ranks</span>
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="text-game-light hover:bg-game-tertiary text-xs sm:text-sm"
                                        onClick={toggleSettings}
                                    >
                                        <Settings2 className="mr-1 sm:mr-2" size={14} />
                                        <span className="sm:inline hidden">Settings</span>
                                        <span className="sm:hidden">Config</span>
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="text-game-light hover:bg-red-700 bg-red-600 text-xs sm:text-sm"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="mr-1 sm:mr-2" size={14} />
                                        <span className="sm:inline hidden">Logout</span>
                                        <span className="sm:hidden">Exit</span>
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-lg p-4">

                    <div className="flex items-center gap-2 bg-black/30 p-3 rounded-lg mb-4 border border-game-primary/20">
                        <h2 className="text-xl font-bold text-game-primary">News</h2>
                    </div>

                    <ScrollArea className="h-[calc(100%-60px)]">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {characterTypes.map((character, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative group overflow-hidden rounded-lg">
                                            <img
                                                src={character.image}
                                                alt={character.title}
                                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                                <h3 className="text-xl font-bold text-game-primary mb-1">
                                                    {character.title}
                                                </h3>
                                                <p className="text-gray-300 text-xs">
                                                    {character.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2 top-1/2 bg-black/50 hover:bg-black/70" />
                            <CarouselNext className="right-2 top-1/2 bg-black/50 hover:bg-black/70" />
                        </Carousel>
                    </ScrollArea>
                </div>
            </div>





            <Dialog open={showServerModal} onOpenChange={setShowServerModal}>
                <DialogContent className="bg-gray-900 border border-game-primary max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="text-game-primary text-2xl flex items-center gap-2">
                            <Globe className="h-6 w-6" />
                            Select Region & Server
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Choose your preferred server location
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <Select value={selectedRegion} onValueChange={handleRegionSelect}>
                            <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="Select Region" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 text-white border-gray-700 z-[9999]">
                                {regionTypes.map((region) => (
                                    <SelectItem key={region} value={region}>
                                        {region}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>


                        {filteredServers.map((server) => (
                            <div key={server.id} className="space-y-4">
                                <button
                                    className={cn(
                                        "w-full p-4 bg-gray-800 hover:bg-game-tertiary rounded-lg text-left transition-all duration-200 border",
                                        selectedServer === server.id
                                            ? "border-game-primary"
                                            : "border-gray-700 hover:border-game-primary"
                                    )}
                                    onClick={() => handleServerSelect(server.id)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <h3 className="text-game-primary font-bold flex items-center gap-2">
                                                {server.name}
                                                <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">
                                                    {server.ping}ms
                                                </span>
                                            </h3>
                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                <Map className="h-4 w-4" />
                                                {server.region}
                                            </p>
                                        </div>
                                        <span className="text-green-400 text-sm font-semibold">{server.status}</span>
                                    </div>
                                </button>
                            </div>
                        ))}

                        {selectedServer && (
                            <Button
                                onClick={handleJoinServer}
                                className="w-full text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                            >
                                Join Selected Server
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <LeaderboardModal
                open={showLeaderboardModal}
                onOpenChange={setShowLeaderboardModal}
            />
        </div>
    );
};

export default Index;