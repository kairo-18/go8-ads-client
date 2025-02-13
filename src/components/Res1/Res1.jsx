import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightBoard from "./FlightBoard";
import axios from "axios";

function Res1() {
    const [isAds, toggleAds] = useState(false);
    const [ads, setAds] = useState([]);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await axios.get("http://localhost:3000/screens");
        
                // Find the screen with layoutType "Res1" and get its ads
                const screen = response.data.find(screen => screen.layoutType === "Res1");
        
                // Extract the ads if the screen exists
                const filteredAds = screen ? screen.ads : [];
        
                console.log("Filtered Ads:", filteredAds); // Debugging
                setAds(filteredAds);
            } catch (error) {
                console.error("Error fetching ads:", error);
            }
        };
        
        fetchAds();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            toggleAds((prev) => !prev);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    // Cycle through ads every 15 seconds
    useEffect(() => {
        if (ads.length > 0) {
            const interval = setInterval(() => {
                setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
            }, 15000);
            return () => clearInterval(interval);
        }
    }, [ads]);

    return (
        <div className="w-screen h-screen flex overflow-hidden">
            {/* Flight detail board */}
            <div
                className={
                    isAds
                        ? "w-3/4 transition-all duration-500"
                        : "w-full transition-all duration-500"
                }
            >
                <FlightBoard />
            </div>

            {/* Ads div with animation */}
            <AnimatePresence>
                {isAds && ads.length > 0 && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="ads w-1/4 bg-black text-white flex items-center justify-center"
                    >
                        {ads[currentAdIndex]?.mediaUrl?.match(/\.(jpeg|jpg|png|gif)$/) ? (
                           <img className="w-full h-full object-cover" src={ads[currentAdIndex]?.mediaUrl} alt="Ad" />

                        ) : ads[currentAdIndex]?.mediaUrl?.match(/\.(mp4|webm|ogg)$/) ? (
                            <video className="w-full h-full object-cover" src={ads[currentAdIndex].mediaUrl} autoPlay loop muted />
                        ) : (
                            <p>No valid ads available</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Res1;
