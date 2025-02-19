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
import axios from 'axios';

const ScreenCreate = ({ onScreenCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        routeName: '',
        layoutType: '',
    });

    const [isOpen, setIsOpen] = useState(false);

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

            await axios.post('/api/screens', newScreen, {
                headers: { 'Content-Type': 'application/json' },
            });

            alert('Screen created successfully!');
            setFormData({ name: '', routeName: '', layoutType: '' });
            setIsOpen(false); // Close modal

            // Call the refresh function
            onScreenCreated();
        } catch (error) {
            console.error('Error creating screen:', error);
            alert('Error creating screen. Please try again.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsOpen(true)}>Create Screen</Button>
            </DialogTrigger>
            <DialogContent>
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
                        <Label htmlFor="layoutType">Layout Type</Label>
                        <Select
                            id="layoutType"
                            name="layoutType"
                            value={formData.layoutType}
                            onValueChange={(value) => setFormData({ ...formData, layoutType: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a layout type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Res1">Res1</SelectItem>
                                <SelectItem value="Res2">Res2</SelectItem>
                                <SelectItem value="Res3">Res3</SelectItem>
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

