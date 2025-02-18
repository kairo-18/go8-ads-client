import React, { useState, useEffect, useRef } from "react"; 
import FlightBoard from "../Res1/FlightBoard";
import AnnouncementScreen from "../Announcement/AnnouncementScreen";
import socket from "../../socket-config/socket"; 
import axiosInstance from "../../axios/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import defaultAdSquare from "../../assets/defaultAd/GO8 Default-Square.gif";
import defaultAdVertical from "../../assets/defaultAd/GO8 Default-Vertical.gif";

function Res2({ screenId }) {
  const [isAds, toggleAds] = useState(false);
  const [ads, setAds] = useState([]);
  const [announcement, setAnnouncement] = useState(null);

  const [adIndices, setAdIndices] = useState([0, 1, 2]); // Indices for 3 ads
  const [adExpired, setAdExpired] = useState([false, false, false]); // Track which ads are expired
  const [isBothAdsExpired, setBothAdsExpired] = useState(false); // Track both ads expired
  const [isAdSlidingOut, setAdSlidingOut] = useState(false); // Track when ad is sliding out

  const adTimersRef = useRef([null, null, null]);

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
        console.log("Fetched ads:", response.data.ads);
        setAds(response.data.ads || []);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
  }, [screenId]);

  // Set timers for ad expiration based on duration
  useEffect(() => {
    if (ads.length > 0) {
      // Start playing ads
      toggleAds(true);
      
      adIndices.forEach((index, i) => {
        if (adTimersRef.current[i]) clearTimeout(adTimersRef.current[i]);
        const adDuration = ads[index]?.duration || 10; // Default to 10 seconds
        adTimersRef.current[i] = setTimeout(() => {
          console.log(`${i + 1} Ad Expired`);
          setAdExpired(prev => {
            const updated = [...prev];
            updated[i] = true;
            return updated;
          });
        }, adDuration * 1000);
      });
    }

    return () => {
      adIndices.forEach((_, i) => clearTimeout(adTimersRef.current[i]));
    };
  }, [ads, adIndices]);

  // Handle the case when both ads expire
  useEffect(() => {
    if (adExpired[0] && adExpired[1]) {
      // Both top and bottom ads are expired, trigger a 10-second wait before showing new ads
      setBothAdsExpired(true);
      setAdSlidingOut(true); // Trigger the slide-out animation
      setTimeout(() => {
        // Wait 10 seconds before showing new ads
        setBothAdsExpired(false);
        setAdExpired([false, false, false]); // Reset expiration states
        setAdIndices((prevIndices) => {
          // Replace expired ads with the next one in line
          const nextIndices = prevIndices.map((index) => (index + 1) % ads.length);
          return nextIndices;
        });
        setAdSlidingOut(false); // Reset sliding out state after the slide-out animation completes
        toggleAds(true); // Re-enable ads display
      }, 10000);  // 10-second interval for waiting before showing new ads
    }
  }, [adExpired, ads.length]);

  // Determine placeholder ad to display
  const placeholderAd = (adExpired[0] && adExpired[1] && !isAdSlidingOut) ? (
    <img src={defaultAdVertical} alt="Vertical Placeholder Ad" />
  ) : (
    <img src={defaultAdSquare} alt="Square Placeholder Ad" />
  );

  // If there is an announcement, display it
  if (announcement) {
    return <AnnouncementScreen announcement={announcement} onComplete={() => setAnnouncement(null)} />;
  }

  return (
    <div className="w-screen h-screen flex overflow-hidden">
      {/* FlightBoard width toggles between fullscreen and ads-width */}
      <div className={isAds && !isAdSlidingOut ? "w-3/4 transition-all duration-500" : "w-full transition-all duration-500"}>
        <FlightBoard />
      </div>

      <AnimatePresence>
        {isAds && ads.length > 0 && !isBothAdsExpired && !isAdSlidingOut && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="ads w-1/4 bg-black text-white flex flex-col items-center justify-center space-y-2 p-2"
            onAnimationComplete={() => {
              if (isAdSlidingOut) {
                // Reset FlightBoard width after the ad slides out
                toggleAds(false);  // This triggers the slide-out, hiding the ads
                setAdSlidingOut(false);  // Reset sliding out state
              }
            }}
          >
            {/* Top Ad */}
            <div className="w-full h-1/2 flex items-center justify-center">
              {adExpired[0] ? (
                placeholderAd // Show placeholder if expired
              ) : (
                ads[adIndices[0]]?.mediaUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                  <img className="w-full h-full object-cover rounded-md" src={ads[adIndices[0]].mediaUrl} alt="Ad" />
                ) : ads[adIndices[0]]?.mediaUrl.match(/\.(mp4|webm|ogg)$/) ? (
                  <video
                    className="w-full h-full object-cover rounded-md"
                    src={ads[adIndices[0]].mediaUrl}
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <p>Invalid Ad Media</p>
                )
              )}
            </div>

            {/* Bottom Ad */}
            <div className="w-full h-1/2 flex items-center justify-center">
              {adExpired[1] ? (
                placeholderAd // Show placeholder if expired
              ) : (
                ads[adIndices[1]]?.mediaUrl.match(/\.(jpeg|jpg|png|gif)$/) ? (
                  <img className="w-full h-full object-cover rounded-md" src={ads[adIndices[1]].mediaUrl} alt="Ad" />
                ) : ads[adIndices[1]]?.mediaUrl.match(/\.(mp4|webm|ogg)$/) ? (
                  <video
                    className="w-full h-full object-cover rounded-md"
                    src={ads[adIndices[1]].mediaUrl}
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <p>Invalid Ad Media</p>
                )
              )}
            </div>
          </motion.div>
        )}

        {/* Display Placeholder Ad when both ads expired and interval is over */}
        {isBothAdsExpired && !isAdSlidingOut && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="ads w-1/4 bg-black text-white flex items-center justify-center space-y-2 p-2"
          >
            {placeholderAd}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Res2;
