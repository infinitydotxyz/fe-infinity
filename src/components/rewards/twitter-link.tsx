import { AButton } from '../astra/astra-button';

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

  return (
    <AButton primary className={'text-base border-0 rounded-4 mt-2 font-semibold'} onClick={handleButtonClick}>
      {linkText}
    </AButton>
  );
};
