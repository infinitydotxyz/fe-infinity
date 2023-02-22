import { useCallback, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { Canvas, useThree } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import { Heading } from 'src/components/common';
import { AButton } from 'src/components/astra/astra-button';
import { DiscordIconLink, TwitterIconLink } from 'src/components/landing/icons';
const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial);

const MyScene = ({ isLoading, isComplete }: { isLoading: boolean; isComplete: boolean }) => {
  const [springs, api] = useSpring(
    () => ({
      scale: 1,
      position: [0, 0],
      color: '#ff6d6d',
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
    []
  );

  const handleClick = useCallback(() => {
    let clicked = false;

    return () => {
      clicked = !clicked;
      api.start({});
    };
  }, []);

  return (
    <animated.mesh onClick={handleClick()} scale={springs.scale} position={springs.position.to((x, y) => [x, y, 0])}>
      <torusBufferGeometry args={[1.5, 0.5, 256, 256]} />
      <AnimatedMeshDistortMaterial
        speed={isComplete ? 5 : 10}
        distort={isLoading ? 0.3 : 0.25}
        color={isComplete ? '#569AFF' : '#ff6d6d'}
      />
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
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&hashtags=FLOW,FLUR`, '_blank');
  };

  const blurbs = [
    '"Flow is the baddest marketplace on the planet" - Milk Road',
    '"Flow is the meanest listing sniper in the game" - The Daily Gwei',
    '"Flow it the best place to bid on NFTs" - nftnow',
    '"The world\' only marketplace with an auto executing orderbook" - Arthur Hayes',
    '"Flow, the blockchain for open worlds" - Roham Gharegozlou'
  ];

  return (
    <div className="mx-40 mt-20 w-fill">
      <div className="mt-20">
        <Heading className=" text-center">Flow</Heading>
        <Spinner isLoading={isSubmitting} isComplete={isComplete} />
      </div>
      <div>
        {blurbs.map((blurb, index) => (
          <p className="text-lg my-5" key={`${index}`}>
            {blurb}
          </p>
        ))}

        <p className="text-sm my-5">
          <i>*These were not said but what is said is true.</i>
        </p>
        <p className="text-sm my-5">
          <i>
            **Except for the last one. That was said. But flow.so ≠ flow.com. We might fuck around and build an NFT
            chain though.
          </i>
        </p>
      </div>

      <div>
        <div className="flex flex-col items-center justify-center h-full">
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
    </div>
  );
};

export default HomePage;
