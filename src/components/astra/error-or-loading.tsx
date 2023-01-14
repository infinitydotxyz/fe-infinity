import { CenteredContent, Spinner } from 'src/components/common';
import { twMerge } from 'tailwind-merge';

interface Props2 {
  error: boolean;
  noData: boolean;
  message?: string;
}

export const ErrorOrLoading = ({ error, noData, message = 'No Data' }: Props2) => {
  let contents;

  if (error) {
    contents = <div className="text-sm">No Data</div>;
  } else {
    if (noData) {
      contents = <div className="text-sm">{message}</div>;
    } else {
      contents = <Spinner />;
    }
  }

  return (
    <div className={twMerge('h-full w-full text-sm mt-4')}>
      <CenteredContent>{contents}</CenteredContent>
    </div>
  );
};
