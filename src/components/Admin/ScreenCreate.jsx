import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axiosInstance from '../../axios/axiosInstance';
import Resolution1 from "../../assets/Resolutions/Res1.png";
import Resolution2 from "../../assets/Resolutions/Res2.png";
import Resolution3 from "../../assets/Resolutions/Res3.png";
import Resolution4 from "../../assets/Resolutions/Res4.png";

const ScreenCreate = ({ onScreenCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        routeName: '',
        layoutType: '',
        userId: '',
    });

    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/api/users/unassigned');
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.error('Unexpected response format:', response.data);
                    setUsers([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const newScreen = {
                name: formData.name.trim(),
                routeName: formData.routeName.trim(),
                layoutType: formData.layoutType.trim(),
                ads: [],
            };

            const screenResponse = await axiosInstance.post('/api/screens', newScreen, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (formData.userId) {
                await axiosInstance.patch(`/api/screens/${screenResponse.data.id}/user/${formData.userId}`);
            }

            alert('Screen created successfully!');
            setFormData({ name: '', routeName: '', layoutType: '', userId: '' });
            setIsOpen(false);
            onScreenCreated();
        } catch (error) {
            console.error('Error creating screen:', error);
            alert('Error creating screen. Please try again.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800" onClick={() => setIsOpen(true)}>
                    Create Screen
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white border border-gray-300 shadow-xl">
                <DialogHeader>
                    <DialogTitle>Create Screen</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new screen.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Screen Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div>
                        <Label htmlFor="routeName">Route Name</Label>
                        <Input id="routeName" name="routeName" value={formData.routeName} onChange={handleChange} />
                    </div>
                    <div>
                        <Select
                            id="layoutType"
                            name="layoutType"
                            value={formData.layoutType}
                            onValueChange={(value) => setFormData({ ...formData, layoutType: value })}
                        >
                            <SelectTrigger className="relative group">
                                <SelectValue placeholder="Select a layout type">
                                    {formData.layoutType || "Select a layout type"}
                                </SelectValue>
                                {formData.layoutType && (
                                    <img
                                        src={
                                            formData.layoutType === "Res1" ? Resolution1 :
                                            formData.layoutType === "Res2" ? Resolution2 :
                                            formData.layoutType === "Res3" ? Resolution3 :
                                            Resolution4
                                        }
                                        alt={formData.layoutType}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-1/2 rounded-lg border shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    />
                                )}
                            </SelectTrigger>
                            <SelectContent className="bg-white w-full">
                                <SelectItem value="Res1">
                                    <div className="flex items-center space-x-3 p-3">
                                        <img src={Resolution1} alt="Res1" className="w-24 h-16 rounded-lg border shadow-md" />
                                        <div>
                                            <span className="text-md font-medium">Res1</span>
                                            <p className="text-sm text-gray-500">1 vertical ad slot</p>
                                        </div>
                                    </div>
                                </SelectItem>
                                <SelectItem value="Res2">
                                    <div className="flex items-center space-x-3 p-3">
                                        <img src={Resolution2} alt="Res2" className="w-24 h-16 rounded-lg border shadow-md" />
                                        <div>
                                            <span className="text-md font-medium">Res2</span>
                                            <p className="text-sm text-gray-500">2 square ad slots</p>
                                        </div>
                                    </div>
                                </SelectItem>
                                <SelectItem value="Res3">
                                    <div className="flex items-center space-x-3 p-3">
                                        <img src={Resolution3} alt="Res3" className="w-24 h-16 rounded-lg border shadow-md" />
                                        <div>
                                            <span className="text-md font-medium">Res3</span>
                                            <p className="text-sm text-gray-500">1 horizontal, 1 vertical ad slot</p>
                                        </div>
                                    </div>
                                </SelectItem><SelectItem value="Res4">
                                    <div className="flex items-center space-x-3 p-3">
                                        <img src={Resolution4} alt="Res3" className="w-24 h-16 rounded-lg border shadow-md" />
                                        <div>
                                            <span className="text-md font-medium">Res4</span>
                                            <p className="text-sm text-gray-500">1 horizontal, 1 vertical, 1 middle ad slot</p>
                                        </div>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="userId">Assign User</Label>
                        <Select
                            id="userId"
                            name="userId"
                            value={formData.userId}
                            onValueChange={(value) => setFormData({ ...formData, userId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {Array.isArray(users) && users.filter(user => user.role !== 'admin').map(user => (
                                    <SelectItem key={user.id} value={user.id}>{user.username}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ScreenCreate;
