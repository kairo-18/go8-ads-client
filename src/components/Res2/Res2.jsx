import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightBoard from "../Res1/FlightBoard";
import axios from "axios";

function Res2({ screenId }) {
    const [isAds, toggleAds] = useState(false);
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
                    setCurrentAdIndex((prevIndex) => (prevIndex + 2) % ads.length);
                    toggleAds(true); // Show ads
                }, 5000); // Wait for 5 seconds before showing the next ad
            }, 10000); // Interval of 10 seconds (5 seconds for hiding + 5 seconds for showing)
            return () => clearInterval(interval);
        }
    }, [ads]);

    return (
        <div className="w-screen h-screen flex overflow-hidden">
            {/* Flight detail board */}
            <div className={isAds ? "w-3/4 transition-all duration-500" : "w-full transition-all duration-500"}>
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
