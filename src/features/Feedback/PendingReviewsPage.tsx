import { Button } from '@/components/ui/button';
import { sampleOrders } from '@/mock-data';
import { ChevronRight, Clock, Package } from 'lucide-react';
import { useState } from 'react';
import { BulkReviewModal } from './BulkReviewModal';
import { SingleItemReview } from './SingleItemReview';

const pendingOrders = [
  {
    id: 'ORD-123',
    deliveryDate: 'Today, 2:30 PM',
    items: [
      {
        id: 1,
        name: 'Imperfect Apples',
        quantity: '1kg',
        price: '$2.99',
        image: '/api/placeholder/80/80',
      },
      {
        id: 2,
        name: 'Odd Shaped Carrots',
        quantity: '500g',
        price: '$1.99',
        image: '/api/placeholder/80/80',
      },
    ],
  },
  {
    id: 'ORD-124',
    deliveryDate: 'Today, 3:15 PM',
    items: [
      {
        id: 3,
        name: 'Bruised Bananas',
        quantity: '1kg',
        price: '$2.49',
        image: '/api/placeholder/80/80',
      },
    ],
  },
];

export const PendingReviewsPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isBulkReviewModalOpen, setIsBulkReviewModalOpen] = useState(false);
  const [isSingleItemReviewOpen, setIsSingleItemReviewOpen] = useState(false);

  const handleReviewClick = (item, orderId) => {
    setSelectedItem(item);
    setIsSingleItemReviewOpen(true);
    setSelectedOrderId(orderId);
  };

  const handleCloseReview = () => {
    setSelectedItem(null);
    setSelectedOrderId(null);
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      // Call your API to submit the review
      // await reviewService.createReview(reviewData);
      // Refresh the pending reviews list
      // You might want to remove the reviewed item from the list
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <div className="py-1 text-left">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Pending Reviews</h1>
          <p className="text-sm text-gray-600 mt-1">
            Your reviews help reduce food waste by helping others make informed
            decisions
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {pendingOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow">
              {/* Order Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package className="text-gray-400 h-5 w-5" />
                    <div>
                      <span className="font-medium">Order #{order.id}</span>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Delivered {order.deliveryDate}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsBulkReviewModalOpen(true)}
                    variant={'secondary'}
                  >
                    Review All Items
                  </Button>
                </div>
              </div>

              {/* Order Items */}
              <div className="divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <button
                            onClick={() => handleReviewClick(item, order.id)}
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <span>Write Review</span>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="p-4 bg-blue-50 rounded-b-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-secondary">
                    Your reviews help save {order.items.length} items from waste
                  </span>
                  <span className="text-gray-600">
                    {order.items.length} items pending review
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedItem && (
        <SingleItemReview
          item={selectedItem}
          orderId={selectedOrderId}
          isOpen={isSingleItemReviewOpen}
          onClose={() => setIsSingleItemReviewOpen(false)}
          onSubmit={() => {}}
        />
      )}

      <BulkReviewModal
        orders={sampleOrders}
        isOpen={isBulkReviewModalOpen}
        onClose={() => setIsBulkReviewModalOpen(false)}
      />
    </div>
  );
};
