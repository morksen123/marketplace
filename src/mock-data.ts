import { OrderLineItem } from './features/Orders/types/orders';

export const orderLineItems: OrderLineItem[] = [
  {
    orderLineItemId: 1,
    quantity: 2,
    price: 29.99,
    productId: 101,
    orderId: 1001,
    productName: 'Wireless Earbuds',
    deliveryMethod: 'Home Delivery',
    pickUpLocation: '',
  },
  {
    orderLineItemId: 2,
    quantity: 1,
    price: 49.99,
    productId: 102,
    orderId: 1001,
    productName: 'Bluetooth Speaker',
    deliveryMethod: 'In-Store Pickup',
    pickUpLocation: 'Store #12',
  },
  {
    orderLineItemId: 3,
    quantity: 3,
    price: 15.99,
    productId: 103,
    orderId: 1002,
    productName: 'USB-C Cable',
    deliveryMethod: 'Home Delivery',
    pickUpLocation: '',
  },
  {
    orderLineItemId: 4,
    quantity: 1,
    price: 999.99,
    productId: 104,
    orderId: 1003,
    productName: 'Laptop',
    deliveryMethod: 'Home Delivery',
    pickUpLocation: '',
  },
  {
    orderLineItemId: 5,
    quantity: 2,
    price: 24.99,
    productId: 105,
    orderId: 1004,
    productName: 'Wireless Mouse',
    deliveryMethod: 'In-Store Pickup',
    pickUpLocation: 'Store #7',
  },
  {
    orderLineItemId: 6,
    quantity: 1,
    price: 49.99,
    productId: 106,
    orderId: 1005,
    productName: 'Keyboard',
    deliveryMethod: 'Home Delivery',
    pickUpLocation: '',
  },
  {
    orderLineItemId: 7,
    quantity: 5,
    price: 9.99,
    productId: 107,
    orderId: 1006,
    productName: 'Notebook',
    deliveryMethod: 'Home Delivery',
    pickUpLocation: '',
  },
  {
    orderLineItemId: 8,
    quantity: 2,
    price: 5.99,
    productId: 108,
    orderId: 1007,
    productName: 'Pen Set',
    deliveryMethod: 'In-Store Pickup',
    pickUpLocation: 'Store #5',
  },
  {
    orderLineItemId: 9,
    quantity: 1,
    price: 199.99,
    productId: 109,
    orderId: 1008,
    productName: 'Gaming Headset',
    deliveryMethod: 'Home Delivery',
    pickUpLocation: '',
  },
  {
    orderLineItemId: 10,
    quantity: 4,
    price: 19.99,
    productId: 110,
    orderId: 1009,
    productName: 'Water Bottle',
    deliveryMethod: 'In-Store Pickup',
    pickUpLocation: 'Store #9',
  },
];

export const sampleOrders = [
  {
    id: 'ORD-123',
    items: [
      { id: 1, name: 'Imperfect Apples', orderId: 'ORD-123' },
      { id: 2, name: 'Bruised Bananas', orderId: 'ORD-123' },
    ],
  },
  {
    id: 'ORD-124',
    items: [
      { id: 3, name: 'Odd-Shaped Carrots', orderId: 'ORD-124' },
      { id: 4, name: 'Overripe Tomatoes', orderId: 'ORD-124' },
    ],
  },
];

export const pendingReviewOrders = [
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
