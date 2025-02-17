import React, { useState, useEffect, useRef } from "react";
import FlightBoard from "../Res1/FlightBoard";
import AnnouncementScreen from "../Announcement/AnnouncementScreen";
import socket from "../../socket-config/socket"; // Import socket instance from socket.js
import axiosInstance from "../../axios/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

function Res2({ screenId }) {
  const [isAds, toggleAds] = useState(false);
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [announcement, setAnnouncement] = useState(null);

  // Fetch announcements and listen for new ones via WebSocket
  useEffect(() => {
    socket.on(`announcementToScreen-${screenId}`, (newAnnouncement) => {
      console.log("New announcement received for screen:", newAnnouncement);
      setAnnouncement(newAnnouncement); // Always set the latest announcement
    });

    return () => {
      socket.off(`announcementToScreen-${screenId}`);
    };
  }, [screenId]);

  // Fetch ads for the current screenId
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
        }, 5000);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [ads]);

  // If there is an announcement, display it
  if (announcement) {
    return <AnnouncementScreen announcement={announcement} onComplete={() => setAnnouncement(null)} />;
  }

  return (
    <div className="w-screen h-screen flex overflow-hidden">
      <div className={isAds ? "w-3/4 transition-all duration-500" : "w-full transition-all duration-500"}>
        <FlightBoard />
      </div>

      <AnimatePresence>
        {isAds && ads.length > 0 && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="ads w-1/4 bg-black text-white flex flex-col items-center justify-center space-y-2 p-2"
          >
            {ads.slice(currentAdIndex, currentAdIndex + 2).map((ad) => (
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
