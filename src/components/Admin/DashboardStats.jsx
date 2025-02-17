import React from "react";
import icon_PostAds from "../../assets/adminPanel/icon_PostAds.png";

const DashboardStats = ({ screens, ads, displayedAds }) => {
  return (
    <div className="flex flex-wrap p-4 px-6 mx-5 text-md border border-[#d9d9d9] rounded-sm">
      <div className="flex-1 bg-white border border-[#d9d9d9] p-4 rounded mr-4 mb-4 sm:mb-0">
        <h2>
          🖥️ Active Screens <span className="float-right">{screens.length}</span>
        </h2>
      </div>
      <div className="flex-1 bg-white border border-[#d9d9d9] p-4 rounded mr-4 mb-4 sm:mb-0">
        <h2>
          <img src={icon_PostAds} alt="Post Ads Icon" className="size-6 inline-block mr-2" />
          Active Ads <span className="float-right">{ads.length}</span>
        </h2>
      </div>
      <div className="flex-1 bg-white border border-[#d9d9d9] p-4 rounded mb-4 sm:mb-0">
        <h2 className="text-md">
          🖥️ Displayed Ads <span className="float-right">{displayedAds}</span>
        </h2>
      </div>
    </div>
  );
};

export default DashboardStats;
