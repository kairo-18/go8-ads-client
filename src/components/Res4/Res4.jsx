import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from "../../axios/axiosInstance";
import defaultAdVertical from "../../assets/defaultAd/GO8 Default-Vertical.gif";
import defaultVid from "../../assets/defaultAd/GO8 Default-Video.mp4"
import defaultAdHorizontal from "../../assets/defaultAd/GO8 Default-Horizontal.gif"

export default function Res4({ screenId, mutedVideo }) {
  const [bottomAds, setBottomAds] = useState([]);
  const [sideAds, setSideAds] = useState([]);
  const [showBottomAds, setShowBottomAds] = useState(true);
  const [showSideAds, setShowSideAds] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axiosInstance.get(`/api/screens/${screenId}`);
        const currentTime = new Date();
        const filteredAds = response.data.ads.filter(ad => {
          const startDate = new Date(ad.startDate);
          const endDate = new Date(ad.endDate);
          return startDate <= currentTime && endDate >= currentTime;
        });
        setBottomAds(filteredAds.filter(ad => ad.slot === "Bottom") || []);
        setSideAds(filteredAds.filter(ad => ad.slot === "Side") || []);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    fetchAds();
    const intervalId = setInterval(fetchAds, 10000);

    return () => clearInterval(intervalId);
  }, [screenId]);

  useEffect(() => {
    const toggleBottomAds = () => {
      setShowBottomAds(false);
      setTimeout(() => {
        setShowBottomAds(true);
      }, 10000);
    };

    const toggleSideAds = () => {
      setShowSideAds(false);
      setTimeout(() => {
        setShowSideAds(true);
      }, 10000);
    };

    let bottomAdIntervals = [];
    if (bottomAds.length > 0) {
      bottomAdIntervals = bottomAds.map(ad =>
        setInterval(() => {
          toggleBottomAds();
        }, ad.duration * 1000 + 10000)
      );
    } else {
      bottomAdIntervals.push(
        setInterval(() => {
          toggleBottomAds();
        }, 10000)
      );
    }
    
    let sideAdIntervals = [];
    if (sideAds.length > 0) {
      sideAdIntervals = sideAds.map(ad =>
        setInterval(() => {
          toggleSideAds();
        }, 10000)
      );
    } else {
      sideAdIntervals.push(
        setInterval(() => {
          toggleSideAds();
        }, 10000)
      );
    }
    

    return () => {
      bottomAdIntervals.forEach(clearInterval);
      sideAdIntervals.forEach(clearInterval);
    };
  }, [bottomAds, sideAds]);

  return (
    <div>
      <div className="w-screen h-screen flex bg-black">
        <div className={`w-${showSideAds ? '3/4' : 'full'} bg-white`}>
          {/* Div for video */}
          <div className={`h-${showBottomAds ? '3/4' : 'full'} bg-gray-500`}>
            <video className="w-full h-full"  autoPlay loop muted={mutedVideo}>
              <source src={defaultVid} type="video/mp4"/>
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Div for bottom ads */}
          {showBottomAds && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: showBottomAds ? 0 : '100%' }}
              transition={{ duration: 1 }}
              className="w-full h-1/4"
            >
              {bottomAds.length > 0 ? (
                bottomAds.map(ad => (
                  <div key={ad.id} className="w-full h-full">
                    <img src={ad.mediaUrl} alt="ad" className="h-full w-full" />
                  </div>
                ))
              ) : (
                <div className="w-full h-full">
                  <img src={defaultAdHorizontal} alt="default ad" className="h-full w-full" />
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Div for side ads */}
        {showSideAds && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: showSideAds ? 0 : '100%' }}
            transition={{ duration: 1 }}
            className="w-1/4 h-full"
          >
            {sideAds.length > 0 ? (
              sideAds.map(ad => (
                <div key={ad.id} className="w-full h-full ">
                  <img src={ad.mediaUrl} alt="ad" className="h-full w-full" />
                </div>
              ))
            ) : (
              <div className="w-full h-full ">
                <img src={defaultAdVertical} alt="default ad" className="h-full w-full" />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
