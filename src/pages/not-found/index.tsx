import type { FC } from 'react';
import { NotFoundPage } from './not-found-page';
import { Page } from '@components/page';

export const NotFound: FC = () => {
  return (
    <Page title="Error: Not Found">
      <NotFoundPage />
    </Page>
  );
};

export default NotFound;
