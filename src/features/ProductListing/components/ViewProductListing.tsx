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
import { foodCategoryMapping, foodConditionMapping, deliveryMethodMapping, unitMapping, Product, Batch } from '@/features/ProductListing/constants';

export const ViewProductListing = () => {

    const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState<Product | null>(null);;
    const [batches, setBatches] = useState<Batch[]>([]);
    const [open, setOpen] = useState(false);
    const [openAddBatch, setOpenAddBatch] = useState(false);
    const [newBatchQuantity, setNewBatchQuantity] = useState('');
    const [newBatchBestBeforeDate, setNewBatchBestBeforeDate] = useState('');
    const [isFavourite, setIsFavourite] = useState(false);
    const [loading, setLoading] = useState(true);
    const buyerId = 1; // To change

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Add leading 0 if necessary
        const day = String(today.getDate()).padStart(2, '0'); // Add leading 0 if necessary
        return `${year}-${month}-${day}`;
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options); // en-GB for British date formatting
    };

    const handleDateChange = (e) => {
        const dateValue = e.target.value;
        setNewBatchBestBeforeDate(dateValue);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`);
                const data = await response.json();
                setProduct(data);
                setBatches(data.batches || []);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        const checkFavourited = async () => {
            try {
                const response = await fetch(`/api/buyer/favourites/check?productId=${productId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
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
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                });
            } else {
                response = await fetch(`/api/buyer/${buyerId}/favourites/${productId}/add`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                });
            }

            if (response.ok) {
                setIsFavourite(!isFavourite);
            } else {
                const errorMessage = await response.text();
                console.error('Error:', errorMessage);
                alert(`Failed to update favourites: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error occurred while updating favourites:', error);
        }
    };

    // This actually deactivates the product not deletes
    const handleConfirmDeactivate = async () => {
        try {
            const response = await fetch(`/api/products/product/deactivate/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            });

            if (response.ok) {
                alert(`Product ID: ${productId} deleted successfully.`);
                navigate('/distributor/home');
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
        if (newBatchQuantity && newBatchBestBeforeDate) {
            const batchData = {
                quantity: parseInt(newBatchQuantity),
                bestBeforeDate: newBatchBestBeforeDate
            };

            try {
                // Make the API call to the backend to add the new batch
                const response = await fetch(`/api/products/product/${productId}/batch`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
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
                    setNewBatchBestBeforeDate('');
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

    if (loading) {
        return <div className="wrapper">Loading...</div>;
    }

    if (!product) {
        return <div className="wrapper">No product found</div>;
    }

    return (
        <div className="wrapper">
            {/* Carousel */}
            <Carousel className="w-full max-w-10xl mx-auto mb-6">
                <CarouselContent>
                    {product.productPictures?.map((pictureUrl, index) => {
                        if (index % 3 === 0) {
                            return (
                                <CarouselItem key={index}>
                                    <div className="flex space-x-2">
                                        {product.productPictures.slice(index, index + 3).map((pic, idx) => (
                                            <div key={idx} className="w-1/3 p-1">
                                                <Card className="h-full rounded-lg border-none"> {/* Added 'border-none' */}
                                                    <CardContent className="flex items-center justify-center h-full p-0">
                                                        <img
                                                            src={pic}
                                                            alt={`Product Image ${index + idx + 1}`}
                                                            className="object-cover w-full h-full rounded-lg"
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                </CarouselItem>
                            );
                        }
                        return null;
                    })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>



            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-left">{product.listingTitle}</h1>
                    <p className="text-2xl text-green-600 font-semibold text-left">${product.price.toFixed(2)} per {unitMapping[product.foodCategory] || "unit"}</p>
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
                    <p><strong>Food Category: </strong>{foodCategoryMapping[product.foodCategory] || product.foodCategory}</p>
                    <p><strong>Description: </strong>{product.description}</p>
                    <p><strong>Delivery Method: </strong>{deliveryMethodMapping[product.deliveryMethod] || product.deliveryMethod}</p>
                    {product.pickUpLocation && <p><strong>Pick Up Location: </strong>{product.pickUpLocation}</p>}
                    {product.weight != null && product.weight > 0 && (<p><strong>Weight: </strong>{product.weight} kg</p>)}
                    <p><strong>Minimum Purchase Quantity: </strong>{product.minPurchaseQty} {unitMapping[product.foodCategory] || "unit"}</p>
                </div>

                 {/* Bulk Pricing Section */}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Bulk Pricing</h2>
                    {product.bulkPricings && product.bulkPricings.length > 0 ? (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">Min Quantity</th>
                                    <th className="border border-gray-300 px-4 py-2">Max Quantity</th>
                                    <th className="border border-gray-300 px-4 py-2">Price per {unitMapping[product.foodCategory] || "unit"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.bulkPricings.map((pricing, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-4 py-2">{pricing.minQuantity}</td>
                                        <td className="border border-gray-300 px-4 py-2">{pricing.maxQuantity || 'No limit'}</td>
                                        <td className="border border-gray-300 px-4 py-2">${pricing.price.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No bulk pricing available for this product.</p>
                    )}
                </div>

                <div className="mt-6 mb-6 flex justify-end space-x-2">
                    <button className="button button-orange"
                        onClick={handleEdit}
                    >
                        <EditIcon className="mr-2" /> Edit
                    </button>
                    <button
                        className="button button-red"
                        onClick={handleClickOpen}
                    >
                        <DeleteIcon className="mr-2" /> Delete
                    </button>
                </div>

                {/* Batches Section */}
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold">Batches</h2>
                        <button className="button button-green"
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
                                    <p>{batch.quantity} {unitMapping[product.foodCategory] || "unit"}</p>
                                    <p className="font-semibold">Best Before Date</p>
                                    {batch.bestBeforeDate ? formatDisplayDate(batch.bestBeforeDate) : ''}
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
                            onClick={handleConfirmDeactivate}
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
                            id="bestBeforeDate"
                            label="Best Before Date"
                            type="date"
                            fullWidth
                            variant="standard"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={newBatchBestBeforeDate}
                            onChange={handleDateChange}
                            inputProps={{
                                min: getTodayDate(),
                            }}
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
