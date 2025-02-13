import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlightData from "./flightDetails";

const statusColors = {
    "On Time": "text-green-400",
    "Delayed": "text-yellow-400",
    "Cancelled": "text-red-500",
    "Boarding": "text-blue-400",
    "Departed": "text-gray-400",
};

const FlightBoard = () => {
    const [flights, setFlights] = useState(FlightData);

    useEffect(() => {
        const interval = setInterval(() => {
            setFlights([...FlightData].sort(() => Math.random() - 0.5));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full p-4 bg-black rounded-lg shadow-md">
            <h2 className="text-4xl font-bold text-yellow-400 mb-6 text-center">
                ✈ Flight Board
            </h2>
            <div className="overflow-x-auto h-[90vh] p-2">
                <table className="w-full min-w-[700px] bg-gray-900 text-yellow-300 rounded-lg shadow-sm overflow-hidden">
                    <thead>
                        <tr className="bg-gray-800 text-yellow-400">
                            <th className="p-3 text-left">Airline</th>
                            <th className="p-3 text-left">Flight No</th>
                            <th className="p-3 text-left">Trip Type</th>
                            <th className="p-3 text-left">Departure</th>
                            <th className="p-3 text-left">Arrival</th>
                            <th className="p-3 text-left">Departure Date</th>
                            <th className="p-3 text-left">Return Date</th>
                            <th className="p-3 text-left">Status</th>
                        </tr>
                    </thead>
                    <AnimatePresence>
                        <tbody>
                            {flights.map((flight) => (
                                <motion.tr
                                    key={flight.id}
                                    className="hover:bg-gray-700 transition-colors"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <td className="p-3 border-b border-gray-700">{flight.airline}</td>
                                    <td className="p-3 border-b border-gray-700">{flight.flight_no}</td>
                                    <td className="p-3 border-b border-gray-700">{flight.trip_type}</td>
                                    <td className="p-3 border-b border-gray-700">{flight.departure_airport}</td>
                                    <td className="p-3 border-b border-gray-700">{flight.arrival_airport}</td>
                                    <td className="p-3 border-b border-gray-700">{flight.departure_date}</td>
                                    <td className="p-3 border-b border-gray-700">{flight.return_date || "N/A"}</td>
                                    <td className={`p-3 border-b border-gray-700 font-bold ${statusColors[flight.status]}`}>
                                        {flight.status}
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
