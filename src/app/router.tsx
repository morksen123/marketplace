import { ROLES } from '@/features/Authentication/types/auth';
import { AuthGuard, RoleGuard } from '@/lib/auth';
import { StripeWrapper } from '@/lib/stripe';
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { AppRoot } from './routes/app/root';

const routes: RouteObject[] = [
  {
    path: '/',
    lazy: async () => {
      const { LandingRoute } = await import('./routes/landing');
      return { Component: LandingRoute };
    },
  },
  {
    path: '/auth/register',
    lazy: async () => {
      const { RegisterRoute } = await import('./routes/auth/register');
      return { Component: RegisterRoute };
    },
  },
  {
    path: '/auth/verify',
    lazy: async () => {
      const { EmailVerificationPageRoute } = await import(
        './routes/auth/email-verification-confirmation-route'
      );
      return { Component: EmailVerificationPageRoute };
    },
  },
  {
    path: '/auth/forgot-password',
    lazy: async () => {
      const { ForgotPasswordRoute } = await import(
        './routes/auth/forgot-password'
      );
      return { Component: ForgotPasswordRoute };
    },
  },
  {
    path: '/auth/reset-password',
    lazy: async () => {
      const { ResetPasswordRoute } = await import(
        './routes/auth/reset-password'
      );
      return { Component: ResetPasswordRoute };
    },
  },
  {
    path: '/distributor/retry/:connectedAccountId',
    lazy: async () => {
      const { RetryOnboarding } = await import(
        './routes/auth/stripe-retry-onboarding'
      );
      return { Component: RetryOnboarding };
    },
  },
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        element: <AppRoot />,
        children: [
          {
            element: <RoleGuard allowedRoles={[ROLES.BUYER]} />,
            children: [
              {
                path: '/buyer/home',
                lazy: async () => {
                  const { BuyerHomeRoute } = await import(
                    './routes/app/home/buyer-home'
                  );
                  return { Component: BuyerHomeRoute };
                },
              },
              {
                path: '/buyer/search',
                lazy: async () => {
                  const { SearchResultsRoute } = await import(
                    './routes/app/search/search-results'
                  );
                  return { Component: SearchResultsRoute };
                },
              },
              {
                path: '/buyer/sale',
                lazy: async () => {
                  const { BuyerSaleRoute } = await import(
                    './routes/promotions/buyer-sale'
                  );
                  return { Component: BuyerSaleRoute };
                },
              },
              {
                path: '/buyer/view-product/:productId',
                lazy: async () => {
                  const { ViewProductListingBuyerRoute } = await import(
                    './routes/app/search/view-product-listing-buyer'
                  );
                  return { Component: ViewProductListingBuyerRoute };
                },
              },
              {
                path: '/buyer/profile/my-addresses',
                lazy: async () => {
                  const { ShippingAddressesPage } = await import(
                    './routes/buyerProfile/shipping-addresses'
                  );
                  return { Component: ShippingAddressesPage };
                },
              },
              {
                path: '/buyer/profile',
                lazy: async () => {
                  const { ProfileManagementRoute } = await import(
                    './routes/buyerProfile/profile-management'
                  );
                  return { Component: ProfileManagementRoute };
                },
              },
              {
                path: '/buyer/transactions',
                lazy: async () => {
                  const { TransactionsRoute } = await import(
                    './routes/buyerProfile/transactions'
                  );
                  return { Component: TransactionsRoute };
                },
              },
              {
                path: '/buyer/profile/change-password',
                lazy: async () => {
                  const { ChangePasswordRoute } = await import(
                    './routes/buyerProfile/change-password'
                  );
                  return { Component: ChangePasswordRoute };
                },
              },
              {
                path: '/buyer/profile/account-deactivation',
                lazy: async () => {
                  const { AccountDeactivationRoute } = await import(
                    './routes/buyerProfile/account-deactivation'
                  );
                  return { Component: AccountDeactivationRoute };
                },
              },
              {
                path: '/buyer/cart',
                lazy: async () => {
                  const { CartRoute } = await import('./routes/cart/cart');
                  return { Component: CartRoute };
                },
              },
              {
                path: '/buyer/checkout',
                element: <StripeWrapper />,
                children: [
                  {
                    index: true,
                    lazy: async () => {
                      const { CheckoutRoute } = await import(
                        './routes/payment/checkout'
                      );
                      return { Component: CheckoutRoute };
                    },
                  },
                  {
                    path: 'complete',
                    lazy: async () => {
                      const { CheckoutComplete } = await import(
                        './routes/payment/checkout-complete'
                      );
                      return { Component: CheckoutComplete };
                    },
                  },
                ],
              },
              {
                path: '/buyer/profile/favourites',
                lazy: async () => {
                  const { FavouritesPageRoute } = await import(
                    './routes/buyerProfile/favourites-page'
                  );
                  return { Component: FavouritesPageRoute };
                },
              },
              {
                path: '/buyer/profile/chats',
                lazy: async () => {
                  const { ChatsRoute } = await import(
                    './routes/buyerProfile/chats'
                  );
                  return { Component: ChatsRoute };
                },
              },
              {
                path: '/buyer/faq',
                lazy: async () => {
                  const { BuyerFaqRoute } = await import(
                    './routes/faq/buyerFaq'
                  );
                  return { Component: BuyerFaqRoute };
                },
              },
              {
                path: '/buyer/orders',
                lazy: async () => {
                  const { BuyerOrdersRoute } = await import(
                    './routes/buyerProfile/buyer-orders'
                  );
                  return { Component: BuyerOrdersRoute };
                },
              },
            ],
          },
          {
            element: <RoleGuard allowedRoles={[ROLES.DISTRIBUTOR]} />,
            children: [
              {
                path: '/distributor/home',
                lazy: async () => {
                  const { DistributorHomeRoute } = await import(
                    './routes/app/home/distributor-home'
                  );
                  return { Component: DistributorHomeRoute };
                },
              },
              // Add other distributor-specific routes here
              {
                path: '/distributor/profile',
                lazy: async () => {
                  const { ProfileManagementRoute } = await import(
                    './routes/distributorProfile/profile-management'
                  );
                  return { Component: ProfileManagementRoute };
                },
              },
              {
                path: '/create-product-listing',
                lazy: async () => {
                  const { CreateProductListingRoute } = await import(
                    './routes/create-product-listing'
                  );
                  return { Component: CreateProductListingRoute };
                },
              },
              {
                path: '/edit-product-listing/:productId',
                lazy: async () => {
                  const { EditProductListingRoute } = await import(
                    './routes/edit-product-listing'
                  );
                  return { Component: EditProductListingRoute };
                },
              },
              {
                path: '/inventory-management',
                lazy: async () => {
                  const { InventoryManagementRoute } = await import(
                    './routes/inventoryManagment/inventory-management'
                  );
                  return { Component: InventoryManagementRoute };
                },
              },
              {
                path: '/distributor/profile/change-password',
                lazy: async () => {
                  const { ChangePasswordRoute } = await import(
                    './routes/distributorProfile/change-password'
                  );
                  return { Component: ChangePasswordRoute };
                },
              },
              {
                path: '/distributor/profile/account-deactivation',
                lazy: async () => {
                  const { AccountDeactivationRoute } = await import(
                    './routes/distributorProfile/account-deactivation'
                  );
                  return { Component: AccountDeactivationRoute };
                },
              },
              {
                path: '/distributor/profile/chats',
                lazy: async () => {
                  const { ChatsRoute } = await import(
                    './routes/distributorProfile/chats'
                  );
                  return { Component: ChatsRoute };
                },
              },
              {
                path: '/distributor/promotions',
                lazy: async () => {
                  const { ViewDistributorPromotionsRoute } = await import(
                    './routes/promotions/view-distributor-promos'
                  );
                  return { Component: ViewDistributorPromotionsRoute };
                },
              },
              {
                path: '/distributor/promotions/:promotionId',
                lazy: async () => {
                  const { EditDistributorPromotionsRoute } = await import(
                    './routes/promotions/edit-promotion'
                  );
                  return { Component: EditDistributorPromotionsRoute };
                },
              },
              {
                path: '/distributor/promotions/create-promotion',
                lazy: async () => {
                  const { CreateDistributorPromotionsRoute } = await import(
                    './routes/promotions/create-promotion'
                  );
                  return { Component: CreateDistributorPromotionsRoute };
                },
              },
              {
                path: '/distributor/transactions',
                lazy: async () => {
                  const { TransactionsRoute } = await import(
                    './routes/distributorProfile/transactions'
                  );
                  return { Component: TransactionsRoute };
                },
              },
              {
                path: '/distributor/view-boosted-products',
                lazy: async () => {
                  const { ViewBoostedProductsRoute } = await import(
                    './routes/promotions/view-boosted-products'
                  );
                  return { Component: ViewBoostedProductsRoute };
                },
              },
              {
                path: '/distributor/faq',
                lazy: async () => {
                  const { DistributorFaqRoute } = await import(
                    './routes/faq/distributorFaq'
                  );
                  return { Component: DistributorFaqRoute };
                },
              },
              {
                path: '/distributor/sales',
                lazy: async () => {
                  const { SalesRoute } = await import('./routes/payment/sales');
                  return { Component: SalesRoute };
                },
              },
              {
                path: '/distributor/orders',
                lazy: async () => {
                  const { DistributorOrdersRoute } = await import(
                    './routes/orders/distributor-orders'
                  );
                  return { Component: DistributorOrdersRoute };
                },
              },
              {
                path: '/distributor/orders/:orderId',
                lazy: async () => {
                  const { DistributorOrderDetailsRoute } = await import('./routes/orders/distributor-order-details');
                  return { Component: DistributorOrderDetailsRoute };
                },
              },
            ],
          },
          // You can add more role-specific sections here
        ],
      },
      {
        path: '/transactions/:transactionId',
        lazy: async () => {
          const { TransactionDetailsPage } = await import(
            './routes/payment/transaction-details'
          );
          return { Component: TransactionDetailsPage };
        },
      },
      {
        path: '/view-product-listing/:productId',
        lazy: async () => {
          const { ViewProductListingRoute } = await import(
            './routes/view-product-listing'
          );
          return { Component: ViewProductListingRoute };
        },
      },
    ],
  },
  {
    path: '*',
    lazy: async () => {
      const { NotFoundRoute } = await import('./routes/not-found');
      return { Component: NotFoundRoute };
    },
  },
];

const router = createBrowserRouter(routes);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
