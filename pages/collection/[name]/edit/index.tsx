import React from 'react';
import { Button } from 'src/components/common';
import logo from 'src/images/logo-mini-new.svg';

export default function EditCollectionPage() {
  return (
    <div className="transition w-[100vw] h-[100vh] overflow-y-auto">
      <header className="flex justify-between p-5">
        <img alt="logo" src={logo.src} width={logo.width} />
        <div className="flex flex-row space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </div>
      </header>
    </div>
  );
}
