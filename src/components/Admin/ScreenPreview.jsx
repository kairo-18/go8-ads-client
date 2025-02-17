import React, { useEffect, useState } from "react";
import axiosInstance from "../../../src/axios/axiosInstance";
import Res1 from "../Res1/Res1";
import Res2 from "../Res2/Res2";
import Res3 from "../Res3/Res3";
import { useNavigate } from "react-router-dom";


function ScreenPreview() {
  const [data, setData] = useState({
    screens: [],
    ads: [],
    displayedAds: 0,
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const screensResponse = await axiosInstance.get(
          "http://localhost:3000/screens"
        );

        // Extract ads from screens since there's no direct GET /ads route
        const allAds = screensResponse.data.flatMap(
          (screen) => screen.ads || []
        );

        setData({
          screens: screensResponse.data,
          ads: allAds,
          displayedAds: allAds.reduce(
            (acc, ad) => acc + (ad.displayCount || 0),
            0
          ),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="w-full h-full border border-[#D9D9D9] rounded-2xl p-5 mt-5 gap-10">
    <h1 className="font-medium text-lg">Previews</h1>
      <div className="flex flex-wrap gap-10 justify-center"> {/* flex-wrap added */}
        {data.screens.map((screen, index) => {
          return (
            <div
              key={index}
              className="w-full max-w-[320px] max-h-[350px] border border-[#D9D9D9] rounded-lg p-3 bg-[#f9f6f5] shadow-md flex flex-col justify-center items-center overflow-hidden" 
              style={{ flexBasis: 'calc(33.333% - 20px)' }} // Making items wrap in 3 columns
            >
              <div className="w-full h-full max-w-[356px] max-h-[288px] flex justify-center items-center overflow-hidden mb-3">
                <div className="w-full h-full max-w-full max-h-full flex justify-center items-center"
                  style={{
                    transform: "scaleY(0.3) scaleX(1)",
                    transformOrigin: "center",
                  }} 
                >
                  {screen.layoutType === "Res1" ? (
                <Res1 screenId={screen.id} className="w-full h-full object-cover rotate-90" />
                ) : screen.layoutType === "Res2" ? (
                <Res2 screenId={screen.id} className="w-full h-full object-cover rotate-90" />
                ) : screen.layoutType === "Res3" ? (
                <Res3 screenId={screen.id} className="w-full h-full object-cover rotate-90" />
                ) : null}
                </div>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-[#282828]">{screen.name}</h3>
                    <span className="text-sm">Updated {new Date().toLocaleTimeString()}</span>
                    <span className="text-sm">{new Date().toLocaleDateString()}</span>
                </div>
                <button
                className="-mt-5 text-center bg-[#EEEEEE] rounded-lg px-4 py-2 text-sm text-[#282828] h-[40px]"
                onClick={() => navigate(`/${screen.routeName}`)}
              >
                View Details
              </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ScreenPreview;
