import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightBoard from "./FlightBoard";
import AnnouncementScreen from "../Announcement/AnnouncementScreen";
import axiosInstance from "../../axios/axiosInstance";
import socket from "@/socket-config/socket";
import defaultAdVertical from "../../assets/defaultAd/GO8 Default-Vertical.gif";

function Res1({ screenId }) {
  const [ads, setAds] = useState([]);
  const [currentAd, setCurrentAd] = useState(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [isAdVisible, setIsAdVisible] = useState(false);
  const timeoutRef = useRef(null);

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
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };
    fetchAds();
    const intervalId = setInterval(fetchAds, 60000);
    return () => clearInterval(intervalId);
  }, [screenId]);

  const getCurrentAd = () => {
    const now = new Date();
    const validAds = ads.filter(ad => {
      const startDate = new Date(ad.startDate);
      const endDate = new Date(ad.endDate);
      return now >= startDate && now <= endDate;
    });
    return validAds.length > 0 ? validAds[0] : null;
  };

  const checkAndUpdateAd = () => {
    const ad = getCurrentAd();
    setCurrentAd(ad);

    if (ad) {
      const duration = ad.duration || 5;

      setIsAdVisible(true);

      timeoutRef.current = setTimeout(() => {
        setIsAdVisible(false);

        timeoutRef.current = setTimeout(() => {
          checkAndUpdateAd(); // Re-check for the next ad
        }, duration * 1000);
      }, duration * 1000);
    } else {
      // No valid ad, show default ad for 20 seconds and hide for 10 seconds
      setIsAdVisible(true);

      timeoutRef.current = setTimeout(() => {
        setIsAdVisible(false);

        timeoutRef.current = setTimeout(() => {
          checkAndUpdateAd(); // Re-check for the next ad
        }, 10000); // Hide for 10 seconds
      }, 20000); // Show for 20 seconds
    }
  };

  useEffect(() => {
    checkAndUpdateAd();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [ads]);

  if (currentAnnouncement?.announcementType === "Screen Takeover") {
    return <AnnouncementScreen announcement={currentAnnouncement} onComplete={() => setCurrentAnnouncement(null)} />;
  }

  const now = new Date();
  const isValidAd = currentAd && new Date(currentAd.startDate) <= now && new Date(currentAd.endDate) >= now;

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden relative">
      <div className="flex flex-row w-full h-full transition-all duration-500">
        <div className={`transition-all duration-500 ${isAdVisible ? "w-3/4" : "w-full"} h-full`}>
          <FlightBoard />
        </div>
        <AnimatePresence>
          {isAdVisible && (isValidAd ? (
            <motion.div
              key={currentAd.id}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="ads w-1/4 bg-black text-white flex items-center justify-center"
            >
              <img
                className="w-full h-full object-cover"
                src={`${currentAd.mediaUrl}`}
                alt="Ad"
                onError={(e) => {
                  console.error("Error loading ad media:", e);
                  e.target.src = defaultAdVertical; // Fallback to default ad if there's an error
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="defaultAd"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="ads w-1/4 bg-black text-white flex items-center justify-center"
            >
              <img src={defaultAdVertical} alt="Default Vertical Ad" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {currentAnnouncement?.announcementType === "Marquee" && (
        <div className="absolute bottom-0 w-full">
          <AnnouncementScreen announcement={currentAnnouncement} onComplete={() => setCurrentAnnouncement(null)} />
        </div>
      )}
    </div>
  );
}

export default Res1;
