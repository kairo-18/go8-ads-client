import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightBoard from "../Res1/FlightBoard";
import AnnouncementScreen from "../Announcement/AnnouncementScreen";
import axiosInstance from "../../axios/axiosInstance";
import socket from "../../socket-config/socket";
import defaultAdVertical from "../../assets/defaultAd/GO8 Default-Vertical.gif";
import defaultAdHorizontal from "../../assets/defaultAd/GO8 Default-Horizontal.gif";

function Res3({ screenId }) {
  const [ads, setAds] = useState([]);
  const [currentSideAd, setCurrentSideAd] = useState(null);
  const [currentBottomAd, setCurrentBottomAd] = useState(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [isSideAdVisible, setIsSideAdVisible] = useState(false);
  const [isBottomAdVisible, setIsBottomAdVisible] = useState(false);
  const [isAdsVisible, setIsAdsVisible] = useState(false); // Controls visibility of both ads
  const sideTimeoutRef = useRef(null);
  const bottomTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const [isSideAdValid, setIsSideAdValid] = useState(false);
  const [isBottomAdValid, setIsBottomAdValid] = useState(false);

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
    const sideAd = getCurrentAd("Side");
    const bottomAd = getCurrentAd("Bottom");

    setCurrentSideAd(sideAd);
    setCurrentBottomAd(bottomAd);

    // Set initial validity of ads
    setIsSideAdValid(!!sideAd);
    setIsBottomAdValid(!!bottomAd);

    if (!sideAd && !bottomAd) {
      // No valid ads: Cycle default ad (10 seconds visible, 10 seconds hidden)
      setIsAdsVisible(true);
      setIsSideAdVisible(true);
      setIsBottomAdVisible(true);

      hideTimeoutRef.current = setTimeout(() => {
        setIsSideAdVisible(false);
        setIsBottomAdVisible(false);
        setIsAdsVisible(false);
        setTimeout(() => {
          startAdCycle(); // Restart the cycle
        }, 10000); // Hide for 10 seconds
      }, 10000); // Show for 10 seconds
    } else if (sideAd || bottomAd) {
      // At least one valid ad
      setIsAdsVisible(true);
      setIsSideAdVisible(!!sideAd);
      setIsBottomAdVisible(!!bottomAd);

      const sideDuration = sideAd ? sideAd.duration * 1000 : 0;
      const bottomDuration = bottomAd ? bottomAd.duration * 1000 : 0;

      if (sideAd && bottomAd) {
        // Both slots have valid ads
        const shorterDuration = Math.min(sideDuration, bottomDuration);
        const longerDuration = Math.max(sideDuration, bottomDuration);

        // After the shorter duration, mark the shorter ad as invalid
        setTimeout(() => {
          if (sideDuration === shorterDuration) {
            setIsSideAdValid(false); // Mark side ad as invalid
            setIsSideAdVisible(true); // Show default ad in the side slot
          } else {
            setIsBottomAdValid(false); // Mark bottom ad as invalid
            setIsBottomAdVisible(true); // Show default ad in the bottom slot
          }
        }, shorterDuration);

        // After the longer duration, hide both ads and restart the cycle
        hideTimeoutRef.current = setTimeout(() => {
          setIsAdsVisible(false);
          setIsSideAdVisible(false);
          setIsBottomAdVisible(false);
          setTimeout(() => {
            startAdCycle(); // Restart the cycle
          }, shorterDuration); // Hide for the duration of the shorter ad
        }, longerDuration);
      } else {
        // Only one valid ad
        const validAdDuration = sideAd ? sideDuration : bottomDuration;

        // Show the default ad in the empty slot
        if (!sideAd) {
          setIsSideAdVisible(true); // Show default ad in the side slot
        }
        if (!bottomAd) {
          setIsBottomAdVisible(true); // Show default ad in the bottom slot
        }

        // After the valid ad's duration, hide both ads and restart the cycle
        hideTimeoutRef.current = setTimeout(() => {
          setIsAdsVisible(false);
          setIsSideAdVisible(false);
          setIsBottomAdVisible(false);
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
      if (sideTimeoutRef.current) clearTimeout(sideTimeoutRef.current);
      if (bottomTimeoutRef.current) clearTimeout(bottomTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [ads]);

  if (currentAnnouncement?.announcementType === "Screen Takeover") {
    return <AnnouncementScreen announcement={currentAnnouncement} onComplete={() => setCurrentAnnouncement(null)} />;
  }

  const now = new Date();
  const isValidSideAd = currentSideAd && new Date(currentSideAd.startDate) <= now && new Date(currentSideAd.endDate) >= now;
  const isValidBottomAd = currentBottomAd && new Date(currentBottomAd.startDate) <= now && new Date(currentBottomAd.endDate) >= now;

  return (
    <div className="w-screen h-screen flex flex-row overflow-hidden relative">
      {/* Flight Board and Bottom Ad in a flex-col div */}
      <div className={`flex flex-col ${isAdsVisible ? "w-3/4" : "w-full"} h-full`}>
        {/* Flight Board */}
        <div className={`flex-1 flex-col ${isAdsVisible ? "h-3/4" : "h-full"} w-full`}>
          <FlightBoard />
        </div>

        {/* Bottom Ad */}
        <AnimatePresence>
          {isAdsVisible && isBottomAdVisible && (
            <motion.div
              key="bottom-ad"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-1/4 bg-black flex items-center justify-center"
            >
              <img
                className="w-full h-full object-cover"
                src={isBottomAdValid ? currentBottomAd.mediaUrl : defaultAdHorizontal}
                alt={isBottomAdValid ? "Bottom Ad" : "Default Horizontal Ad"}
                onError={(e) => {
                  console.error("Error loading bottom ad media:", e);
                  e.target.src = defaultAdHorizontal; // Fallback to default ad if there's an error
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side Ad */}
      <AnimatePresence>
        {isAdsVisible && isSideAdVisible && (
          <motion.div
            key="side-ad"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-1/4 h-full bg-black flex items-center justify-center"
          >
            <img
              className="w-full h-full object-cover"
              src={isSideAdValid ? currentSideAd.mediaUrl : defaultAdVertical}
              alt={isSideAdValid ? "Side Ad" : "Default Vertical Ad"}
              onError={(e) => {
                console.error("Error loading side ad media:", e);
                e.target.src = defaultAdVertical; // Fallback to default ad if there's an error
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {currentAnnouncement?.announcementType === "Marquee" && (
        <div className="absolute bottom-0 w-full">
          <AnnouncementScreen announcement={currentAnnouncement} onComplete={() => setCurrentAnnouncement(null)} />
        </div>
      )}
    </div>
  );
}

export default Res3;
