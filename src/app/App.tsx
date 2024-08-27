import { Suspense } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import { routes } from './routes';

const router = createBrowserRouter(routes);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
