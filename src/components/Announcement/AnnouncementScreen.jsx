import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Announcement({ announcement, onComplete }) {
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, announcement.duration * 1000);

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

function MarqueeAnnouncement({ announcement, onComplete }) {
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => {
        setIsRunning(false);
        onComplete?.();
      }, announcement.duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [announcement, onComplete]);

  if (!announcement || !isRunning) return null;

  return (
    <div className="w-full bg-blue-900 text-yellow-300 py-4 overflow-hidden">
      <motion.div
        className="whitespace-nowrap text-3xl font-semibold"
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
        {announcement.title?.toUpperCase()} - {announcement.message}
        {announcement.flightNumber && ` ✈️ Flight: ${announcement.flightNumber}`}
        {announcement.gate && ` 🛫 Gate: ${announcement.gate}`}
      </motion.div>
    </div>
  );
}

function AnnouncementScreen({ announcement, onComplete }) {
  if (!announcement) return null;

  return announcement.announcementType === "Screen Takeover" ? (
    <Announcement announcement={announcement} onComplete={onComplete} />
  ) : (
    <MarqueeAnnouncement announcement={announcement} onComplete={onComplete} />
  );
}

export default AnnouncementScreen;
