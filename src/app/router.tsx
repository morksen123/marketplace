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
      const { CreateListingRoute } = await import('./routes/create-product-listing');
      return { Component: CreateListingRoute };
    },
  },
];

const router = createBrowserRouter(routes);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
