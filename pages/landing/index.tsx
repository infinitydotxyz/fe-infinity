import React from 'react';
import { Header, Heading, pageStyles } from 'src/components/common';
import { ButtonTryBeta } from 'src/components/landing/ButtonTryBeta';
import { NavBar } from 'src/components/landing/NavBar';

const HomePage = () => {
  return (
    <div className="transition w-[100vw] h-[100vh] overflow-y-auto overflow-x-hidden justify-items-center">
      <Header title="Landing Page">
        <NavBar />
        <main className={`transition ${pageStyles} w-full`}>
          <section className="text-center space-y-5">
            <Heading className="font-body font-medium">
              The easiest way to <br /> trade NFTs
            </Heading>
            {/* NOTE: we don't have an exact 'grey' color like on the design, so gray-500 is used here instead */}
            <p className="font-body font-normal text-gray-500">
              Buy & sell with new advanced orders and flexible pricing
            </p>
            <ButtonTryBeta>Sign up for beta</ButtonTryBeta>
          </section>
          {/* TODO: content */}
          <article></article>
        </main>
      </Header>
    </div>
  );
};

export default HomePage;
