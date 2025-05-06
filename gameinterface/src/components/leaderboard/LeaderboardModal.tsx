import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data - replace with real data later
const generateMockData = (category: string) =>
    Array.from({ length: 100 }, (_, i) => ({
        rank: i + 1,
        name: `Player ${i + 1}`,
        score: Math.floor(Math.random() * 10000),
        category
    }));

interface LeaderboardModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const LeaderboardModal = ({ open, onOpenChange }: LeaderboardModalProps) => {
    const categories = ["Hunting", "Gathering", "Gold", "Crafting", "Farmer", "PvP"];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[800px] w-[95vw] bg-gray-900 border-game-primary overflow-x-hidden pr-2 scrollbar scrollbar-thin">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-game-primary flex items-center gap-2">
                        <Trophy className="h-6 w-6" />
                        Top 100 Leaderboard
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue={categories[0]} className="w-full">
                    {/* Scrollable Tabs Header */}
                    <div className="relative">
                        {/* Tabs wrapper - responsive layout */}
                        <div className="py-2">
                            <TabsList
                                className={cn(
                                    // Mobile: grid 2x2
                                    "grid grid-cols-3 gap-3",

                                    // Tablet dan atas: scrollable horizontal layout
                                    "sm:flex sm:overflow-x-auto sm:space-x-1 sm:w-max sm:p-1 sm:bg-gray-800",

                                    // Shared styles
                                    "h-auto sm:h-10 items-center justify-center"
                                )}
                            >
                                {categories.map((category) => (
                                    <TabsTrigger
                                        key={category}
                                        value={category}
                                        className={cn(
                                            "data-[state=active]:bg-game-primary whitespace-nowrap",
                                            "px-3 py-1 text-sm sm:text-base",
                                            "rounded-md transition-all",
                                            "min-w-max"
                                        )}
                                    >
                                        {category}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {/* Scroll gradient overlay (only for sm and above) */}
                        <div className="hidden sm:block absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none" />
                    </div>


                    {/* Tab Content with responsive scrollable table */}
                    {categories.map((category) => (
                        <TabsContent key={category} value={category} className="mt-4">
                            <div className="max-h-[400px] overflow-auto rounded-md border border-gray-800">
                                <div className="min-w-full overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-800/50">
                                                <TableHead className="w-20 text-game-primary">Rank</TableHead>
                                                <TableHead className="text-game-primary">Player</TableHead>
                                                <TableHead className="text-right text-game-primary">Score</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {generateMockData(category).map((entry) => (
                                                <TableRow key={entry.rank} className="border-gray-800 hover:bg-gray-800/50">
                                                    <TableCell className="font-medium text-gray-300">#{entry.rank}</TableCell>
                                                    <TableCell className="text-gray-300">{entry.name}</TableCell>
                                                    <TableCell className="text-right text-gray-300">{entry.score}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};

export default LeaderboardModal;
