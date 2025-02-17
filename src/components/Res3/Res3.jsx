import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";  // Make sure AnimatePresence is imported
import FlightBoard from "../Res1/FlightBoard";
import AnnouncementScreen from "../Announcement/AnnouncementScreen";
import axios from "axios";
import io from "socket.io-client";

// Assuming your server is running at localhost:3000
const socket = io("http://localhost:3000"); // Connect to your WebSocket server

function Res3({ screenId }) {
  const [isAds, toggleAds] = useState(false);
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [announcements, setAnnouncements] = useState([]); // Store all received announcements
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null); // The latest announcement to show

  // Fetching announcements and listening for new ones via WebSocket
  useEffect(() => {
    // Listen for announcements specific to this screen
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
          await axios.patch(`http://localhost:3000/announcements/${currentAnnouncement.id}/deactivate`);
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
        const response = await axios.get(`http://localhost:3000/screens/${screenId}`);
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
    return <AnnouncementScreen announcement={currentAnnouncement} />;
  }

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Ad Section */}
        <AnimatePresence>
          {isAds && ads[currentAdIndex] && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5 }}
              className="w-1/4 bg-black flex items-center justify-center"
            >
              {ads[currentAdIndex].mediaUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                <img className="w-full h-full object-cover" src={ads[currentAdIndex].mediaUrl} alt="Ad" />
              ) : ads[currentAdIndex].mediaUrl.match(/\.(mp4|webm|ogg)$/) ? (
                <video className="w-full h-full object-cover" src={ads[currentAdIndex].mediaUrl} autoPlay loop muted />
              ) : (
                <p className="text-white">No valid ads available</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flight Detail Board */}
        <div className="flex-1">
          <FlightBoard />
        </div>
      </div>

      {/* Bottom Ad Section */}
      <AnimatePresence>
        {isAds && ads[currentAdIndex + 1] && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5 }}
            className="w-full h-1/4 bg-black flex items-center justify-center"
          >
            {ads[currentAdIndex + 1].mediaUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
              <img className="w-full h-full object-cover" src={ads[currentAdIndex + 1].mediaUrl} alt="Ad" />
            ) : ads[currentAdIndex + 1].mediaUrl.match(/\.(mp4|webm|ogg)$/) ? (
              <video className="w-full h-full object-cover" src={ads[currentAdIndex + 1].mediaUrl} autoPlay loop muted />
            ) : (
              <p className="text-white">No valid ads available</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Res3;
