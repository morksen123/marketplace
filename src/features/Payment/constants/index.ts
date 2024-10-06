interface Payment {
  id: string;
  transactionId: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  orderItems: OrderItem[];
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export const dummyData: Payment[] = [
  {
    id: '1',
    transactionId: 'TRX123456',
    date: '2023-05-15',
    amount: 150.75,
    status: 'completed',
    orderItems: [
      { id: 'item1', name: 'Product A', quantity: 2, price: 50.25 },
      { id: 'item2', name: 'Product B', quantity: 1, price: 50.25 },
    ],
  },
  {
    id: '2',
    transactionId: 'TRX789012',
    date: '2023-05-14',
    amount: 75.5,
    status: 'completed',
    orderItems: [{ id: 'item3', name: 'Product C', quantity: 1, price: 75.5 }],
  },
  {
    id: '3',
    transactionId: 'TRX345678',
    date: '2023-05-13',
    amount: 200.0,
    status: 'pending',
    orderItems: [{ id: 'item4', name: 'Product D', quantity: 2, price: 100.0 }],
  },
];

export const ITEMS_PER_PAGE = 6;
