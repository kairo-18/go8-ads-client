import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axiosInstance";
import icon_PostAds from "../../assets/adminPanel/icon_PostAds.png";

const DashboardStats = () => {
  const [data, setData] = useState({
    screens: [],
    ads: [],
    displayedAds: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const screensResponse = await axiosInstance.get("http://localhost:3000/api/screens");
        const allAds = screensResponse.data.flatMap((screen) => screen.ads || []);

        setData({
          screens: screensResponse.data,
          ads: allAds,
          displayedAds: allAds.reduce((acc, ad) => acc + (ad.displayCount || 0), 0),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap p-4 px-6 mx-5 text-md border border-[#d9d9d9] rounded-sm">
      <div className="flex-1 bg-white border border-[#d9d9d9] p-4 rounded mr-4 mb-4 sm:mb-0">
        <h2>
          🖥️ Active Screens <span className="float-right">{data.screens.length}</span>
        </h2>
      </div>
      <div className="flex-1 bg-white border border-[#d9d9d9] p-4 rounded mr-4 mb-4 sm:mb-0">
        <h2>
          <img src={icon_PostAds} alt="Post Ads Icon" className="size-6 inline-block mr-2" />
          Active Ads <span className="float-right">{data.ads.length}</span>
        </h2>
      </div>
      <div className="flex-1 bg-white border border-[#d9d9d9] p-4 rounded mb-4 sm:mb-0">
        <h2 className="text-md">
          🖥️ Displayed Ads <span className="float-right">{data.displayedAds}</span>
        </h2>
      </div>
    </div>
  );
};

export default DashboardStats;
