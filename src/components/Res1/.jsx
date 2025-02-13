import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightBoard from "./FlightBoard";
import sampleAds from "./Adobe_ad.gif";

function Res1() {
    const [isAds, toggleAds] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            toggleAds((prev) => !prev);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-screen h-screen flex flex-col overflow-hidden relative">
            {/* Main Content (Flight Board + Ads) */}
            <div className="flex flex-row w-full h-full transition-all duration-500">
                {/* Flight Board dynamically adjusts width */}
                <div className={`transition-all duration-500 ${isAds ? "w-3/4" : "w-full"} h-full`}>
                    <FlightBoard />
                </div>

                {/* Animated Ads Section */}
                <AnimatePresence>
                    {isAds && (
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="w-1/4 h-full bg-black flex items-center justify-center"
                        >
                            <img className="w-full h-full object-cover" src={sampleAds} alt="ads" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Blue bottom border box (Positioned at bottom) */}
            <div className="absolute bottom-0 w-full bg-blue-600 text-white text-sm flex justify-between px-4 py-2 border-t-4 border-blue-800">
                <span>Updated 9:12 PM</span>
                <span>Monday, January 6, 2025</span>
            </div>
        </div>
    );
}

export default Res1;
