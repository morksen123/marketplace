import { ROLES } from '@/features/Authentication/types/auth';
import { AuthGuard, RoleGuard } from '@/lib/auth';
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
                lazy: async () => {
                  const { CheckoutRoute } = await import(
                    './routes/payment/checkout'
                  );
                  return { Component: CheckoutRoute };
                },
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
              // Add other buyer-specific routes here
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
            ],
          },
          // You can add more role-specific sections here
        ],
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
    path: '/view-product-listing/:productId',
    lazy: async () => {
      const { ViewProductListingRoute } = await import(
        './routes/view-product-listing'
      );
      return { Component: ViewProductListingRoute };
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
];

const router = createBrowserRouter(routes);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
