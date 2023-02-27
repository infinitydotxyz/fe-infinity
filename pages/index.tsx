import { animated, useSpring } from '@react-spring/three';
import { MeshDistortMaterial } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { AButton } from 'src/components/astra/astra-button';
import { CenteredContent, ConnectButton, ExternalLink, toastSuccess } from 'src/components/common';
import { DiscordIconLink, TwitterIconLink } from 'src/components/landing/icons';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useUserRewards } from 'src/hooks/api/useUserRewards';
import { useClaim } from 'src/hooks/contract/cm-distributor/claim';
import { nFormatter } from 'src/utils';
import { round } from '@infinityxyz/lib-frontend/utils';
import { ChainId, DistributionType } from '@infinityxyz/lib-frontend/types/core';
import { UserCumulativeRewardsDto } from '@infinityxyz/lib-frontend/types/dto';
import { useAccount, useNetwork, useWaitForTransaction } from 'wagmi';

const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial);

const MyScene = ({ isLoading, isComplete }: { isLoading: boolean; isComplete: boolean }) => {
  const [springs] = useSpring(
    () => ({
      scale: 1,
      position: [0, 0],
      color: isComplete ? '#569AFF' : '#ff6d6d',
      distort: isLoading ? 0.4 : 0.25,
      speed: isComplete ? 5 : 10,
      config: (key) => {
        switch (key) {
          case 'scale':
            return {
              mass: 4,
              friction: 10
            };
          case 'position':
            return { mass: 4, friction: 220 };
          default:
            return {};
        }
      }
    }),
    [isLoading, isComplete]
  );

  return (
    <animated.mesh scale={springs.scale} position={springs.position.to((x, y) => [x, y, 0])}>
      <torusBufferGeometry args={[1.5, 0.5, 256, 256]} />
      {/**
       * eslint-disable-next-line @typescript-eslint/ban-ts-comment
       * @ts-ignore */}
      <AnimatedMeshDistortMaterial speed={springs.speed} distort={springs.distort} color={springs.color} />
    </animated.mesh>
  );
};

function Spinner({ isLoading, isComplete }: { isLoading: boolean; isComplete: boolean }) {
  return (
    <Canvas>
      <ambientLight intensity={0.8} />
      <pointLight intensity={1} position={[0, 6, 0]} />
      <MyScene isLoading={isLoading} isComplete={isComplete} />
    </Canvas>
  );
}

const HomePageComponent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isClaimBtnDisabled, setIsClaimBtnDisabled] = useState(true);
  const { result: userRewards } = useUserRewards();
  const { claim } = useClaim();
  const { address: user } = useAccount();
  const { chain } = useNetwork();
  const chainId = String(chain?.id ?? 1) as ChainId;
  const [claimTxnHash, setClaimTxnHash] = useState('');

  useWaitForTransaction({
    hash: claimTxnHash as `0x${string}`
  });

  const handleClaim = async (props: UserCumulativeRewardsDto) => {
    setIsSubmitting(true);
    const { hash } = await claim({
      type: DistributionType.FLUR,
      account: props.account,
      cumulativeAmount: props.cumulativeAmount,
      merkleRoot: props.merkleRoot,
      merkleProof: props.merkleProof,
      contractAddress: props.contractAddress
    });
    toastSuccess('Sent txn to chain for execution');
    setClaimTxnHash(hash);
    setIsSubmitting(false);
    setIsComplete(true);
  };

  const tweetText = `I just claimed the $FLUR airdrop by @flowdotso. Holders will get access to Flow beta and
  allowlisted for the upcoming Goerli NFT mint. Follow us on twitter and join our discord at https://discord.gg/flowdotso to keep up.`;
  const sendTweet = () => {
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&hashtags=letthememesflow`, '_blank');
  };

  const claimedAmount = nFormatter(round(userRewards?.totals?.flurAirdrop.claim.claimedEth ?? 0), 2);
  const claimableAmount = nFormatter(round(userRewards?.totals?.flurAirdrop.claim.claimableEth ?? 0), 2);

  useEffect(() => {
    const alreadyClaimed = userRewards?.totals?.flurAirdrop.claim.claimedWei !== '0';

    const isClaimBtnDisabled =
      !user ||
      chainId !== ChainId.Mainnet ||
      isSubmitting ||
      isComplete ||
      alreadyClaimed ||
      userRewards?.totals?.flurAirdrop.claim.claimableWei === '0';

    setIsClaimBtnDisabled(isClaimBtnDisabled);
  }, [userRewards]);

  return (
    <div className="h-screen">
      <CenteredContent>
        <div className="space-y-4">
          <div className="flex text-6xl font-heading font-bold justify-center">
            <p>Flow</p>
            <div className="relative">
              <span className="h-[100px] w-[100px] absolute right-[140px] bottom-0.5">
                <Spinner isLoading={isSubmitting} isComplete={isComplete} />
              </span>
            </div>
          </div>

          <div>"Flow is the baddest marketplace on the planet" - Milk Road</div>
          <div>"Flow has the meanest listing sniper in the game" - Metaversal</div>
          <div>"Flow is the best place to bid on NFTs" - nftnow</div>
          <div>"Flow has no txns, only signatures" - 0age</div>
          <div>"Early FTX vibes from Flow in terms of inauthenticity and soulless greed" - 0xfoobar</div>
          <div>"Flow is the polar opposite of Blur" - H.H Tieshun Roquerre</div>
          <div>"The world's only marketplace with auto executing orderbook" - Arthur Hayes</div>
          <div>"These chads figured out vampired liquidity without incentives" - Chef Nomi</div>
          <div>"Flow, the blockchain for open worlds" - Roham Gharegozlou</div>
          <div className={twMerge('text-xs font-medium italic', secondaryTextColor)}>
            *These were not said but what is said is true.
          </div>
          <div className={twMerge('text-xs font-medium italic w-[500px]', secondaryTextColor)}>
            **Except for the last one. That was said. But flow.so ≠ flow.com. We might fuck around and build an NFT
            chain though.
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <ConnectButton className="p-3 rounded-lg" />
            <AButton
              primary
              onClick={() => {
                if (!userRewards) {
                  return;
                }
                handleClaim(userRewards.totals.flurAirdrop.claim);
              }}
              disabled={isClaimBtnDisabled}
              className="p-3 rounded-lg"
            >
              {claimedAmount && claimedAmount > 0 ? `Claimed ${claimedAmount} $FLUR` : `Claim ${claimableAmount} $FLUR`}
            </AButton>
            <AButton primary onClick={sendTweet} className="p-3 rounded-lg">
              Spread the meme
            </AButton>
          </div>

          <div className="flex items-center space-y-2 md:flex-row md:items-center md:space-x-4 text-sm">
            <div className="mt-2.5">
              <DiscordIconLink />
            </div>
            <TwitterIconLink />
            <div className="items-center flex">
              <ExternalLink href="https://docs.flow.so" className="underline">
                WTF is $FLUR?
              </ExternalLink>
            </div>
          </div>
        </div>
      </CenteredContent>
    </div>
  );
};

const HomePage = () => {
  return <HomePageComponent />;
};

export default HomePage;
