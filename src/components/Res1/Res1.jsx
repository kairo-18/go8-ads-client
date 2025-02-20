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
          await axiosInstance.patch(`/api/announcements/${currentAnnouncement.id}/deactivate`);
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
        const response = await axiosInstance.get(`/api/screens/${screenId}`);
        setAds(response.data.ads || []);
        toggleAds(response.data.ads && response.data.ads.length > 0);
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

      setIsAdVisible(true);
      setIsVerticalAdVisible(false);
      setIsAdSlidingOut(false);

      const handleAdTransition = () => {
        setTimeout(() => {
          setIsAdVisible(false);
          setIsVerticalAdVisible(true);

          setTimeout(() => {
            setIsVerticalAdVisible(false);
            setIsAdSlidingOut(true);

            setTimeout(() => {
              setIsAdVisible(true);

              setTimeout(() => {
                setIsAdSlidingOut(false);
                setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
                handleAdTransition();
              }, 1000);
            }, 10000);
          }, 5000);
        }, duration * 1000);
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
          {isAds && ads.length > 0 && (
            isVerticalAdVisible && !isAdSlidingOut ? (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="ads w-1/4 bg-black text-white flex items-center justify-center"
              >
                <img src={defaultAdVertical} alt="Vertical Placeholder Ad" />
              </motion.div>
            ) : (
              isAdVisible && (
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
              )
            )
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
