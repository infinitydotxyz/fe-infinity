import { CenteredContent, Spinner } from 'src/components/common';
import { twMerge } from 'tailwind-merge';

interface Props2 {
  error: boolean;
  noData: boolean;
  message?: string;
}

export const ErrorOrLoading = ({ error, noData, message = 'Nothing found' }: Props2) => {
  let contents;

  if (error) {
    contents = <div className="text-sm">Unable to load data</div>;
  } else {
    if (noData) {
      contents = <div className="text-sm">{message}</div>;
    } else {
      contents = <Spinner />;
    }
  }

  return (
    <div className={twMerge('h-full w-full text-sm')}>
      <CenteredContent>{contents}</CenteredContent>
    </div>
  );
};
