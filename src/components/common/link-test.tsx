import Linkify from '@amit.rajput/react-linkify';

interface Props {
  text: string;
}
export const LinkText = ({ text }: Props) => {
  // convert \n to '<br />'
  const escapedNewLineToLineBreakTag = (str: string) => {
    return str.split('\n').map((item, index) => {
      return index === 0 ? (
        <Linkify key={index + 1000}>{item}</Linkify>
      ) : (
        [<br key={index} />, <Linkify key={index + 2000}>{item}</Linkify>]
      );
    });
  };

  // className colors all a tags with blue
  return <div className="[&_a]:text-blue-500">{escapedNewLineToLineBreakTag(text)}</div>;
};
