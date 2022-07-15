import React, { useEffect, useState } from 'react';
import { Navbar, Spacer, Header } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { useDrawerContext } from 'src/utils/context/DrawerContext';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { OrderDrawer } from '../market';
import { isPasswordModalNeeded, PasswordModal } from './password-modal';

// used in the Header
export const pageStyles = 'mx-auto desktop:w-5/6 desktop-sm:w-[95%] tabloid:w-[95%] mobile:w-[98%]';

interface Props {
  children?: React.ReactNode;
  title: string;
  showTitle?: boolean;
  className?: string;
  fullWidth?: boolean;
  rightToolbar?: JSX.Element;
}

export const PageBox = ({
  children,
  title,
  showTitle = true,
  fullWidth = false,
  className = '',
  rightToolbar
}: Props): JSX.Element => {
  const { chainId } = useAppContext();
  const { orderDrawerOpen, setOrderDrawerOpen } = useOrderContext();
  const { hasOrderDrawer } = useDrawerContext();
  const [renderPasswordModal, setRenderPasswordModal] = useState(false);

  useEffect(() => {
    setRenderPasswordModal(isPasswordModalNeeded());
  }, []);

  return (
    <div className="transition w-[100vw] h-[100vh] overflow-y-auto overflow-x-hidden justify-items-center">
      {renderPasswordModal ? (
        <PasswordModal isOpen={true} onClose={() => console.log} />
      ) : (
        <Header title={title}>
          {chainId !== '1' && (
            <div className="text-center bg-theme-gray-100 text-red-800 py-1">You are not on Ethereum network</div>
          )}

          <Navbar />

          <div className={`transition ${fullWidth ? 'w-full' : pageStyles}`}>
            {showTitle ? <PageHeader title={title} rightToolbar={rightToolbar} /> : null}

            <div className={`w-full ${className}`}>
              {children}

              {<OrderDrawer open={orderDrawerOpen && hasOrderDrawer()} onClose={() => setOrderDrawerOpen(false)} />}
            </div>

            {/* allows scroll so items aren't at the bottom of the screen  */}
            <div className="shrink-0" style={{ height: 300 }} />
          </div>
        </Header>
      )}
    </div>
  );
};

// ==================================================

type PageHeaderProps = {
  title?: string;
  rightToolbar?: JSX.Element;
};

export const PageHeader = ({ title, rightToolbar }: PageHeaderProps): JSX.Element => {
  return (
    <div className="flex flex-row items-center">
      <div className="font-medium text-6xl tracking-tight mt-4 mb-8">{title}</div>

      {rightToolbar && (
        <>
          <Spacer />
          <div>{rightToolbar}</div>
        </>
      )}
    </div>
  );
};
