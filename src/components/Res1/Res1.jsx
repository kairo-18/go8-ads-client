import React, {useState, useEffect} from 'react'
import FlightBoard from './FlightBoard';

function Res1() {
    const [isAds, toggleAds] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => {
            toggleAds(!isAds);
        }, 5000);
        return () => clearInterval(interval);
    }, [isAds]);
return (
    <div className='w-screen h-screen flex'>
        {/*This div is the flight detail board*/ }
        <div className={isAds ? 'w-3/4' : 'w-full'}>
            <FlightBoard />
        </div>
        {/*This div is the ads*/ }
        
        {isAds && <div className='ads w-1/6'>Hotdog</div>}
    </div>
)
}

export default Res1;