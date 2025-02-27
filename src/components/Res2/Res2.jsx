import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightBoard from "../Res1/FlightBoard";
import AnnouncementScreen from "../Announcement/AnnouncementScreen";
import axiosInstance from "../../axios/axiosInstance";
import socket from "../../socket-config/socket";
import defaultAdSquare from "../../assets/defaultAd/GO8 Default-Square.gif";
import defaultAdVertical from "../../assets/defaultAd/GO8 Default-Vertical.gif";

function Res2({ screenId }) {
  const [ads, setAds] = useState([]);
  const [currentUpperAd, setCurrentUpperAd] = useState(null);
  const [currentLowerAd, setCurrentLowerAd] = useState(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [isUpperAdVisible, setIsUpperAdVisible] = useState(false);
  const [isLowerAdVisible, setIsLowerAdVisible] = useState(false);
  const [isAdsVisible, setIsAdsVisible] = useState(false); // Controls visibility of both ads
  const upperTimeoutRef = useRef(null);
  const lowerTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const [isUpperAdValid, setIsUpperAdValid] = useState(false);
  const [isLowerAdValid, setIsLowerAdValid] = useState(false);

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

  const getCurrentAd = (slot) => {
    const now = new Date();
    const validAds = ads.filter(ad => {
      const startDate = new Date(ad.startDate);
      const endDate = new Date(ad.endDate);
      return now >= startDate && now <= endDate && ad.slot === slot;
    });
    return validAds.length > 0 ? validAds[0] : null;
  };

  const startAdCycle = () => {
    const upperAd = getCurrentAd("Upper");
    const lowerAd = getCurrentAd("Lower");

    setCurrentUpperAd(upperAd);
    setCurrentLowerAd(lowerAd);

    // Set initial validity of ads
    setIsUpperAdValid(!!upperAd);
    setIsLowerAdValid(!!lowerAd);

    if (!upperAd && !lowerAd) {
      // No valid ads: Cycle default ad (10 seconds visible, 10 seconds hidden)
      setIsAdsVisible(true);
      setIsUpperAdVisible(true);
      setIsLowerAdVisible(true);

      hideTimeoutRef.current = setTimeout(() => {
        setIsUpperAdVisible(false);
        setIsLowerAdVisible(false);
        setIsAdsVisible(false);
        setTimeout(() => {
          startAdCycle(); // Restart the cycle
        }, 10000); // Hide for 10 seconds
      }, 10000); // Show for 10 seconds
    } else if (upperAd || lowerAd) {
      // At least one valid ad
      setIsAdsVisible(true);
      setIsUpperAdVisible(!!upperAd);
      setIsLowerAdVisible(!!lowerAd);

      const upperDuration = upperAd ? upperAd.duration * 1000 : 0;
      const lowerDuration = lowerAd ? lowerAd.duration * 1000 : 0;

      if (upperAd && lowerAd) {
        // Both slots have valid ads
        const shorterDuration = Math.min(upperDuration, lowerDuration);
        const longerDuration = Math.max(upperDuration, lowerDuration);

        // After the shorter duration, mark the shorter ad as invalid
        setTimeout(() => {
          if (upperDuration === shorterDuration) {
            setIsUpperAdValid(false); // Mark upper ad as invalid
            setIsUpperAdVisible(true); // Hide upper ad
          } else {
            setIsLowerAdValid(false); // Mark lower ad as invalid
            setIsLowerAdVisible(true); // Hide lower ad
          }
        }, shorterDuration);

        // After the longer duration, hide both ads and restart the cycle
        hideTimeoutRef.current = setTimeout(() => {
          setIsAdsVisible(false);
          setIsUpperAdVisible(false);
          setIsLowerAdVisible(false);
          setTimeout(() => {
            startAdCycle(); // Restart the cycle
          }, shorterDuration); // Hide for the duration of the shorter ad
        }, longerDuration);
      } else {
        // Only one valid ad
        const validAdDuration = upperAd ? upperDuration : lowerDuration;

        // Show the default ad in the empty slot
        if (!upperAd) {
          setIsUpperAdVisible(true); // Show default ad in the upper slot
        }
        if (!lowerAd) {
          setIsLowerAdVisible(true); // Show default ad in the lower slot
        }

        // After the valid ad's duration, hide both ads and restart the cycle
        hideTimeoutRef.current = setTimeout(() => {
          setIsAdsVisible(false);
          setIsUpperAdVisible(false);
          setIsLowerAdVisible(false);
          setTimeout(() => {
            startAdCycle(); // Restart the cycle
          }, 10000); // Hide for 10 seconds
        }, validAdDuration);
      }
    }
  };

  useEffect(() => {
    startAdCycle();

    return () => {
      if (upperTimeoutRef.current) clearTimeout(upperTimeoutRef.current);
      if (lowerTimeoutRef.current) clearTimeout(lowerTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [ads]);

  if (currentAnnouncement?.announcementType === "Screen Takeover") {
    return <AnnouncementScreen announcement={currentAnnouncement} onComplete={() => setCurrentAnnouncement(null)} />;
  }

  const now = new Date();
  const isValidUpperAd = currentUpperAd && new Date(currentUpperAd.startDate) <= now && new Date(currentUpperAd.endDate) >= now;
  const isValidLowerAd = currentLowerAd && new Date(currentLowerAd.startDate) <= now && new Date(currentLowerAd.endDate) >= now;

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden relative">
      <div className="flex flex-row w-full h-full transition-all duration-500">
        <div className={`transition-all duration-500 ${isAdsVisible ? "w-3/4" : "w-full"} h-full`}>
          <FlightBoard />
        </div>
        <AnimatePresence>
        {isAdsVisible && (
            <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="ads w-1/4 bg-black text-white flex flex-col items-center justify-center space-y-2 p-2"
            >
            {/* Upper Ad */}
            {isUpperAdVisible && (
                <div className="w-full h-1/2 flex items-center justify-center">
                <img
                    className="w-full h-full object-cover rounded-md"
                    src={isUpperAdValid ? currentUpperAd.mediaUrl : defaultAdVertical}
                    alt={isUpperAdValid ? "Upper Ad" : "Default Vertical Ad"}
                    onError={(e) => {
                    console.error("Error loading upper ad media:", e);
                    e.target.src = defaultAdVertical; // Fallback to default ad if there's an error
                    }}
                />
                </div>
            )}

            {/* Lower Ad */}
            {isLowerAdVisible && (
                <div className="w-full h-1/2 flex items-center justify-center">
                <img
                    className="w-full h-full object-cover rounded-md"
                    src={isLowerAdValid ? currentLowerAd.mediaUrl : defaultAdSquare}
                    alt={isLowerAdValid ? "Lower Ad" : "Default Square Ad"}
                    onError={(e) => {
                    console.error("Error loading lower ad media:", e);
                    e.target.src = defaultAdSquare; // Fallback to default ad if there's an error
                    }}
                />
                </div>
            )}
            </motion.div>
        )}
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

export default Res2;
