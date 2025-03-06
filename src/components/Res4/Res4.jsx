import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightBoard from "../Res1/FlightBoard";
import AnnouncementScreen from "../Announcement/AnnouncementScreen";
import axiosInstance from "../../axios/axiosInstance";
import socket from "../../socket-config/socket";
import defaultAdVertical from "../../assets/defaultAd/GO8 Default-Vertical.gif";
import defaultAdHorizontal from "../../assets/defaultAd/GO8 Default-Horizontal.gif";
import defaultVid from "../../assets/defaultAd/GO8 Default-Video.mp4";

function Res4({ screenId, mutedVideo }) {
  const [ads, setAds] = useState([]);
  const [currentSideAd, setCurrentSideAd] = useState(null);
  const [currentBottomAd, setCurrentBottomAd] = useState(null);
  const [currentVideoAd, setCurrentVideoAd] = useState(null);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [isSideAdVisible, setIsSideAdVisible] = useState(false);
  const [isBottomAdVisible, setIsBottomAdVisible] = useState(false);
  const [isVideoAdVisible, setIsVideoAdVisible] = useState(false);
  const [isAdsVisible, setIsAdsVisible] = useState(false); // Controls visibility of all ads
  const [isFlightBoardVisible, setIsFlightBoardVisible] = useState(false);
  const sideTimeoutRef = useRef(null);
  const bottomTimeoutRef = useRef(null);
  const videoTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const [isSideAdValid, setIsSideAdValid] = useState(false);
  const [isBottomAdValid, setIsBottomAdValid] = useState(false);
  const [isVideoAdValid, setIsVideoAdValid] = useState(false);

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
    const videoAd = getCurrentAd("Middle");

    setCurrentSideAd(sideAd);
    setCurrentBottomAd(bottomAd);
    setCurrentVideoAd(videoAd);

    // Set initial validity of ads
    setIsSideAdValid(!!sideAd);
    setIsBottomAdValid(!!bottomAd);
    setIsVideoAdValid(!!videoAd);

    if (!sideAd && !bottomAd && !videoAd) {
      // No valid ads: Cycle default ads (10 seconds visible, 10 seconds hidden)
      setIsAdsVisible(true);
      setIsSideAdVisible(true);
      setIsBottomAdVisible(true);
      setIsVideoAdVisible(true);

      hideTimeoutRef.current = setTimeout(() => {
        setIsSideAdVisible(false);
        setIsBottomAdVisible(false);
        setIsVideoAdVisible(false);
        setIsAdsVisible(false);
        setTimeout(() => {
          startAdCycle(); // Restart the cycle
        }, 10000); // Hide for 10 seconds
      }, 10000); // Show for 10 seconds
    } else {
      // At least one valid ad
      setIsAdsVisible(true);
      setIsSideAdVisible(!!sideAd);
      setIsBottomAdVisible(!!bottomAd);
      setIsVideoAdVisible(!!videoAd);

      const sideDuration = sideAd ? sideAd.duration * 1000 : 0;
      const bottomDuration = bottomAd ? bottomAd.duration * 1000 : 0;
      const videoDuration = videoAd ? videoAd.duration * 1000 : 0;

      const durations = [sideDuration, bottomDuration, videoDuration].filter(d => d > 0);
      const longestDuration = Math.max(...durations);

      // After the shorter durations, mark the shorter ads as invalid
      if (sideAd && sideDuration < longestDuration) {
        setTimeout(() => {
          setIsSideAdValid(false); // Mark side ad as invalid
          setIsSideAdVisible(true); // Show default ad in the side slot
        }, sideDuration);
      }
      if (bottomAd && bottomDuration < longestDuration) {
        setTimeout(() => {
          setIsBottomAdValid(false); // Mark bottom ad as invalid
          setIsBottomAdVisible(true); // Show default ad in the bottom slot
        }, bottomDuration);
      }
      if (videoAd && videoDuration < longestDuration) {
        setTimeout(() => {
          setIsVideoAdValid(false); // Mark video ad as invalid
          setIsVideoAdVisible(true); // Show default ad in the video slot
        }, videoDuration);
      }

      // After the longest duration, hide all ads and show the flightboard
      hideTimeoutRef.current = setTimeout(() => {
        setIsAdsVisible(false);
        setIsSideAdVisible(false);
        setIsBottomAdVisible(false);
        setIsVideoAdVisible(false);
        setIsFlightBoardVisible(true);

        // After the flightboard duration (same as longest duration), reappear all ads
        setTimeout(() => {
          setIsFlightBoardVisible(false);
          startAdCycle(); // Restart the cycle
        }, longestDuration);
      }, longestDuration);
    }
  };

  useEffect(() => {
    startAdCycle();

    return () => {
      if (sideTimeoutRef.current) clearTimeout(sideTimeoutRef.current);
      if (bottomTimeoutRef.current) clearTimeout(bottomTimeoutRef.current);
      if (videoTimeoutRef.current) clearTimeout(videoTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [ads]);

  if (currentAnnouncement?.announcementType === "Screen Takeover") {
    return <AnnouncementScreen announcement={currentAnnouncement} onComplete={() => setCurrentAnnouncement(null)} />;
  }

  const now = new Date();
  const isValidSideAd = currentSideAd && new Date(currentSideAd.startDate) <= now && new Date(currentSideAd.endDate) >= now;
  const isValidBottomAd = currentBottomAd && new Date(currentBottomAd.startDate) <= now && new Date(currentBottomAd.endDate) >= now;
  const isValidVideoAd = currentVideoAd && new Date(currentVideoAd.startDate) <= now && new Date(currentVideoAd.endDate) >= now;

  return (
    <div className="w-screen h-screen flex flex-row overflow-hidden relative">
      {/* Main Content */}
      <div className={`flex flex-col ${isAdsVisible ? "w-3/4" : "w-full"} h-full`}>
        {/* Video Placement */}
        <div className={`flex-1 flex-col ${isAdsVisible ? "h-3/4" : "h-full"} w-full`}>
          {isVideoAdVisible && isValidVideoAd && !isFlightBoardVisible && (
            <video className="w-full h-full" autoPlay loop muted={mutedVideo}>
              <source src={currentVideoAd.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {isFlightBoardVisible && <FlightBoard />}
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

export default Res4;
