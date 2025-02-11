import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightData from "./flightDetails";

const FlightBoard = () => {
    const [flights, setFlights] = useState(FlightData);

    useEffect(() => {
        const interval = setInterval(() => {
            setFlights([...FlightData].sort(() => Math.random() - 0.5));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full p-4 bg-[#d4e9f9] rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-[#2194e3] mb-6 text-center">
                Flight Board
            </h2>
            <div className="overflow-x-auto h-[90vh] p-2">
                <table className="w-full h-full min-w-[600px] bg-white rounded-lg shadow-sm overflow-hidden">
                    <thead>
                        <tr className="bg-[#2194e3] text-white">
                            <th className="p-3 text-left">Airline</th>
                            <th className="p-3 text-left">Flight No</th>
                            <th className="p-3 text-left">Trip Type</th>
                            <th className="p-3 text-left">Departure</th>
                            <th className="p-3 text-left">Arrival</th>
                            <th className="p-3 text-left">Departure Date</th>
                            <th className="p-3 text-left">Return Date</th>
                        </tr>
                    </thead>
                    <AnimatePresence>
                        <tbody>
                            {flights.map((flight) => (
                                <motion.tr
                                    key={flight.id}
                                    className="hover:bg-[#d4e9f9] transition-colors"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <td className="p-3 border-b border-[#d4e9f9]">
                                        {flight.airline}
                                    </td>
                                    <td className="p-3 border-b border-[#d4e9f9]">
                                        {flight.flight_no}
                                    </td>
                                    <td className="p-3 border-b border-[#d4e9f9]">
                                        {flight.trip_type}
                                    </td>
                                    <td className="p-3 border-b border-[#d4e9f9]">
                                        {flight.departure_airport}
                                    </td>
                                    <td className="p-3 border-b border-[#d4e9f9]">
                                        {flight.arrival_airport}
                                    </td>
                                    <td className="p-3 border-b border-[#d4e9f9]">
                                        {flight.departure_date}
                                    </td>
                                    <td className="p-3 border-b border-[#d4e9f9]">
                                        {flight.return_date || "N/A"}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </AnimatePresence>
                </table>
            </div>
        </div>
    );
};

export default FlightBoard;