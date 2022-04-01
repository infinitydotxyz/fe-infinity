import React, { useState } from 'react';

const PUNCTUATION_LIST = ['.', ',', '!', '?', "'", '{', '}', '(', ')', '[', ']', '/'];

const trimText = (text: string, min = 80, ideal = 100, max = 200) => {
  if (max < min || ideal > max || ideal < min) {
    throw new Error(
      'The minimum length must be less than the maximum, and the ideal must be between the minimum and maximum.'
    );
  }

  if (text.length < ideal) {
    return [text, ''];
  }

  let pointerOne = ideal;
  let pointerTwo = ideal;
  let firstSpace = 0;
  let resultIdx;

  const setSpace = (idx: number) => {
    if (spaceMatch(text[idx])) {
      firstSpace = firstSpace || idx;
    }
  };

  while (pointerOne < max || pointerTwo > min) {
    if (checkMatch(pointerOne, text, max, min)) {
      resultIdx = pointerOne + 1;
      break;
    } else if (checkMatch(pointerTwo, text, max, min)) {
      resultIdx = pointerTwo + 1;
      break;
    } else {
      setSpace(pointerOne);
      setSpace(pointerTwo);
    }

    pointerOne++;
    pointerTwo--;
  }

  if (resultIdx === undefined) {
    if (firstSpace && firstSpace >= min && firstSpace <= max) {
      resultIdx = firstSpace;
    } else if (ideal - min < max - ideal) {
      resultIdx = min;
    } else {
      resultIdx = max;
    }
  }

  return [text.slice(0, resultIdx), text.slice(resultIdx).trim()];
};

const spaceMatch = (character: string): boolean => {
  if (character === ' ') {
    return true;
  }
  return false;
};

const punctuationMatch = (idx: number, text: string): boolean => {
  const punctuationIdx: number = PUNCTUATION_LIST.indexOf(text[idx]);
  if (punctuationIdx >= 0 && spaceMatch(text[idx + 1])) {
    return true;
  }
  return false;
};

const checkMatch = (idx: number, text: string, max: number, min: number): boolean => {
  if (idx < max && idx > min && punctuationMatch(idx, text)) {
    return true;
  }
  return false;
};

interface ReadMoreTextPropType {
  text: string;
  min: number;
  ideal: number;
  max: number;
}

export const ReadMoreText: React.FC<ReadMoreTextPropType> = (props) => {
  const [displaySecondary, setDisplaySecondary] = useState(false);
  const [primaryText, secondaryText] = trimText(props.text, props.min, props.ideal, props.max);

  const setStatus = React.useCallback(() => {
    setDisplaySecondary(!displaySecondary);
  }, [displaySecondary]);

  let displayText;
  if (!secondaryText) {
    displayText = (
      <div className="leading-normal">
        <span className="text-theme-light-800">{`${primaryText} ${secondaryText}`}</span>
      </div>
    );
  } else if (displaySecondary) {
    displayText = (
      <div className="leading-normal">
        <span className="text-theme-light-800">{`${primaryText} ${secondaryText}`}</span>
        <span className="ml-2 underline text-black underline-offset-2 cursor-pointer" onClick={setStatus}>
          Less
        </span>
      </div>
    );
  } else {
    displayText = (
      <div className="leading-normal">
        <span className="text-theme-light-800">
          {primaryText}
          <span style={{ display: 'none' }}>{secondaryText}</span>
          <span className={'ml-2 underline text-black underline-offset-2 cursor-pointer'} onClick={setStatus}>
            Read More
          </span>
        </span>
      </div>
    );
  }

  return displayText;
};
