import { APageBox } from 'src/components/astra/astra-page-box';

const NotFound404Page = () => {
  return (
    <APageBox title="404 Not Found" showTitle={false}>
      <div className="h-70vh flex flex-col items-center justify-center">
        <div className="mt-4 text-3xl">This page could not be found</div>
      </div>
    </APageBox>
  );
};

export default NotFound404Page;
