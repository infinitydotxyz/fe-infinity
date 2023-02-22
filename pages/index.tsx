import { useState } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { Canvas } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import { CenteredContent, Heading } from 'src/components/common';
import { AButton } from 'src/components/astra/astra-button';
import { DiscordIconLink, TwitterIconLink } from 'src/components/landing/icons';
import { twMerge } from 'tailwind-merge';
import { secondaryTextColor } from 'src/utils/ui-constants';
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

const HomePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleClaim = () => {
    setIsSubmitting(true);
    // Handle the claim here
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
    }, 10_000);
  };

  const tweetText = `I just claimed the $FLUR airdrop by @flowdotso. $FLUR will be converted to $FLOW when Flow launches. $FLUR holders will also get access to Flow beta. Follow us on twitter and join our discord at https://discord.gg/flowdotso to keep up. Good stuff brewing.`;
  const sendTweet = () => {
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  return (
    <div className="h-screen">
      <CenteredContent>
        <div className="space-y-4">
          <div className="relative">
            <span className="h-[100px] w-[100px] absolute left-40 bottom-0.5 ">
              <Spinner isLoading={isSubmitting} isComplete={isComplete} />
            </span>
            <div className="flex justify-center text-6xl font-heading font-bold">Flow</div>
          </div>

          <div>"Flow is the baddest marketplace on the planet" - Milk Road</div>
          <div>"Flow has the meanest listing sniper in the game" - Metaversal</div>
          <div>"Flow is the best place to bid on NFTs" - nftnow</div>
          <div>"Flow has no txns, only signatures" - 0age</div>
          <div>"The world's only marketplace with auto executing orderbook" - Arthur Hayes</div>
          <div>"These chads figured out vampired liquidity without incentives" - Chef Nomi</div>
          <div>"Flow, the blockchain for open worlds" - Roham Gharegozlou</div>
          <div className={twMerge('text-xs font-medium italic', secondaryTextColor)}>
            *These were not said but what is said is true.
          </div>
          <div className={twMerge('text-xs font-medium italic', secondaryTextColor)}>
            **Except for the last one. That was said. But flow.so ≠ flow.com. We might fuck around and build an NFT
            chain though.
          </div>

          <div className="flex flex-col items-center justify-center h-full mb-40">
            <Heading as="h4" className="mb-4">
              Claim your $FLUR
            </Heading>

            <AButton primary onClick={handleClaim} disabled={isSubmitting || isComplete}>
              Claim
            </AButton>
          </div>
          <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-x-2 mt-20">
            <div className="flex items-center space-x-6">
              <DiscordIconLink />
              <span className="mt-1">
                <TwitterIconLink />
              </span>
              <AButton primary onClick={sendTweet} highlighted>
                Excited?
              </AButton>
            </div>
          </div>
        </div>
      </CenteredContent>
    </div>
  );
};

export default HomePage;
