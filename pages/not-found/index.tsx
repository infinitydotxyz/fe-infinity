import type { FC } from 'react';
import { PageBox } from 'src/components/common';

export const NotFound: FC = () => {
  return (
    <PageBox title="Error: Not Found">
      <h6>Not Found</h6>
    </PageBox>
  );
};

export default NotFound;
