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
