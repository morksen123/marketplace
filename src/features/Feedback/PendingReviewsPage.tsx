import { ChevronRight, Clock, Package, Star } from 'lucide-react';

export const PendingReviewsPage = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
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
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Review All Items
                  </button>
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
                          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <span>Write Review</span>
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Quick Rating Option */}
                        <div className="mt-4">
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Star
                                key={rating}
                                className="w-5 h-5 text-gray-300 cursor-pointer hover:text-yellow-400"
                              />
                            ))}
                            <span className="text-sm text-gray-500 ml-2">
                              Quick rate
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="p-4 bg-blue-50 rounded-b-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-600">
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
    </div>
  );
};
