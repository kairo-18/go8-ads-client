import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const TimeSlotModal = ({ isOpen, onClose, onSave, selectedDate, setSelectedDate, ads, selectedScreens, layoutType }) => {
    const [selectedSlots, setSelectedSlots] = useState([]);
    console.log(layoutType);
    const handleDateSelect = (date) => {
        setSelectedDate(date); // Use setSelectedDate from props
        setSelectedSlots([]); // Reset slots when a new date is selected
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlots((prev) =>
            prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
        );
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            const startTime = `${String(hour).padStart(2, '0')}:00`;
            const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
            slots.push(`${startTime} - ${endTime}`);
        }
        return slots;
    };

    const isSlotOccupied = (slot) => {
        if (!selectedDate) return false;

        // Get the current date and time
        const now = new Date();
        const currentDate = format(now, "yyyy-MM-dd");
        const currentHour = now.getHours();

        // Format the selected date as "yyyy-MM-dd"
        const formattedDate = format(selectedDate, "yyyy-MM-dd");

        // Check if the selected date is in the past
        const isPastDate = formattedDate < currentDate;

        // If the selected date is in the past, disable all slots
        if (isPastDate) {
            return true;
        }

        // Check if the selected date is today
        const isToday = formattedDate === currentDate;

        // Extract the start time from the slot
        const startTime = parseInt(slot.split(":")[0], 10);

        // If the selected date is today and the slot is in the past, disable it
        if (isToday && startTime < currentHour) {
            return true;
        }

        // Check if any ad matches the selected date and slot
        return ads.some(ad => {
            // Parse the ad's start and end dates from the timestamp
            const adStartDate = new Date(ad.startDate);
            const adEndDate = new Date(ad.endDate);

            // Format the ad's date as "yyyy-MM-dd"
            const adFormattedDate = format(adStartDate, "yyyy-MM-dd");

            // Format the ad's time slot as "HH:mm - HH:mm"
            const adStartTime = format(adStartDate, "HH:00");
            let adEndTime = format(adEndDate, "HH:00");
            if (adEndTime === "00:00") {
                adEndTime = "24:00";
            }
            const adSlot = `${adStartTime} - ${adEndTime}`;

            // Compare the date and slot
            if (adFormattedDate === formattedDate && adSlot === slot) {
                // For Res2, check if both Upper and Lower slots are occupied
                if (layoutType === "Res2") {
                    const upperAd = ads.find(ad => ad.slot === "Upper" && adFormattedDate === formattedDate && adSlot === slot);
                    const lowerAd = ads.find(ad => ad.slot === "Lower" && adFormattedDate === formattedDate && adSlot === slot);
                    return upperAd && lowerAd; // Only disable if both slots are occupied
                }
                // For Res3, check if both Side and Bottom slots are occupied
                else if (layoutType === "Res3") {
                    const sideAd = ads.find(ad => ad.slot === "Side" && adFormattedDate === formattedDate && adSlot === slot);
                    const bottomAd = ads.find(ad => ad.slot === "Bottom" && adFormattedDate === formattedDate && adSlot === slot);
                    return sideAd && bottomAd; // Only disable if both slots are occupied
                }
                else if (layoutType === "Res4") {
                    const sideAd = ads.find(ad => ad.slot === "Side" && adFormattedDate === formattedDate && adSlot === slot);
                    const bottomAd = ads.find(ad => ad.slot === "Bottom" && adFormattedDate === formattedDate && adSlot === slot);
                    const middleAd = ads.find(ad => ad.slot === "Middle" && adFormattedDate === formattedDate && adSlot === slot);
                    return sideAd && bottomAd && middleAd; // Only disable if both slots are occupied
                }
                // For Res1, disable if any ad is present
                else {
                    return true;
                }
            }
            return false;
        });
    };

    const handleSave = () => {
        onSave(selectedDate, selectedSlots);
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
            <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl max-h-screen overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Select Time Slots</h2>
                <div className="flex flex-col gap-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 bg-white shadow-lg rounded-lg">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[50vh]">
                        {generateTimeSlots().map((slot, index) => (
                            <Button
                                key={index}
                                variant={selectedSlots.includes(slot) ? "default" : "outline"}
                                onClick={() => handleSlotSelect(slot)}
                                disabled={!selectedDate || isSlotOccupied(slot)}
                            >
                                {slot}
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </div>
            </div>
        </div>
    );
};

export default TimeSlotModal;
