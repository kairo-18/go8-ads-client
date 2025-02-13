import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightBoard from "../Res1/FlightBoard";
import axios from "axios";

function Res2() {
    const [isAds, toggleAds] = useState(false);
    const [ads, setAds] = useState([]);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await axios.get("http://localhost:3000/screens");
                
                // Find the screen with layoutType "Res2" and get its ads
                const screen = response.data.find(screen => screen.layoutType === "Res2");
                
                // Extract the ads if the screen exists
                const filteredAds = screen ? screen.ads : [];

                console.log("Filtered Ads (Res2):", filteredAds);
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
                setCurrentAdIndex((prevIndex) => (prevIndex + 2) % ads.length);
            }, 15000);
            return () => clearInterval(interval);
        }
    }, [ads]);

    return (
        <div className="w-screen h-screen flex overflow-hidden">
            {/* Flight detail board */}
            <div
                className={isAds ? "w-3/4 transition-all duration-500" : "w-full transition-all duration-500"}
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
                        className="ads w-1/4 bg-black text-white flex flex-col items-center justify-center space-y-2 p-2"
                    >
                        {ads.slice(currentAdIndex, currentAdIndex + 2).map((ad, index) => (
                            <div key={ad.id} className="w-full h-1/2 flex items-center justify-center">
                                {ad.mediaUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                                    <img className="w-full h-full object-cover rounded-md" src={ad.mediaUrl} alt="Ad" />
                                ) : ad.mediaUrl.match(/\.(mp4|webm|ogg)$/) ? (
                                    <video className="w-full h-full object-cover rounded-md" src={ad.mediaUrl} autoPlay loop muted />
                                ) : (
                                    <p>No valid ad available</p>
                                )}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Res2;
