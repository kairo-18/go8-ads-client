import React, { useState } from 'react';

const AnnouncementInputs = () => {
    const [formData, setFormData] = useState({
        title: '',
        duration: '',
        projections: '',
        feedbackMessage: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className='border border-gray-300 p-5 rounded-lg'>
            <h1 className='mb-5'>Create Announcement</h1>
            <form className='flex flex-row gap-5'>
                <div className='flex flex-col gap-5 w-full h-[185px]'>
                    <div>
                        <input
                            className='border border-blue-500 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-[48px] p-2 rounded-lg'
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Title"
                        />
                    </div>
                    <div>
                        <select
                            className='border border-blue-500 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-[48px] p-2 rounded-lg text-gray-500'
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                        >
                            <option value="">Duration (Seconds)</option>
                            <option value="1 week">1 Week</option>
                            <option value="2 weeks">2 Weeks</option>
                            <option value="1 month">1 Month</option>
                            <option value="3 months">3 Months</option>
                        </select>
                    </div>
                    <div>
                        <select
                            className='border border-blue-500 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-[48px] p-2 rounded-lg text-gray-500'
                            id="projections"
                            name="projections"
                            value={formData.projections}
                            onChange={handleChange}
                        >
                            <option value="">Projections</option>
                            <option value="1 week">1 Week</option>
                            <option value="2 weeks">2 Weeks</option>
                            <option value="1 month">1 Month</option>
                            <option value="3 months">3 Months</option>
                        </select>
                    </div>
                </div>
                <div className='w-full h-[185px]'>
                    <textarea
                        className='border border-blue-500 bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-full p-2 rounded-lg'
                        id="feedbackMessage"
                        name="feedbackMessage"
                        value={formData.feedbackMessage}
                        onChange={handleChange}
                        placeholder="Message"
                    ></textarea>
                </div>
            </form>
        </div>
    );
};

export default AnnouncementInputs;
