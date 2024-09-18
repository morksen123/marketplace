import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import { Carousel, CarouselItem, CarouselContent, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { useNavigate, useParams } from 'react-router-dom';
import { foodCategoryMapping, foodConditionMapping, deliveryMethodMapping, unitMapping, Product, Batch } from '@/features/ProductListing/constants';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface ViewProductListingBuyerProps {
  isBuyer: boolean;
}

export const ViewProductListingBuyer: React.FC<ViewProductListingBuyerProps> = ({ isBuyer }) => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [isFavourite, setIsFavourite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const buyerId = 1; // To change

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/product/${productId}`);
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
            if (isBuyer) {
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
            }
        };

        fetchProduct();
        checkFavourited();
    }, [productId, isBuyer]);

    const handleToggleFavourite = async () => {
        if (!isBuyer) return;

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

    const handleAddToCart = async () => {
        // Implement add to cart functionality
        alert(`Added ${quantity} ${unitMapping[product?.foodCategory] || 'unit(s)'} to cart`);
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
                                                <Card className="h-full rounded-lg border-none">
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

                {isBuyer && (
                    <button onClick={handleToggleFavourite} className="flex items-center">
                        <FavoriteOutlinedIcon style={{ color: isFavourite ? 'red' : 'gray', fontSize: '28px' }} />
                    </button>
                )}
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

                {isBuyer && (
                    <div className="mt-6 mb-6 flex justify-end space-x-2">
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                            className="border rounded px-2 py-1 w-16"
                            min="1"
                        />
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 flex items-center"
                            onClick={handleAddToCart}
                        >
                            <AddShoppingCartIcon className="mr-2" /> Add to Cart
                        </button>
                    </div>
                )}

                {/* Batches Section */}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Available Batches</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {batches.map((batch, index) => (
                            <Card key={index} className="flex items-center">
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
            </div>
        </div>
    );
};