import { CenteredContent } from 'src/components/common';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

const HomePage = () => {
  return (
    <div className="h-screen">
      <CenteredContent>
        <div className="space-y-4">
          <div className="flex justify-center text-6xl font-heading font-bold mb-10">Flow</div>
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
        </div>
      </CenteredContent>
    </div>
  );
};

export default HomePage;
