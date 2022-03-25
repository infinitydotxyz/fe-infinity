import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Button, OrderDrawer } from '../../src/components';

const Market: NextPage = () => {
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  return (
    <div>
      <Head>
        <title>Market</title>
        <meta name='description' content='Infinity NFT marketplace' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='m-10'>
        <h1>Market</h1>

        <OrderDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

        <Button onClick={() => setCartOpen(true)}>Cart</Button>
      </main>
    </div>
  );
};

export default Market;
