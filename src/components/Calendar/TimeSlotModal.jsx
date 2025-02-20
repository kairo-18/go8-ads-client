import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const TimeSlotModal = ({ isOpen, onClose, onSave }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
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
            for (let minute = 0; minute < 60; minute += 30) {
                const startTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                const endTime = `${String(hour + (minute + 30 === 60 ? 1 : 0)).padStart(2, '0')}:${String((minute + 30) % 60).padStart(2, '0')}`;
                slots.push(`${startTime} - ${endTime}`);
            }
        }
        return slots;
    };

    const handleSave = () => {
        onSave(selectedDate, selectedSlots);
        onClose();
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
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
                        <PopoverContent className="w-auto p-0">
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
