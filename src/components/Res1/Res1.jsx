import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";  // Make sure AnimatePresence is imported
import FlightBoard from "./FlightBoard";
import AnnouncementScreen from "../Announcement/AnnouncementScreen";
import axiosInstance from "../../axios/axiosInstance";
import io from "socket.io-client";
import axios from "axios";

// Assuming your server is running at localhost:3000
const socket = io("http://localhost:3000"); // Connect to your WebSocket server

function Res1({ screenId }) {
  const [isAds, toggleAds] = useState(false);
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [announcements, setAnnouncements] = useState([]); // Store all received announcements
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null); // The latest announcement to show
  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false);

  // Fetching announcements and listening for new ones via WebSocket
  useEffect(() => {
    socket.on(`announcementToScreen-${screenId}`, (newAnnouncement) => {
      console.log("New announcement received for screen:", newAnnouncement);
      setAnnouncements([newAnnouncement]); // Only keep the latest announcement
      setCurrentAnnouncement(newAnnouncement); // Show the latest announcement immediately
    });

    // Clean up WebSocket listener when the component unmounts
    return () => {
      socket.off(`announcementToScreen-${screenId}`);
    };
  }, [screenId]); // Listen for events based on the current screenId

  // Deactivate the current announcement after its duration
  useEffect(() => {
    if (currentAnnouncement) {
      const timer = setTimeout(async () => {
        try {
          // Deactivate the announcement after its specified duration
          await axiosInstance.patch(`http://localhost:3000/announcements/${currentAnnouncement.id}/deactivate`);
          console.log(`✅ Announcement ${currentAnnouncement.id} set to inactive`);
        } catch (error) {
          console.error("Error deactivating announcement:", error);
        }

        setCurrentAnnouncement(null); // Reset current announcement after duration
      }, currentAnnouncement.duration * 1000); // Duration in seconds

      // Clean up the timeout when the component unmounts or announcement changes
      return () => clearTimeout(timer);
    }
  }, [currentAnnouncement]);

  // Fetching ads for the current screenId
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:3000/screens/${screenId}`);
        setAds(response.data.ads || []);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, [screenId]);

  // Cycling through ads
  useEffect(() => {
    if (ads.length > 0) {
      const interval = setInterval(() => {
        toggleAds(false);
        setTimeout(() => {
          setCurrentAdIndex((prevIndex) => (prevIndex + 2) % ads.length);
          toggleAds(true);
        }, 5000); // Change ad every 5 seconds
      }, 10000); // Change ad every 10 seconds
      return () => clearInterval(interval);
    }
  }, [ads]);

  // If there is a current announcement, display it
  if (currentAnnouncement) {
    return <AnnouncementScreen announcement={currentAnnouncement} onComplete={() => setCurrentAnnouncement(null)} />;
  }

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
        <span>Updated {new Date().toLocaleTimeString()}</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default Res1;
