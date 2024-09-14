import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import { Carousel, CarouselItem, CarouselContent, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import { foodCategoryMapping, foodConditionMapping, deliveryMethodMapping, unitMapping } from '@/features/ProductListing/constants';

export const ViewProductListing = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [batches, setBatches] = useState([]);
    const [open, setOpen] = useState(false);
    const [openAddBatch, setOpenAddBatch] = useState(false);
    const [newBatchQuantity, setNewBatchQuantity] = useState('');
    const [newBatchExpiryDate, setNewBatchExpiryDate] = useState('');
    const [isFavourite, setIsFavourite] = useState(false);
    const buyerId = 1; // To change

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`);
                const data = await response.json();
                setProduct(data);
                setBatches(data.batches || []);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        const checkFavourited = async () => {
            try {
                const response = await fetch(`/api/buyer/favourites/check?productId=${productId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJidXllckBnbWFpbC5jb20iLCJpYXQiOjE3MjYyMDc1NzEsImV4cCI6MTcyNjgxMjM3MX0.Ddn1Dtnj1-Suj07LNCM86ordKv8RzOGw1D13RcfuTTI',
                        'Content-Type': 'application/json',
                    },
                });

                const result = await response.json();
                setIsFavourite(result);
            } catch (error) {
                console.error('Error checking if product is favourited:', error);
            }
        };

        fetchProduct();
        checkFavourited();
    }, [productId]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEdit = () => {
        navigate(`/edit-product-listing/${productId}`, { state: { product } });
    };

    const handleToggleFavourite = async () => {
        try {
            let response;
            if (isFavourite) {
                response = await fetch(`/api/buyer/${buyerId}/favourites/${productId}/remove`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJidXllckBnbWFpbC5jb20iLCJpYXQiOjE3MjYyMDc1NzEsImV4cCI6MTcyNjgxMjM3MX0.Ddn1Dtnj1-Suj07LNCM86ordKv8RzOGw1D13RcfuTTI',
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                response = await fetch(`/api/buyer/${buyerId}/favourites/${productId}/add`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJidXllckBnbWFpbC5jb20iLCJpYXQiOjE3MjYyMDc1NzEsImV4cCI6MTcyNjgxMjM3MX0.Ddn1Dtnj1-Suj07LNCM86ordKv8RzOGw1D13RcfuTTI',
                        'Content-Type': 'application/json'
                    }
                });
            }

            if (response.ok) {
                setIsFavourite(!isFavourite);
                alert(isFavourite ? 'Removed from favourites' : 'Added to favourites');
            } else {
                const errorMessage = await response.text();
                console.error('Error:', errorMessage);
                alert(`Failed to update favourites: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error occurred while updating favourites:', error);
        }
    };

    // Delete Product API call
    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`/api/products/product/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdHJpbmdAZ21haWwuY29tIiwiaWF0IjoxNzI2MjA3NDIzLCJleHAiOjE3MjY4MTIyMjN9.SScCI90ac49GsW1hVd-7Q8tXNo3UAWjkL3G5Ej2aywo',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert(`Product ID: ${productId} deleted successfully.`);
                navigate('/distributor-home');
            } else {
                const errorMessage = await response.text();
                console.error('Error deleting product:', errorMessage);
                alert(`Failed to delete product: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error occurred while deleting the product:', error);
        } finally {
            setOpen(false); // Close the delete dialog
        }
    };

    const handleAddBatch = async () => {
        if (newBatchQuantity && newBatchExpiryDate) {
            const batchData = {
                quantity: parseInt(newBatchQuantity),
                expiryDate: newBatchExpiryDate
            };

            try {
                // Make the API call to the backend to add the new batch
                const response = await fetch(`/api/products/product/${productId}/batch`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJidXllckBnbWFpbC5jb20iLCJpYXQiOjE3MjYyMDc1NzEsImV4cCI6MTcyNjgxMjM3MX0.Ddn1Dtnj1-Suj07LNCM86ordKv8RzOGw1D13RcfuTTI',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(batchData) // Send batch data as JSON
                });

                if (response.ok) {
                    const newBatch = await response.json();

                    // Update the batches in the state with the new batch
                    const updatedBatches = [...batches, newBatch];
                    setBatches(updatedBatches);

                    // Reset the form and close the dialog
                    setOpenAddBatch(false);
                    setNewBatchQuantity('');
                    setNewBatchExpiryDate('');
                    alert('Batch added successfully');
                } else {
                    const errorMessage = await response.text();
                    console.error('Error adding batch:', errorMessage);
                    alert(`Failed to add batch: ${errorMessage}`);
                }
            } catch (error) {
                console.error('Error occurred while adding the batch:', error);
                alert('An error occurred while adding the batch');
            }
        }
    };



    if (!product) {
        return <div>Loading...</div>; // Show loading spinner or message while data is being fetched
    }

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

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-left">{product.listingTitle}</h1>
                    <p className="text-2xl text-green-600 font-semibold">${product.price.toFixed(2)} per kilogram</p>
                </div>

                <button onClick={handleToggleFavourite} className="flex items-center">
                    <FavoriteOutlinedIcon style={{ color: isFavourite ? 'red' : 'gray', fontSize: '28px' }} />
                </button>
            </div>
            <div className="text-left">
                <hr className="border-gray-300 mb-6" />
                <div className="text-left space-y-4">
                    <h2 className="text-2xl font-semibold">Details</h2>

                    <p><strong>Food Condition: </strong>{foodConditionMapping[product.foodCondition] || product.foodCondition}</p>
                    <p><strong>Food Condition: </strong>{foodCategoryMapping[product.foodCategory] || product.foodCategory}</p>
                    <p><strong>Description: </strong>{product.description}</p>
                    <p><strong>Delivery Method: </strong>{deliveryMethodMapping[product.deliveryMethod] || product.deliveryMethod}</p>
                    <p><strong>Minimum Purchase Quantity: </strong>{product.minPurchaseQty} kg</p>
                    {product.weight && <p><strong>Weight: </strong>{product.weight} kg</p>}
                    {product.pickUpLocation && <p><strong>Pick Up Location: </strong>{product.pickUpLocation}</p>}
                </div>

                <div className="mt-6 mb-6 flex justify-end space-x-2">
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
                </div>

                {/* Batches Section */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Batches</h2>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 flex items-center"
                            onClick={() => setOpenAddBatch(true)}

                        >
                            <AddIcon className="mr-2" /> Add Batch
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {batches.map((batch, index) => (
                            <Card key={index} className="flex  items-center">
                                <CardContent className="flex-1 p-4">
                                    <p className="font-semibold">Total Quantity</p>
                                    <p>{batch.quantity} kg</p>
                                    <p className="font-semibold">Best Before Date</p>
                                    <p>{batch.bestBeforeDate}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

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

                {/* Add Batch Dialog */}
                <Dialog open={openAddBatch} onClose={() => setOpenAddBatch(false)}>
                    <DialogTitle>{"Add New Batch"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the details for the new batch.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="quantity"
                            label="Total Quantity (kg)"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={newBatchQuantity}
                            onChange={(e) => setNewBatchQuantity(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            id="expiryDate"
                            label="Expiry Date"
                            type="date"
                            fullWidth
                            variant="standard"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={newBatchExpiryDate}
                            onChange={(e) => setNewBatchExpiryDate(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenAddBatch(false)}>Cancel</Button>
                        <Button onClick={handleAddBatch}>Add</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};
