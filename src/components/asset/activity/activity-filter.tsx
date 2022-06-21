import React from 'react';

import { EventType } from './activity-list';
import { Checkbox, PopoverButton } from 'src/components/common';

interface Props {
  activityTypes: Array<EventType>;
  onChange: (checked: boolean, checkId: string) => void;
}

export const ActivityFilter = ({ activityTypes, onChange }: Props) => {
  return (
    <PopoverButton title="Filter" buttonClassName="font-heading">
      {[EventType.Sale, EventType.Listing, EventType.Offer].map((type: EventType) => {
        const label = `${type.charAt(0).toUpperCase() + type.slice(1)}s`;

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
