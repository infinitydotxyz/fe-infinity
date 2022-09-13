import { EventType, EventTypeNames } from '@infinityxyz/lib-frontend/types/core/feed';
import React from 'react';
import { Checkbox, PopoverButton } from 'src/components/common';

interface Props {
  activityTypes: Array<EventType>;
  onChange: (checked: boolean, checkId: string) => void;
}

export const ActivityFilter = ({ activityTypes, onChange }: Props) => {
  return (
    <PopoverButton title="Filter">
      {[EventType.NftSale, EventType.NftListing, EventType.NftOffer].map((type: EventType) => {
        const typeName = EventTypeNames[type];
        const label = `${typeName.charAt(0).toUpperCase() + typeName.slice(1)}s`;

        return (
          <Checkbox
            key={type}
            label={label}
            checked={activityTypes.indexOf(type) >= 0}
            onChange={(checked) => onChange(checked, type)}
            boxOnLeft={false}
          />
        );
      })}
    </PopoverButton>
  );
};
