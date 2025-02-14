import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  axios from 'axios';
import { Button } from "@mui/material";
import logo from './logo.png';
import Res1 from '../components/Res1/Res1';
import Res2 from '../components/Res2/Res2';
import Res3 from '../components/Res3/Res3';
import CreateScreen from "./CRUD/CreateScreen";
import UpdateScreen from "./CRUD/UpdateScreen";

export default function AdminDashboard() {
    const [data, setData] = useState({ screens: [], ads: [], displayedAds: 0 });
    const navigate = useNavigate();
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const screensResponse = await axios.get('http://localhost:3000/screens');

                // Extract ads from screens since there's no direct GET /ads route
                const allAds = screensResponse.data.flatMap(screen => screen.ads || []);

                setData({
                    screens: screensResponse.data,
                    ads: allAds,
                    displayedAds: allAds.reduce((acc, ad) => acc + (ad.displayCount || 0), 0),
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [data]); // Add data as a dependency

    return (
        <div className="p-6 bg-[#f9f3f2]">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <img src={logo} alt="AdSpace Logo" className="w-32 mx-auto" />
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => {
                        // Add your logout logic here
                        navigate('/admin');
                    }}
                >
                    Logout
                </button>
            </div>

            {/* Stats Section */}
            <div className="bg-blue-500 text-white p-6 rounded-lg flex justify-around mt-6">
                <div className="text-center">
                    <p className="text-5xl font-bold">{data.screens.length}</p>
                    <p>Active screens</p>
                </div>
                <div className="text-center">
                    <p className="text-5xl font-bold">{data.ads.length}</p>
                    <p>Active ads</p>
                </div>
                <div className="text-center">
                    <p className="text-5xl font-bold">{data.displayedAds}</p>
                    <p>Displayed ads (24h)</p>
                </div>
            </div>

            {/* Res1 Preview Section */}
            <h2 className="mt-6 text-lg font-semibold">Screen Previews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 ">
                {data.screens.map((screen, index) => {
                    return (
                        <div key={index} className="w-full border rounded-lg p-2 bg-[#f9f6f5] shadow-md flex flex-col justify-center items-center overflow-hidden h-70 ">
                            <div className="relative h-full flex justify-center items-center" style={{ transform: 'scale(0.3) scale(1)', transformOrigin: 'center' }}>
                                {screen.layoutType === 'Res1' ? (
                                    <Res1 screenId={screen.id} />
                                ) : screen.layoutType === 'Res2' ? (
                                    <Res2 screenId={screen.id} />
                                ) : screen.layoutType === 'Res3' ? (
                                    <Res3 screenId={screen.id} />
                                ) : null}
                            </div>
                            <button
                                className="-mt-5 text-center text-blue-500 underline"
                                onClick={() => navigate(`/${screen.routeName}`)}
                            >
                                {screen.name}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
                <Button
                    variant="contained"
                    sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
                    className="text-white px-6 py-2 rounded-lg w-full"
                    onClick={() => setOpenCreateModal(true)}
                >
                    Create Ad
                </Button>
                <CreateScreen open={openCreateModal} onClose={() => setOpenCreateModal(false)} />

                <Button
                    variant="contained"
                    sx={{ backgroundColor: data.ads.length > 0 ? 'blue' : 'gray', '&:hover': { backgroundColor: data.ads.length > 0 ? 'darkblue' : 'gray' } }}
                    className={`text-white px-6 py-2 rounded-lg w-full ${data.ads.length > 0 ? '' : 'cursor-not-allowed'}`}
                    onClick={() => data.ads.length > 0 ? setOpenUpdateModal(true) : alert('No ads found')}
                >
                    Update Screens
                </Button>

                {/* Update Modal */}
                <UpdateScreen
                    open={openUpdateModal}
                    onClose={() => setOpenUpdateModal(false)}
                />
            </div>
        </div>
    );
}
