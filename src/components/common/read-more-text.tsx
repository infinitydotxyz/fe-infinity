import React from 'react';

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
  readMoreText: string;
}

interface ReadMoreTextState {
  displaySecondary: boolean;
  primaryText: string;
  secondaryText: string;
  readMoreText: string;
}

export class ReadMoreText extends React.Component<ReadMoreTextPropType, ReadMoreTextState> {
  constructor(props: ReadMoreTextPropType) {
    super(props);

    const [primaryText, secondaryText] = trimText(this.props.text, this.props.min, this.props.ideal, this.props.max);

    this.state = {
      displaySecondary: true,
      primaryText,
      secondaryText,
      readMoreText: this.props.readMoreText
    } as ReadMoreTextState;
  }

  setStatus() {
    const display = !this.state.displaySecondary;
    this.setState({ displaySecondary: display });
  }

  render() {
    let displayText;
    if (!this.state.secondaryText) {
      displayText = (
        <div>
          <span className="text-theme-light-800">{`${this.state.primaryText} ${this.state.secondaryText}`}</span>
        </div>
      );
    } else if (this.state.displaySecondary) {
      displayText = (
        <div>
          <span className="text-theme-light-800">{`${this.state.primaryText} ${this.state.secondaryText}`}</span>
          <span
            className="ml-2 underline text-black underline-offset-2 cursor-pointer"
            onClick={this.setStatus.bind(this)}
          >
            Less...
          </span>
        </div>
      );
    } else {
      displayText = (
        <div>
          <span className="text-theme-light-800">
            {this.state.primaryText}
            <span style={{ display: 'none' }}>{this.state.secondaryText}</span>
            <span
              className={'ml-2 underline text-black underline-offset-2 cursor-pointer'}
              onClick={this.setStatus.bind(this)}
            >
              {this.state.readMoreText}
            </span>
          </span>
        </div>
      );
    }

    return displayText;
  }
}
