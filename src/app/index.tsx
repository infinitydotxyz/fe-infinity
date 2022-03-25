import type { FunctionComponent } from 'react';
import { useRoutes } from 'react-router-dom';
import getRoutes from '../routes';

const App: FunctionComponent = () => {
  const content = useRoutes(getRoutes());

  return <div>{content}</div>;
};

export default App;
