import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightBoard from "./FlightBoard";
import AnnouncementScreen from "../Announcement/AnnouncementScreen";
import axiosInstance from "../../axios/axiosInstance";
import io from "socket.io-client";

// Assuming your server is running at localhost:3000
const socket = io("http://localhost:3000"); // Connect to your WebSocket server

function Res1({ screenId }) {
  const [isAds, toggleAds] = useState(true);
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  // On component mount, send the 'joinScreen' message with the screenId
  useEffect(() => {
    socket.emit('joinScreen', screenId);  // Make sure each screen sends its unique screenId to join the server
    console.log(`Screen ${screenId} joined.`);

    // Listen for announcements specific to this screen
    socket.on(`announcementToScreen-${screenId}`, (newAnnouncement) => {
      console.log("New announcement received for screen:", newAnnouncement);
      setAnnouncements((prev) => [...prev, newAnnouncement]); // Add new announcement to the list
    });

    // Clean up the WebSocket listener when the component unmounts
    return () => {
      socket.off(`announcementToScreen-${screenId}`); // Stop listening for this screen's announcements
    };
  }, [screenId]); // Dependency on screenId to ensure it's tied to this specific screen

  // Deactivate the current announcement after its duration
  useEffect(() => {
    if (announcements.length > 0 && !currentAnnouncement) {
      const nextAnnouncement = announcements[announcementIndex];

      if (nextAnnouncement) {
        setCurrentAnnouncement(nextAnnouncement);

        // Deactivate after the specified duration
        setTimeout(async () => {
          try {
            // Deactivate the announcement after the duration has elapsed
            await axiosInstance.patch(
              `http://localhost:3000/announcements/${nextAnnouncement.id}/deactivate`
            );
            console.log(`✅ Announcement ${nextAnnouncement.id} set to inactive`);
          } catch (error) {
            console.error("Error deactivating announcement:", error);
          }

          // Move to the next announcement or reset the index
          setAnnouncementIndex((prevIndex) =>
            prevIndex + 1 < announcements.length ? prevIndex + 1 : 0
          );
          setCurrentAnnouncement(null);
        }, nextAnnouncement.duration * 1000); // Duration in seconds (converted to ms)
      }
    }
  }, [announcementIndex, announcements]);

  useEffect(() => {
    // Fetch ads for the screen
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

  useEffect(() => {
    if (ads.length > 0) {
      const interval = setInterval(() => {
        toggleAds(false);
        setTimeout(() => {
          setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
          toggleAds(true);
        }, 5000); // Duration to display each ad (e.g., 5 seconds)
      }, 10000); // Change ad every 10 seconds
      return () => clearInterval(interval);
    }
  }, [ads]);

  if (currentAnnouncement) {
    console.log("🚀 Rendering AnnouncementScreen:", currentAnnouncement);

    return (
      <AnnouncementScreen
        announcement={currentAnnouncement}
        onComplete={() => {
          console.log("🎬 Announcement completed, moving to next.");
          setTimeout(() => {
            setCurrentAnnouncement(null);
            setAnnouncementIndex((prevIndex) =>
              prevIndex + 1 < announcements.length ? prevIndex + 1 : 0
            );
          }, 0);
        }}
      />
    );
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
