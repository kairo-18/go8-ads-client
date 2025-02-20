import React from "react";
import loadingState from "../../assets/loading/Loading Animation.gif";
const Loading = () => {
    return (
        <div className="flex justify-center items-center">
            <img src={loadingState} alt="Loading..." className="w-10 h-10" />
        </div>
    );
};

export default Loading;
