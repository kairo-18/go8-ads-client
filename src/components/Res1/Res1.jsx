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
                {isAds && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="ads w-1/4 bg-black text-white flex items-center justify-center"
                    >
                        <img className="w-full h-full" src={sampleAds} alt="ads" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Res1;
