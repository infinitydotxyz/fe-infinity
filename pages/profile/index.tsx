import { useRouter } from 'next/router';
import { CenteredContent, ConnectButton } from 'src/components/common';
import { useAccount } from 'wagmi';

export default function Profile() {
  const { address } = useAccount();
  const router = useRouter();

  if (address) {
    router.replace(`/profile/${address}`);
  }

  return (
    <CenteredContent>
      <ConnectButton />
    </CenteredContent>
  );
}
