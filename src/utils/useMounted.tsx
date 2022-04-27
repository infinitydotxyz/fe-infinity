import React from 'react';

// https://github.com/vercel/next.js/issues/8998#issuecomment-904294718

// not sure if this is useful, but keeping for reference

export const useMounted = () => {
  const [hasMounted, setHasMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
};

// <NextJSFixer>
// <div>My divs</div>
// </NextJSFixer>;

// interface Props {
//   children: ReactNode;
// }

// const NextJSFixer = ({ children }: Props) => {
// const hasMounted = useMounted();
// if (!hasMounted) {
//   return null;
// }

//   return <div>{children}</div>;
// };
