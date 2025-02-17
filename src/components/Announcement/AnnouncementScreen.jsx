import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function AnnouncementScreen({ announcement, onComplete }) {
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => {
        onComplete?.(); // Call the onComplete function once the announcement duration ends
      }, announcement.duration * 1000); // Duration in seconds

      // Clean up the timer when the component is unmounted or announcement changes
      return () => clearTimeout(timer);
    }
  }, [announcement, onComplete]);

  if (!announcement) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={announcement.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="w-screen h-screen flex flex-col items-center justify-center bg-blue-900 text-yellow-300 text-center p-8"
      >
        <h1 className="text-6xl font-extrabold tracking-widest">
          {announcement.title?.toUpperCase()}
        </h1>
        <p className="text-4xl mt-6 font-semibold">{announcement.message}</p>
        {announcement.flightNumber && (
          <p className="text-3xl mt-8 font-medium">
            ✈️ Flight: {announcement.flightNumber}
          </p>
        )}
        {announcement.gate && (
          <p className="text-3xl mt-2 font-medium">🛫 Gate: {announcement.gate}</p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default AnnouncementScreen;
