import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightBoard from "./FlightBoard";
import axios from "axios";

function Res1({ screenId }) {
    const [isAds, toggleAds] = useState(true); // Enable ads by default
    const [ads, setAds] = useState([]);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/screens/${screenId}`);
                const screen = response.data;
                setAds(screen.ads || []);
            } catch (error) {
                console.error("Error fetching ads:", error);
            }
        };
        fetchAds();
    }, [screenId]);

    useEffect(() => {
        if (ads.length > 0) {
            const interval = setInterval(() => {
                toggleAds(false); // Hide ads
                setTimeout(() => {
                    setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
                    toggleAds(true); // Show ads
                }, 5000); // Wait for 5 seconds before showing the next ad
            }, 10000); // Interval of 10 seconds (5 seconds for hiding + 5 seconds for showing)
            return () => clearInterval(interval);
        }
    }, [ads]);

    return (
        <div className="w-screen h-screen flex flex-col overflow-hidden relative">
            <div className="flex flex-row w-full h-full transition-all duration-500">
                <div className={`transition-all duration-500 ${isAds ? "w-3/4" : "w-full"} h-full`}>
                    <FlightBoard />
                </div>
                <AnimatePresence>
                    {isAds && ads.length > 0 && (
                        <motion.div
                            key={ads[currentAdIndex]?.id || currentAdIndex}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="ads w-1/4 bg-black text-white flex items-center justify-center"
                        >
                            <img
                                className="w-full h-full object-cover"
                                src={ads[currentAdIndex].mediaUrl}
                                alt="Ad"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="absolute bottom-0 w-full bg-blue-600 text-white text-sm flex justify-between px-4 py-2 border-t-4 border-blue-800">
                <span>Updated 9:12 PM</span>
                <span>Monday, January 6, 2025</span>
            </div>
        </div>
    );
}

export default Res1;
