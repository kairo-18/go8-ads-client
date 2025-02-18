import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightBoard from "./FlightBoard";
import AnnouncementScreen from "../Announcement/AnnouncementScreen";
import axiosInstance from "../../axios/axiosInstance";
import socket from "@/socket-config/socket";
import defaultAdVertical from "../../assets/defaultAd/GO8 Default-Vertical.gif";

function Res1({ screenId }) {
  const [isAds, toggleAds] = useState(false);
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [isAdSlidingOut, setIsAdSlidingOut] = useState(false);
  const [isVerticalAdVisible, setIsVerticalAdVisible] = useState(false);
  const [isAdVisible, setIsAdVisible] = useState(true);

  useEffect(() => {
    socket.on(`announcementToScreen-${screenId}`, (newAnnouncement) => {
      setCurrentAnnouncement(newAnnouncement);
    });
    return () => {
      socket.off(`announcementToScreen-${screenId}`);
    };
  }, [screenId]);

  useEffect(() => {
    if (currentAnnouncement) {
      const timer = setTimeout(async () => {
        try {
          await axiosInstance.patch(`http://localhost:3000/announcements/${currentAnnouncement.id}/deactivate`);
        } catch (error) {
          console.error("Error deactivating announcement:", error);
        }
        setCurrentAnnouncement(null);
      }, currentAnnouncement.duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [currentAnnouncement]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axiosInstance.get(`http://localhost:3000/screens/${screenId}`);
        setAds(response.data.ads || []);
        toggleAds(true);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };
    fetchAds();
    const intervalId = setInterval(fetchAds, 60000);
    return () => clearInterval(intervalId);
  }, [screenId]);

  useEffect(() => {
    if (ads.length > 0) {
      const ad = ads[currentAdIndex];
      const duration = ad?.duration || 5;

      // Resetting flags for smooth transitions
      setIsAdVisible(true);
      setIsVerticalAdVisible(false);
      setIsAdSlidingOut(false);

      const handleAdTransition = () => {
        // Show the vertical ad after the current ad's duration
        setTimeout(() => {
          setIsAdVisible(false);
          setIsVerticalAdVisible(true);

          // Slide out the vertical ad and move to the next ad after 5 seconds
          setTimeout(() => {
            setIsVerticalAdVisible(false);
            setIsAdSlidingOut(true);

            // Wait for 10 seconds after the vertical ad slides out
            setTimeout(() => {
              setIsAdVisible(true); // Show the main ad again

              // After the main ad stays visible for its duration, slide it out and move to the next ad
              setTimeout(() => {
                setIsAdSlidingOut(false); // Reset sliding state
                setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length); // Move to next ad
                handleAdTransition(); // Repeat the ad cycle
              }, 1000); // Main ad stays visible for 1 second before transitioning
            }, 10000); // Wait 10 seconds before sliding the main ad back in
          }, 5000); // Vertical ad stays for 5 seconds
        }, duration * 1000); // Show the main ad for its duration
      };

      handleAdTransition();
    }
  }, [ads, currentAdIndex]);

  if (currentAnnouncement) {
    return <AnnouncementScreen announcement={currentAnnouncement} onComplete={() => setCurrentAnnouncement(null)} />;
  }

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden relative">
      <div className="flex flex-row w-full h-full transition-all duration-500">
        <div className={`transition-all duration-500 ${isAds && !isAdSlidingOut && isAdVisible ? "w-3/4" : "w-full"} h-full`}>
          <FlightBoard />
        </div>
        <AnimatePresence>
          {isVerticalAdVisible && !isAdSlidingOut && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="ads w-1/4 bg-black text-white flex items-center justify-center"
            >
              <img src={defaultAdVertical} alt="Vertical Placeholder Ad" />
            </motion.div>
          )}
          {isAds && !isAdSlidingOut && isAdVisible && ads.length > 0 && (
            <motion.div
              key={ads[currentAdIndex]?.id || currentAdIndex}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="ads w-1/4 bg-black text-white flex items-center justify-center"
            >
              <img className="w-full h-full object-cover" src={ads[currentAdIndex].mediaUrl} alt="Ad" />
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
