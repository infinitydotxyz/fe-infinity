import React from 'react';
import { Button, PageBox } from 'src/components/common';
import notfound404 from 'src/images/notfound404.png';

const NotFoundPage = () => {
  return (
    <PageBox title="404 Not Found" showTitle={false}>
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <img src={notfound404.src} width={(notfound404.width * 2) / 3} height={(notfound404.height * 2) / 3} />
        <div>We haven't loaded this collection yet. Click the button to queue it up.</div>

        <Button className="font-heading mt-10">Start queue</Button>
      </div>
    </PageBox>
  );
};

export default NotFoundPage;
