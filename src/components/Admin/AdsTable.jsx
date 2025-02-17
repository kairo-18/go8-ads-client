import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, Edit } from "lucide-react";
import axiosInstance from "../../axios/axiosInstance";

function AdsTable({ ads: initialAds, screenId }) {
    const [localAds, setLocalAds] = useState(initialAds);
    const [selectedAd, setSelectedAd] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    useEffect(() => {
        setLocalAds(initialAds);
    }, [initialAds]);

    const handleChangeAsset = (ad) => {
        setSelectedAd(ad);
        setIsUploadModalOpen(true);
    };

    const handleDeleteAd = (ad) => {
        setSelectedAd(ad);
        setIsDeleteModalOpen(true);
    };

    const handleUpdateAd = (ad) => {
        setSelectedAd(ad);
        setIsUpdateModalOpen(true);
    };

    const handleFileUpload = async (file) => {
        if (!file) return alert("Please select a file");

        const formData = new FormData();
        formData.append("ads", file);

        try {
            const response = await axiosInstance.post(
                "http://localhost:3000/ads-upload",
                formData
            );
            if (!response.data.fileUrl) throw new Error("File upload failed");

            const updatedAd = {
                ...selectedAd,
                mediaUrl: response.data.fileUrl,
            };

            await axiosInstance.patch(
                `http://localhost:3000/screens/${screenId}/ads/${selectedAd.id}`,
                updatedAd
            );

            setLocalAds((prevAds) =>
                prevAds.map((ad) => (ad.id === selectedAd.id ? updatedAd : ad))
            );

            alert("Ad updated successfully!");
            setIsUploadModalOpen(false);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const confirmDeleteAd = async () => {
        try {
            await axiosInstance.delete(
                `http://localhost:3000/screens/${screenId}/ads/${selectedAd.id}`
            );

            setLocalAds((prevAds) =>
                prevAds.filter((ad) => ad.id !== selectedAd.id)
            );

            alert("Ad deleted successfully!");
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting ad:", error);
        }
    };

    const handleUpdateAdDetails = async () => {
        try {
            await axiosInstance.patch(
                `http://localhost:3000/screens/${screenId}/ads/${selectedAd.id}`,
                selectedAd
            );

            setLocalAds((prevAds) =>
                prevAds.map((ad) => (ad.id === selectedAd.id ? selectedAd : ad))
            );

            alert("Ad updated successfully!");
            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error("Error updating ad:", error);
        }
    };

    if (!localAds || localAds.length === 0) {
        return (
            <p className="text-gray-500 mt-4">
                No ads available for this screen.
            </p>
        );
    }

    return (
        <Card className="mt-6 h-[65vh] overflow-y-scroll">
            <CardHeader>
                <CardTitle>Ad Management</CardTitle>
            </CardHeader>
            <CardContent>
                {localAds.map((ad) => (
                    <div key={ad.id} className="mb-6 p-4 border rounded-lg">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="mb-4 md:mb-0 md:mr-4">
                                {ad.mediaUrl && (
                                    <div className="relative w-full h-48 md:w-64 md:h-48">
                                        {ad.mediaUrl.match(
                                            /\.(jpeg|jpg|gif|png)$/
                                        ) ? (
                                            <img
                                                src={
                                                    ad.mediaUrl ||
                                                    "/placeholder.svg"
                                                }
                                                alt="Ad Preview"
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-lg h-full"
                                            />
                                        ) : ad.mediaUrl.match(
                                              /\.(mp4|webm|ogg)$/
                                          ) ? (
                                            <video
                                                src={ad.mediaUrl}
                                                controls
                                                className="w-full h-full rounded-lg"
                                            />
                                        ) : (
                                            <p className="text-gray-600">
                                                Unsupported file type for
                                                preview.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg font-semibold">
                                    {ad.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Start Date:{" "}
                                    {new Date(ad.startDate).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600">
                                    End Date:{" "}
                                    {new Date(ad.endDate).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Duration: {ad.duration}
                                </p>
                            </div>
                            <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                                <Button
                                    variant="outline"
                                    onClick={() => handleChangeAsset(ad)}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Change asset
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleUpdateAd(ad)}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Update
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteAd(ad)}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Terminate ad
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>

            <Dialog
                open={isUploadModalOpen}
                onOpenChange={setIsUploadModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload New Asset</DialogTitle>
                    </DialogHeader>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture">Picture</Label>
                        <Input
                            id="picture"
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) =>
                                handleFileUpload(e.target.files[0])
                            }
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsUploadModalOpen(false)}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this ad?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="destructive" onClick={confirmDeleteAd}>
                            Delete
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isUpdateModalOpen}
                onOpenChange={setIsUpdateModalOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Ad Details</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={selectedAd?.title || ""}
                                onChange={(e) =>
                                    setSelectedAd({
                                        ...selectedAd,
                                        title: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="slot" className="text-right">
                                Slot
                            </Label>
                            <Input
                                id="slot"
                                value={selectedAd?.slot || ""}
                                onChange={(e) =>
                                    setSelectedAd({
                                        ...selectedAd,
                                        slot: e.target.value,
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="duration" className="text-right">
                                Duration
                            </Label>
                            <Input
                                id="duration"
                                type="number"
                                value={selectedAd?.duration || ""}
                                onChange={(e) =>
                                    setSelectedAd({
                                        ...selectedAd,
                                        duration: Number.parseInt(
                                            e.target.value
                                        ),
                                    })
                                }
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleUpdateAdDetails}>Update</Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsUpdateModalOpen(false)}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

export default AdsTable;
