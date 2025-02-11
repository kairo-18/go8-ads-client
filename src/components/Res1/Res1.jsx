import React from 'react'
import FlightBoard from './FlightBoard';

function Res1() {
return (
    <div className='w-screen h-screen flex'>
        {/*This div is the flight detail board*/ }
        <div className='w-3/4'>
            <FlightBoard />
        </div>
        {/*This div is the ads*/ }
        <div className='w-1/6'>Hotdog</div>

    </div>
)
}

export default Res1;