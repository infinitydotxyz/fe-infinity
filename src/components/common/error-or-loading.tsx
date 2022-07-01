import { CenteredContent } from './centered-content';
import { Spinner } from './spinner';

interface Props2 {
  error: boolean;
  noData: boolean;
  message?: string;
}

export const ErrorOrLoading = ({ error, noData, message = 'Nothing found' }: Props2) => {
  let contents;

  if (error) {
    contents = <div>Unable to load data</div>;
  } else {
    if (noData) {
      contents = <div>{message}</div>;
    } else {
      contents = <Spinner />;
    }
  }

  return (
    <div className="h-full w-full dark:text-dark-body text-light-body">
      <CenteredContent>{contents}</CenteredContent>
    </div>
  );
};
