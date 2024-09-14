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
];

const router = createBrowserRouter(routes);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
