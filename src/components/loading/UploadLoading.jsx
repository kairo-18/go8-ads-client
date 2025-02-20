import React from "react";
import loadingGif from "../../assets/loading/Upload Animation.gif";

const UploadLoading = () => {
  return (
    <div className="flex flex-col justify-center items-center p-5">
      <img src={loadingGif} alt="Uploading..." className="w-12 h-12" />
      <p className="text-gray-600 text-sm mt-2">Uploading...</p>
    </div>
  );
};

export default UploadLoading;
