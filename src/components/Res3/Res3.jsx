import React, { useState, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import FlightBoard from "../Res1/FlightBoard";
import AnnouncementScreen from "../Announcement/AnnouncementScreen";
import axios from "axios";
import socket from "@/socket-config/socket";
import defaultAdVertical from "../../assets/defaultAd/GO8 Default-Vertical.gif"; 
import defaultAdHorizontal from "../../assets/defaultAd/GO8 Default-Horizontal.gif";

function Res3({ screenId }) {
  const [ads, setAds] = useState([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [adsVisible, setAdsVisible] = useState(true);
  const [showDefaultVertical, setShowDefaultVertical] = useState(false);
  const [showDefaultHorizontal, setShowDefaultHorizontal] = useState(false);
  const [cycleCounter, setCycleCounter] = useState(0);

  useEffect(() => {
    socket.on(`announcementToScreen-${screenId}`, (newAnnouncement) => {
      setCurrentAnnouncement(newAnnouncement); 
    });

    return () => socket.off(`announcementToScreen-${screenId}`);
  }, [screenId]);

  useEffect(() => {
    if (currentAnnouncement) {
      const timer = setTimeout(async () => {
        try {
          await axios.patch(`http://localhost:3000/announcements/${currentAnnouncement.id}/deactivate`);
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
        const response = await axios.get(`http://localhost:3000/screens/${screenId}`);
        setAds(response.data.ads || []);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };
    fetchAds();
  }, [screenId]);

  useEffect(() => {
    if (ads.length < 2) return;

    let verticalTimer, horizontalTimer, slideOutTimer, resetTimer;

    setAdsVisible(true);
    setShowDefaultVertical(false);
    setShowDefaultHorizontal(false);

    verticalTimer = setTimeout(() => {
      setShowDefaultVertical(true);
    }, 5000);

    horizontalTimer = setTimeout(() => {
      setShowDefaultHorizontal(true);
    }, 10000);

    slideOutTimer = setTimeout(() => {
      setAdsVisible(false); // Slide out ads
    }, 15000);

    resetTimer = setTimeout(() => {
      setCycleCounter((prev) => prev + 1); // Force re-run of effect
    }, 25000); // Wait 10s before showing ads again

    return () => {
      clearTimeout(verticalTimer);
      clearTimeout(horizontalTimer);
      clearTimeout(slideOutTimer);
      clearTimeout(resetTimer);
    };
  }, [ads, cycleCounter]); // cycleCounter ensures this always resets properly

  if (currentAnnouncement) {
    return <AnnouncementScreen announcement={currentAnnouncement} />;
  }

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Ad Section */}
        <AnimatePresence>
          {adsVisible && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5 }}
              className="w-1/4 bg-black flex items-center justify-center"
            >
              {!showDefaultVertical ? (
                <img className="w-full h-full object-cover" src={ads[0]?.mediaUrl} alt="Vertical Ad" />
              ) : (
                <img className="w-full h-full object-cover" src={defaultAdVertical} alt="Default Vertical Ad" />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flight Board */}
        <div className="flex-1">
          <FlightBoard />
        </div>
      </div>

      {/* Bottom Ad Section */}
      <AnimatePresence>
        {adsVisible && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5 }}
            className="w-full h-1/4 bg-black flex items-center justify-center"
          >
            {!showDefaultHorizontal ? (
              <img className="w-full h-full object-cover" src={ads[1]?.mediaUrl} alt="Horizontal Ad" />
            ) : (
              <img className="w-full h-full object-cover" src={defaultAdHorizontal} alt="Default Horizontal Ad" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Res3;
