import React, { useState } from "react";
import { Button } from '@/components/ui/button';

function ScreenDelete({ onConfirmDelete, isDeleting, setIsDeleting, setSelectedScreens }) {
    return (
        <div className="flex gap-2 ml-5">
            <Button
                onClick={() => isDeleting ? onConfirmDelete() : setIsDeleting(true)}
                className={`px-4 py-2 text-white rounded ${isDeleting ? 'bg-red-500' : 'bg-red-500'}`}
            >
                {isDeleting ? "Confirm" : "Delete"}
            </Button>
            {isDeleting && (
                <Button
                    onClick={() => {
                        setIsDeleting(false);
                        setSelectedScreens([]);
                    }}
                    className="px-4 py-2 bg-gray-300 text-black rounded"
                >
                    Cancel
                </Button>
            )}
        </div>
    );
}

export default ScreenDelete;
