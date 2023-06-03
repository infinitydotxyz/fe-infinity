import React, { useContext, useState } from 'react';

export type SelectedCollectionType = {
  address: string;
  name: string;
  imageUrl: string;
};

type ProfileContextType = {
  selectedCollection: SelectedCollectionType | undefined;
  setSelectedCollection: (value: SelectedCollectionType | undefined) => void;
};

const ProfileContext = React.createContext<ProfileContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const ProfileContextProvider = ({ children }: Props) => {
  const [selectedCollection, setSelectedCollection] = useState<SelectedCollectionType>();

  const value: ProfileContextType = {
    selectedCollection,
    setSelectedCollection
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfileContext = (): ProfileContextType => {
  return useContext(ProfileContext) as ProfileContextType;
};
