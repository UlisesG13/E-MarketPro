import { RouterProvider } from 'react-router-dom';
import { Providers } from './core/providers';
import { router } from './core/router';

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
