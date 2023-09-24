import { Button } from '../common';

export const TwitterLink = ({
  tweetText,
  linkText,
  onOpen
}: {
  tweetText: string;
  linkText: string;
  onOpen: () => void;
}) => {
  const encodedTweet = encodeURIComponent(tweetText);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTweet}`;

  const handleButtonClick = () => {
    onOpen();
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return <Button onClick={handleButtonClick}>{linkText}</Button>;
};
