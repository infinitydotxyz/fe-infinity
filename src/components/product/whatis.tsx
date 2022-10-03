import { twMerge } from 'tailwind-merge';

export const WhatIs = () => {
  const title = 'text-xl font-bold my-4';
  const paragraph = 'text-md my-2';

  return (
    <div className="max-w-lg  mx-auto">
      <div className={twMerge(title, '')}>What is Infinity?</div>

      <div className={twMerge(title, '')}>Vision</div>

      <div className={twMerge(paragraph, '')}>
        NFTs are a new way to represent ownership of digital goods, services, and identities. They are the first truly
        mainstream use case for blockchains. At Infinity, our vision is to build a holistic platform that brings NFTs to
        10s of millions of people including flippers, collectors, creators, and fan communities. We believe that NFTs
        haven&rsquo;t even scratched the surface of what they can represent.
      </div>

      <div className={twMerge(title, '')}>Mission</div>

      <div className={twMerge(paragraph, '')}>
        We have a bold mission: facilitate trading 99,999,999 NFTs on our platform. Everyone will have a need to trade
        NFTs as they enter the mainstream. A social, engaging experience will be critical to onboarding new people to
        NFTs. While we are initially solving for the current market predominantly consisting of traders, our mission is
        to be the platform and protocol that will onboard the next 100M people to NFTs whose personas go beyond that of
        a trader.
      </div>

      <div className={twMerge(title, '')}>A Social platform</div>
      <div className={twMerge('')}>
        <div className={twMerge(paragraph, '')}>
          NFTs are inherently social products. Whether people buy them for quick flipping/being part of a
          community/membership access, they do it largely based on what other people are doing. So a distributor of NFTs
          (like a marketplace) needs to be inherently social and have community features. This is why we believe the top
          generalized marketplace distributor slot is far from permanently taken. See more at{' '}
        </div>
        <div className={twMerge('')}>
          <a
            className={twMerge('')}
            href="https://www.google.com/url?q=https://docs.google.com/document/d/1nV6qyikeUwBjst44lCQi-SSEdAQOub8x3tovL6YuIb0/edit%23&amp;sa=D&amp;source=editors&amp;ust=1663401522274084&amp;usg=AOvVaw2Ea7vp_iLYX1vKkF9wQdxt"
          >
            Infinity Social
          </a>
        </div>
      </div>
      <div className={twMerge(title, '')}>Building for communities</div>
      <div className={twMerge(paragraph, '')}>
        Building for communities is at the heart of what we do. Communities are what drive a lot of activity in the NFT
        space. Unfortunately no platform currently treats communities like the first class citizens they are. Infinity
        is building a number of tools that enable people to discover, evaluate, join and participate in communities. See
        more at{' '}
      </div>
      <div className={twMerge('')}>
        <a
          className={twMerge('')}
          href="https://www.google.com/url?q=https://docs.google.com/document/d/1c_YNyGme1GbD3gaxDrz-a80Tf4w90hczyIYd7nDZVrc/edit&amp;sa=D&amp;source=editors&amp;ust=1663401522274496&amp;usg=AOvVaw2tQ-ObDJ2WvwRrdZCmCYyk"
        >
          Infinity Communities
        </a>
      </div>

      <div className={twMerge(title, '')}>Beta Release</div>

      <div className={twMerge('')}>Infinity is launching both a protocol and a marketplace. </div>

      <div className={twMerge('')}>
        <div className={twMerge('')}>
          The protocol is designed for complete trading flexibility with instant order execution sans user intervention.
          See more at{' '}
        </div>
        <div className={twMerge('')}>
          <a
            className={twMerge('')}
            href="https://www.google.com/url?q=https://docs.google.com/document/d/1wDz1nu-igheeogMIVKrwwZEm7GOw9mpErjKI-4nD_4Y/edit%23&amp;sa=D&amp;source=editors&amp;ust=1663401522275158&amp;usg=AOvVaw2vXUuGirG3Db8SX4vK5zCx"
          >
            Orderbook documentation
          </a>
        </div>
      </div>
      <div className={twMerge('')}>
        <div className={twMerge('')}>Advanced order types allow traders to make orders based on the following:</div>
      </div>
      <div className={twMerge('')}>
        <div className={twMerge('')}></div>
      </div>
      <ul className={twMerge('')}>
        <li className={twMerge('')}>
          <div className={twMerge('')}>Set orders</div>
        </li>
        <li className={twMerge('')}>
          <div className={twMerge('')}>Collection-level orders and Multi Collection-level orders</div>
        </li>
        <li className={twMerge('')}>
          <div className={twMerge('')}>Flexible pricing on orders</div>
        </li>
      </ul>

      <div className={twMerge('')}>
        As a result, the Infinity protocol creates more efficient and liquid NFT markets. It is initially being used by
        the Infinity marketplace at launch.
      </div>

      <div className={twMerge('')}>Why the Beta is Awesome</div>

      <div className={twMerge(title, '')}>Marketplace</div>

      <div className={twMerge(paragraph, '')}>
        While the features are advanced, the Infinity marketplace is easy to use. Any trader can simply enter in their
        criteria for an order (or multiple orders at a time) and set a range of prices for each before checking out. The
        orders will then automatically execute whenever there is a match within the specified time the order is open.{' '}
      </div>

      <div className={twMerge(paragraph, '')}>
        Traders that use the marketplace can create their own profiles, view the profiles and activity of others, and
        follow along with top traders. These will be the foundation for a more social trading experience across the
        platform in the future.
      </div>

      <div className={twMerge(title, '')}>Protocol</div>

      <div className={twMerge(paragraph, '')}>
        An order book of built up demand and supply based on range pricing creates better price discovery and arbitrage
        opportunities for NFTs across the entire market. Any project that leverages the protocol can make trades that
        use this matching engine and the corresponding price data.
      </div>

      <div className={twMerge(paragraph, '')}>
        Projects across the Ethereum ecosystem can implement it to create more efficiency and liquidity within their own
        marketplaces. The contracts are modular and extendable for anyone to add order &lsquo;strategies.&rsquo; These
        will make it easier to implement custom buy and sell features.{' '}
      </div>

      <div className={twMerge(paragraph, '')}>
        Keeping trader costs low is also a priority. We implemented novel uses of flashbots and batch transactions to
        save significant gas costs when trading.
      </div>

      <div className={twMerge(title, '')}>Token and Curation</div>

      <div className={twMerge('')}>See more info on tokenomics and curation </div>
      <div className={twMerge('')}>
        <a
          className={twMerge('')}
          href="https://www.google.com/url?q=https://docs.google.com/document/d/1BCghJ7M6FjiBMNpj9X8JPI8Z43HHWWPdg8dMe4yy8I8/edit%23heading%3Dh.u42gr5otcndn&amp;sa=D&amp;source=editors&amp;ust=1663401522276986&amp;usg=AOvVaw1eVQkvHhysRbikUOOVM8PG"
        >
          here
        </a>
      </div>

      <div className={twMerge(title, '')}>How this fits into our larger mission</div>

      <div className={twMerge(paragraph, '')}>
        Appealing to the current market of traders with the protocol and marketplace allows us to solve the most
        immediate challenges. After the initial release we will focus on creating a more social experience, which will
        appeal to a larger market beyond these hardcore traders.
      </div>
    </div>
  );
};
