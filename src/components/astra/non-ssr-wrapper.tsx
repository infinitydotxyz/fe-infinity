import dynamic from 'next/dynamic';
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

const NonSSRWrapper = (props: Props) => <React.Fragment>{props.children}</React.Fragment>;
export default dynamic(() => Promise.resolve(NonSSRWrapper), {
  ssr: false
});
