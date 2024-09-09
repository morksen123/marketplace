import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Carousel, CarouselItem, CarouselContent, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';

export const ViewProductListing = () => {
    const showActions = true;
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    
    const handleEdit = () => {
        navigate('/edit-product-listing');
    };

    const handleConfirmDelete = () => {
        setOpen(false);
        // Handle the delete logic here
        console.log("Item deleted");
    };

    return (
        <div className="container mx-auto mt-6 p-4 relative">
            {/* Carousel */}
            <Carousel className="w-full max-w-xs mx-auto mb-6">
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index}>
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
                                        <span className="text-4xl font-semibold">{index + 1}</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

            {/* Product Information */}
            <div className="text-left">
                <h1 className="text-3xl font-bold mb-2">Tomatoes</h1>
                <p className="text-2xl text-green-600 font-semibold mb-2">$1.00 per kilogram</p>
                <p className="text-gray-600 mb-6">100 kg in stock</p>
                <hr className="border-gray-300 mb-6" />

                {/* Product Details */}
                <div className="text-left space-y-4">
                    <h2 className="text-2xl font-semibold">Details</h2>
                    <p><strong>Best Before: </strong>2024-08-30</p>
                    <p><strong>Food Condition: </strong>Near Expiry</p>
                    <p><strong>Description: </strong>Perfectly edible tomatoes in slightly damaged packaging. Great for sauces and soups.</p>
                    <p><strong>Delivery Method: </strong>Arranged Delivery</p>
                    <p><strong>Minimum Purchase Quantity: </strong>10 kg</p>
                </div>
            </div>

            {/* Edit and Delete Buttons */}
            {showActions && (
                <div className="absolute bottom-4 flex right-4 space-x-2">
                    <button className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 flex items-center"
                        onClick={handleEdit}
                    >
                        <EditIcon className="mr-2" /> Edit
                    </button>
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 flex items-center"
                        onClick={handleClickOpen}
                    >
                        <DeleteIcon className="mr-2" /> Delete
                    </button>

                    {/* Dialog */}
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete this product listing? This action cannot be undone.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <button
                                className="bg-white-600 text-black px-4 py-2 rounded-full flex items-center"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 flex items-center"
                                onClick={handleConfirmDelete}
                            >
                                <DeleteIcon className="mr-2" /> Delete
                            </button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
        </div>
    );
};
