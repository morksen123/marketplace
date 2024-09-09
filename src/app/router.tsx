import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

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
    path: '*',
    lazy: async () => {
      const { NotFoundRoute } = await import('./routes/not-found');
      return { Component: NotFoundRoute };
    },
  },
  {
    path: '/create-product-listing',
    lazy: async () => {
      const { CreateProductListingRoute } = await import('./routes/create-product-listing');
      return { Component: CreateProductListingRoute };
    }
  },
  {
    path: '/view-product-listing',
    lazy: async () => {
      const { ViewProductListingRoute } = await import('./routes/view-product-listing');
      return { Component: ViewProductListingRoute };
    }
  },
  {
    path: '/edit-product-listing',
    lazy: async () => {
      const { EditProductListingRoute } = await import('./routes/edit-product-listing');
      return { Component: EditProductListingRoute };
    }
  },
  {
    path: '/buyer-home',
    lazy: async () => {
      const { BuyerHomeRoute } = await import('./routes/buyer-home');
      return { Component: BuyerHomeRoute };
    },
  },
  {
    path: '/distributor-home',
    lazy: async () => {
      const { DistributorHomeRoute } = await import('./routes/distributor-home');
      return { Component: DistributorHomeRoute };
    },
  },
];

const router = createBrowserRouter(routes);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
