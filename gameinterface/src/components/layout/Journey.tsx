import { motion } from 'framer-motion';

const timelineItems = [
    {
        year: "2025",
        event: "Concept Born",
        detail: "Initial idea sketched in notebooks ",
        icon: "💡"
    },
    {
        year: "2025",
        event: "First Prototype",
        detail: "Core gameplay mechanics established and The main <br> focus was to build the foundation of the gameplay,<br> the game world, and the player interaction systems.",
        icon: "🛠️"
    },
    {
        year: "2025",
        event: "Alpha Release",
        detail: "Private first playable version released testers",
        icon: "🎮"
    },
    {
        year: "2025",
        event: "Beta Launch",
        detail: "Expanded to players worldwide",
        icon: "🚀"
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export default function Timeline() {
    return (
        <div className="py-16 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h3 className="text-3xl font-bold text-white mb-12 text-center font-heading">
                    Our Journey
                    <span className="block w-16 h-1 bg-game-primary mx-auto mt-4 rounded-full"></span>
                </h3>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">

                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-game-primary to-transparent transform -translate-x-1/2"></div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative space-y-16"
                >
                    {timelineItems.map((item, idx) => (
                        <motion.div
                            key={idx}
                            variants={itemVariants}
                            className={`
            relative w-full
            px-0 sm:px-4
            text-left
            ${idx % 2 === 0 ? 'lg:pr-8 lg:pl-0 lg:text-right' : 'lg:pl-8 lg:text-left'}
          `}
                        >

                            <motion.div
                                className={`
              hidden lg:flex
              absolute top-0 w-6 h-6 rounded-full bg-game-primary border-4 border-game-primary/20
              items-center justify-center text-white text-xs
              ${idx % 2 === 0 ? 'left-1/2 -ml-3' : 'left-1/2 -ml-3 lg:left-auto lg:right-1/2 lg:-mr-3'}
            `}
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                {item.icon}
                            </motion.div>


                            <motion.div

                                whileHover={{
                                    y: -5,
                                    transition: { duration: 0.3 }
                                }}

                            >

                                <div className="inline-block mb-2 px-3 py-1 bg-game-primary/20 rounded-full text-xs text-game-primary font-semibold tracking-wide">
                                    {item.year}
                                </div>


                                <h5 className="text-2xl font-bold text-white mt-2 mb-3 leading-snug">
                                    {item.event}
                                </h5>


                                <p className="text-gray-300/90 text-sm leading-relaxed mb-4">
                                    {item.detail.split('<br>').map((text, i) => (
                                        <span key={i}>
                                            {text}
                                            {i < item.detail.split('<br>').length - 1 && <br className="mb-2" />}
                                        </span>
                                    ))}
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>


    );
}