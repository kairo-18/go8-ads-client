import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import axiosInstance from "../../axios/axiosInstance";

function AnnouncementScreen({ onComplete }) {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch Announcements from API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axiosInstance.get("http://localhost:3000/announcements");
        console.log("📡 Fetched Announcements:", response.data); // Debug log
        setAnnouncements(response.data || []);
      } catch (error) {
        console.error("❌ Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  // Cycle through announcements
  useEffect(() => {
    if (announcements.length > 0) {
      const duration = announcements[currentIndex]?.duration * 1000 || 5000; // Default 5s
      const timer = setTimeout(async () => {
        const displayedAnnouncement = announcements[currentIndex];
        console.log("🚀 Showing Announcement:", displayedAnnouncement);

        try {
          await axios.patch(
            `http://localhost:3000/announcements/${displayedAnnouncement.id}/deactivate`
          );
          console.log(`✅ Announcement ${displayedAnnouncement.id} set to inactive`);
        } catch (error) {
          console.error("❌ Error deactivating announcement:", error);
        }

        if (currentIndex + 1 < announcements.length) {
          setCurrentIndex((prevIndex) => prevIndex + 1);
        } else {
          console.log("🎬 Announcement cycle complete. Calling onComplete()");
          setTimeout(() => {
            onComplete?.();
          }, 1000); // Delay before closing
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, announcements, onComplete]);

  // Display message if no announcements are available
  if (announcements.length === 0) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-blue-900 text-yellow-300">
        <h1 className="text-5xl">No Announcements Available</h1>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={announcements[currentIndex]?.id || currentIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="w-screen h-screen flex flex-col items-center justify-center bg-blue-900 text-yellow-300 text-center p-8"
      >
        <h1 className="text-6xl font-extrabold tracking-widest">
          {announcements[currentIndex]?.title?.toUpperCase()}
        </h1>
        <p className="text-4xl mt-6 font-semibold">
          {announcements[currentIndex]?.message}
        </p>
        {announcements[currentIndex]?.flightNumber && (
          <p className="text-3xl mt-8 font-medium">
            ✈️ Flight: {announcements[currentIndex]?.flightNumber}
          </p>
        )}
        {announcements[currentIndex]?.gate && (
          <p className="text-3xl mt-2 font-medium">
            🛫 Gate: {announcements[currentIndex]?.gate}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default AnnouncementScreen;
