import blueCheckImage from 'src/images/blue-check.png';

interface Props {
  hasBlueCheck?: boolean;
}

export function BlueCheckIcon({ hasBlueCheck = false }: Props): JSX.Element | null {
  return hasBlueCheck ? (
    <img className="w-5 h-5" src={blueCheckImage.src} alt={hasBlueCheck ? 'Verified' : ''} />
  ) : null;
}
