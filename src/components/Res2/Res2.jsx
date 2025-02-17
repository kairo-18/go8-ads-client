import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightBoard from "../Res1/FlightBoard";
import AnnouncementScreen from "../Announcement/AnnouncementScreen";
import axios from "axios";
import io from "socket.io-client";

// Assuming your server is running at localhost:3000
const socket = io("http://localhost:3000"); // Connect to your WebSocket server

function Res2({ screenId }) {
  const [isAds, toggleAds] = useState(false);
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  // Join the screen when the component mounts
  useEffect(() => {
    // Emit the joinScreen event with the screenId
    if (screenId) {
      socket.emit('joinScreen', screenId);
      console.log(`Joined screen with ID: ${screenId}`);
    }

    // Clean up when the component unmounts
    return () => {
      socket.emit('leaveScreen', screenId);
      console.log(`Left screen with ID: ${screenId}`);
    };
  }, [screenId]);

  // Fetching announcements and listening for new ones via WebSocket
  useEffect(() => {
    // Listen for announcements specific to this screen
    socket.on(`announcementToScreen-${screenId}`, (newAnnouncement) => {
      console.log("New announcement received for screen:", newAnnouncement);
      setAnnouncements((prev) => [...prev, newAnnouncement]); // Add new announcement to the list
    });

    // Clean up WebSocket listener when the component unmounts
    return () => {
      socket.off(`announcementToScreen-${screenId}`);
    };
  }, [screenId]); // Ensure the socket listens to the correct screenId

  // Deactivate the current announcement after its duration
  useEffect(() => {
    if (announcements.length > 0 && !currentAnnouncement) {
      const nextAnnouncement = announcements[announcementIndex];

      if (nextAnnouncement) {
        setCurrentAnnouncement(nextAnnouncement);

        setTimeout(async () => {
          try {
            // Deactivate after the specified duration
            await axios.patch(`http://localhost:3000/announcements/${nextAnnouncement.id}/deactivate`);
            console.log(`✅ Announcement ${nextAnnouncement.id} set to inactive`);
          } catch (error) {
            console.error("Error deactivating announcement:", error);
          }

          setAnnouncementIndex((prevIndex) =>
            prevIndex + 1 < announcements.length ? prevIndex + 1 : 0
          );
          setCurrentAnnouncement(null);
        }, nextAnnouncement.duration * 1000); // Duration in seconds (converted to ms)
      }
    }
  }, [announcementIndex, announcements]);

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
        }, 5000);
      }, 10000); // Change ad every 10 seconds
      return () => clearInterval(interval);
    }
  }, [ads]);

  // If there is a current announcement, display it
  if (currentAnnouncement) {
    return <AnnouncementScreen announcement={currentAnnouncement} />;
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
