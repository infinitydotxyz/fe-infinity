import React from 'react';

export class SVG {
  static blueCheck = ({ ...props }) => (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_1_1899)">
        <path
          d="M17.7402 8.36001L16.7402 7.36001C16.5424 7.1602 16.394 6.91675 16.3071 6.64932C16.2203 6.38188 16.1975 6.09788 16.2402 5.81997L16.4302 4.44985C16.4538 4.21789 16.3882 3.98558 16.2471 3.79995C16.106 3.61432 15.8997 3.4892 15.6699 3.44985L14.29 3.20986C14.0059 3.15789 13.7377 3.04042 13.5068 2.86685C13.276 2.69327 13.0888 2.46837 12.96 2.20986L12.2998 0.989892C12.175 0.786033 11.9814 0.633583 11.7539 0.560205C11.5264 0.486827 11.2804 0.497472 11.0601 0.58999L9.7998 1.19985C9.544 1.32304 9.2639 1.38711 8.97998 1.38711C8.69606 1.38711 8.41596 1.32304 8.16016 1.19985L6.8999 0.58999C6.67952 0.497472 6.43353 0.486827 6.20605 0.560205C5.97858 0.633583 5.78493 0.786033 5.66016 0.989892L5 2.20986C4.87117 2.46837 4.68398 2.69327 4.45312 2.86685C4.22227 3.04042 3.95403 3.15789 3.66992 3.20986L2.29004 3.44985C2.06022 3.4892 1.85397 3.61432 1.71289 3.79995C1.57181 3.98558 1.50617 4.21789 1.52979 4.44985L1.72021 5.81997C1.76294 6.09788 1.73966 6.38188 1.65283 6.64932C1.566 6.91675 1.41805 7.1602 1.22021 7.36001L0.220215 8.36001C0.0516677 8.53038 -0.0429688 8.76025 -0.0429688 8.9999C-0.0429688 9.23955 0.0516677 9.46943 0.220215 9.63979L1.22021 10.6398C1.41805 10.8396 1.566 11.0831 1.65283 11.3505C1.73966 11.6179 1.76294 11.9019 1.72021 12.1798L1.52979 13.55C1.50617 13.7819 1.57181 14.0142 1.71289 14.1999C1.85397 14.3855 2.06022 14.5106 2.29004 14.55L3.66992 14.7899C3.95403 14.8419 4.22227 14.9594 4.45312 15.133C4.68398 15.3065 4.87117 15.5314 5 15.7899L5.66016 17.0099C5.78493 17.2138 5.97858 17.3662 6.20605 17.4396C6.43353 17.513 6.67952 17.5023 6.8999 17.4098L8.16016 16.8C8.41596 16.6768 8.69606 16.6127 8.97998 16.6127C9.2639 16.6127 9.544 16.6768 9.7998 16.8L11.0601 17.4098C11.2804 17.5023 11.5264 17.513 11.7539 17.4396C11.9814 17.3662 12.175 17.2138 12.2998 17.0099L12.96 15.7899C13.0888 15.5314 13.276 15.3065 13.5068 15.133C13.7377 14.9594 14.0059 14.8419 14.29 14.7899L15.6699 14.55C15.8997 14.5106 16.106 14.3855 16.2471 14.1999C16.3882 14.0142 16.4538 13.7819 16.4302 13.55L16.2402 12.1798C16.1975 11.9019 16.2203 11.6179 16.3071 11.3505C16.394 11.0831 16.5424 10.8396 16.7402 10.6398L17.7402 9.63979C17.9088 9.46943 18.0029 9.23955 18.0029 8.9999C18.0029 8.76025 17.9088 8.53038 17.7402 8.36001ZM8.0498 12.56L4.68994 9.19985L5.75 8.13979L8.0498 10.4398L12.4702 6.01992L13.5298 7.07998L8.0498 12.56Z"
          fill="#0000FF"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_1899">
          <rect width="18" height="17" fill="white" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );

  static grayDelete = ({ ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle fill="#ddd" cx="12" cy="12" r="12" />

      <rect fill="black" x="6" y="11" width="12" height="2" />
    </svg>
  );

  static editCircle = ({ ...props }) => (
    <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <mask id="myMask">
        <circle fill="white" cx="5" cy="5" r="5" />

        <path
          transform="scale(.5) translate(5,5)"
          d="M9.355 2.21559C9.55 2.02059 9.55 1.69559 9.355 1.51059L8.185 0.340586C8 0.145586 7.675 0.145586 7.48 0.340586L6.56 1.25559L8.435 3.13059L9.355 2.21559ZM0.5 7.32059V9.19559H2.375L7.905 3.66059L6.03 1.78559L0.5 7.32059Z"
          fill="black"
        />
      </mask>

      <circle fill="currentColor" cx="5" cy="5" r="5" mask="url(#myMask)" />
    </svg>
  );

  static infinity = ({ ...props }) => (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62 60" {...props}>
      <path
        d="M48.288 60H13.356C5.96 60 0 54.2 0 47V13C0 5.8 5.959 0 13.356 0h34.932c7.397 0 13.356 5.8 13.356 13v34c0 7.2-5.96 13-13.356 13Z"
        fill="#000"
      />
      <path
        d="M41.08 19.88c-8.976 0-10.258 9.375-10.258 9.375S29.54 19.88 20.564 19.88c-2.72 0-5.33 1.053-7.253 2.929a9.875 9.875 0 0 0-3.004 7.071 9.874 9.874 0 0 0 3.004 7.071 10.393 10.393 0 0 0 7.253 2.93c8.976 0 10.258-9.376 10.258-9.376s1.282 9.375 10.257 9.375c2.72 0 5.33-1.054 7.253-2.929a9.874 9.874 0 0 0 3.005-7.07 9.875 9.875 0 0 0-3.005-7.072 10.393 10.393 0 0 0-7.253-2.929Z"
        fill="#fff"
      />
    </svg>
  );

  static logo = ({ ...props }) => (
    <svg viewBox="0 0 208 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M108.756 27.137V38.17H104.3v-9.802c0-4.611-1.65-5.755-3.895-5.755-2.575 0-3.895 2.305-3.895 5.755v9.802h-4.456V19.146h4.456v4.61a6.86 6.86 0 0 1 2.242-3.61 6.473 6.473 0 0 1 3.881-1.513c2.79-.136 6.123 1.588 6.123 8.504ZM158.336 27.137V38.17h-4.456v-9.802c0-4.611-1.651-5.755-3.895-5.755-2.592 0-3.912 2.305-3.912 5.755v9.802h-4.456V19.146h4.456v4.61a6.858 6.858 0 0 1 2.249-3.614 6.473 6.473 0 0 1 3.891-1.509c2.773-.136 6.123 1.588 6.123 8.504ZM114.911 16.755c0-3.518 1.651-5.123 4.952-5.123h3.895v4.064h-4.457v3.415h4.457v4.03h-4.457V38.17h-4.39V23.193H111v-4.047h3.911v-2.391ZM177.266 23.107h-3.895V19.06h3.895v-5.123h4.456v5.123h4.457v4.03h-4.457v10.947h4.457v4.132h-3.895c-3.4 0-4.952-1.708-4.952-5.208l-.066-9.854ZM133.117 16.191c1.386 0 2.509-1.162 2.509-2.595 0-1.434-1.123-2.596-2.509-2.596-1.385 0-2.509 1.162-2.509 2.596 0 1.433 1.124 2.595 2.509 2.595ZM138.828 34.054l-3.334.017V19.06h-8.351v4.047h3.895v10.946h-3.895v4.03h11.685v-4.03ZM88.703 34.053l-6.124.018V15.61h6.124v-4.03H72v4.03h6.123v18.442L72 34.036v4.03l16.703.018v-4.03ZM167.101 16.191c1.385 0 2.508-1.162 2.508-2.595 0-1.434-1.123-2.596-2.508-2.596-1.386 0-2.509 1.162-2.509 2.596 0 1.433 1.123 2.595 2.509 2.595ZM172.811 34.054l-3.35.017V19.06h-8.352v4.047h3.895v10.946h-3.895v4.03h11.702v-4.03Z"
        fill="#010101"
      />
      <path
        d="m202.899 19.06-4.951 13.27-4.457-13.27h-4.951l7.246 18.444-1.37 2.817c-.09.193-.23.357-.405.471a1.082 1.082 0 0 1-.586.178h-4.324V45h3.301c3.301 0 4.456 0 6.14-4.03l9.457-21.91h-5.1ZM39.167 50H10.833C4.833 50 0 45.167 0 39.167V10.833C0 4.833 4.833 0 10.833 0h28.334C45.167 0 50 4.833 50 10.833v28.334C50 45.167 45.167 50 39.167 50Z"
        fill="#000"
      />
      <path
        d="M33.32 16.567c-7.28 0-8.32 7.812-8.32 7.812s-1.04-7.812-8.32-7.812a8.313 8.313 0 0 0-5.883 2.44 8.34 8.34 0 0 0 0 11.786 8.314 8.314 0 0 0 5.883 2.44c7.28 0 8.32-7.812 8.32-7.812s1.04 7.813 8.32 7.813a8.313 8.313 0 0 0 5.883-2.441 8.34 8.34 0 0 0 0-11.785 8.313 8.313 0 0 0-5.883-2.441Z"
        fill="#fff"
      />
    </svg>
  );

  static uniswap = ({ ...props }) => {
    return (
      <svg
        id="prefix__Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x={0}
        y={0}
        viewBox="0 0 168.3 193.8"
        xmlSpace="preserve"
        {...props}
      >
        <path
          className="fill-current"
          d="M66 44.1c-2.1-.3-2.2-.4-1.2-.5 1.9-.3 6.3.1 9.4.8 7.2 1.7 13.7 6.1 20.6 13.8l1.8 2.1 2.6-.4c11.1-1.8 22.5-.4 32 4 2.6 1.2 6.7 3.6 7.2 4.2.2.2.5 1.5.7 2.8.7 4.7.4 8.2-1.1 10.9-.8 1.5-.8 1.9-.3 3.2.4 1 1.6 1.7 2.7 1.7 2.4 0 4.9-3.8 6.1-9.1l.5-2.1.9 1c5.1 5.7 9.1 13.6 9.7 19.2l.2 1.5-.9-1.3c-1.5-2.3-2.9-3.8-4.8-5.1-3.4-2.3-7-3-16.5-3.5-8.6-.5-13.5-1.2-18.3-2.8-8.2-2.7-12.4-6.2-22.1-19.1-4.3-5.7-7-8.8-9.7-11.4-5.9-5.7-11.8-8.7-19.5-9.9z"
        />
        <path
          className="fill-current"
          d="M140.5 56.8c.2-3.8.7-6.3 1.8-8.6.4-.9.8-1.7.9-1.7.1 0-.1.7-.4 1.5-.8 2.2-.9 5.3-.4 8.8.7 4.5 1 5.1 5.8 10 2.2 2.3 4.8 5.2 5.8 6.4l1.7 2.2-1.7-1.6c-2.1-2-6.9-5.8-8-6.3-.7-.4-.8-.4-1.3.1-.4.4-.5 1-.5 3.9-.1 4.5-.7 7.3-2.2 10.2-.8 1.5-.9 1.2-.2-.5.5-1.3.6-1.9.6-6.2 0-8.7-1-10.8-7.1-14.3-1.5-.9-4.1-2.2-5.6-2.9-1.6-.7-2.8-1.3-2.7-1.3.2-.2 6.1 1.5 8.4 2.5 3.5 1.4 4.1 1.5 4.5 1.4.3-.3.5-1.1.6-3.6zM70.1 71.7c-4.2-5.8-6.9-14.8-6.3-21.5l.2-2.1 1 .2c1.8.3 4.9 1.5 6.4 2.4 4 2.4 5.8 5.7 7.5 13.9.5 2.4 1.2 5.2 1.5 6.1.5 1.5 2.4 5 4 7.2 1.1 1.6.4 2.4-2.1 2.2-3.8-.4-8.9-3.9-12.2-8.4zM135.4 115.2c-19.8-8-26.8-14.9-26.8-26.6 0-1.7.1-3.1.1-3.1.1 0 .8.6 1.7 1.3 4 3.2 8.5 4.6 21 6.4 7.3 1.1 11.5 1.9 15.3 3.2 12.1 4 19.6 12.2 21.4 23.3.5 3.2.2 9.3-.6 12.5-.7 2.5-2.7 7.1-3.2 7.2-.1 0-.3-.5-.3-1.3-.2-4.2-2.3-8.2-5.8-11.3-4.2-3.6-9.6-6.3-22.8-11.6zM121.4 118.5c-.2-1.5-.7-3.4-1-4.2l-.5-1.5.9 1.1c1.3 1.5 2.3 3.3 3.2 5.8.7 1.9.7 2.5.7 5.6 0 3-.1 3.7-.7 5.4-1 2.7-2.2 4.6-4.2 6.7-3.6 3.7-8.3 5.7-15 6.6-1.2.1-4.6.4-7.6.6-7.5.4-12.5 1.2-17 2.8-.6.2-1.2.4-1.3.3-.2-.2 2.9-2 5.4-3.2 3.5-1.7 7.1-2.6 15-4 3.9-.6 7.9-1.4 8.9-1.8 9.9-3.1 14.8-10.8 13.2-20.2z"
        />
        <path
          className="fill-current"
          d="M130.5 134.6c-2.6-5.7-3.2-11.1-1.8-16.2.2-.5.4-1 .6-1 .2 0 .8.3 1.4.7 1.2.8 3.7 2.2 10.1 5.7 8.1 4.4 12.7 7.8 15.9 11.7 2.8 3.4 4.5 7.3 5.3 12.1.5 2.7.2 9.2-.5 11.9-2.2 8.5-7.2 15.3-14.5 19.2-1.1.6-2 1-2.1 1-.1 0 .3-1 .9-2.2 2.4-5.1 2.7-10 .9-15.5-1.1-3.4-3.4-7.5-8-14.4-5.5-8-6.8-10.1-8.2-13zM56 165.2c7.4-6.2 16.5-10.6 24.9-12 3.6-.6 9.6-.4 12.9.5 5.3 1.4 10.1 4.4 12.6 8.1 2.4 3.6 3.5 6.7 4.6 13.6.4 2.7.9 5.5 1 6.1.8 3.6 2.4 6.4 4.4 7.9 3.1 2.3 8.5 2.4 13.8.4.9-.3 1.7-.6 1.7-.5.2.2-2.5 2-4.3 2.9-2.5 1.3-4.5 1.7-7.2 1.7-4.8 0-8.9-2.5-12.2-7.5-.7-1-2.1-3.9-3.3-6.6-3.5-8.1-5.3-10.5-9.4-13.2-3.6-2.3-8.2-2.8-11.7-1.1-4.6 2.2-5.8 8.1-2.6 11.7 1.3 1.5 3.7 2.7 5.7 3 3.7.5 6.9-2.4 6.9-6.1 0-2.4-.9-3.8-3.3-4.9-3.2-1.4-6.7.2-6.6 3.3 0 1.3.6 2.1 1.9 2.7.8.4.8.4.2.3-2.9-.6-3.6-4.2-1.3-6.5 2.8-2.8 8.7-1.6 10.7 2.3.8 1.6.9 4.8.2 6.8-1.7 4.4-6.5 6.7-11.4 5.4-3.3-.9-4.7-1.8-8.7-5.9-7-7.2-9.7-8.6-19.7-10.1l-1.9-.3 2.1-2z"
        />
        <path
          className="fill-current"
          d="M3.4 4.3c23.3 28.3 59.2 72.3 61 74.7 1.5 2 .9 3.9-1.6 5.3-1.4.8-4.3 1.6-5.7 1.6-1.6 0-3.5-.8-4.8-2.1-.9-.9-4.8-6.6-13.6-20.3C32 53 26.3 44.3 26.2 44.2c-.4-.2-.4-.2 11.8 21.6C45.7 79.5 48.2 84.4 48.2 85c0 1.3-.4 2-2 3.8-2.7 3-3.9 6.4-4.8 13.5-1 7.9-3.7 13.5-11.4 23-4.5 5.6-5.2 6.6-6.3 8.9-1.4 2.8-1.8 4.4-2 8-.2 3.8.2 6.2 1.3 9.8 1 3.2 2.1 5.3 4.8 9.4 2.3 3.6 3.7 6.3 3.7 7.3 0 .8.2.8 3.8 0 8.6-2 15.7-5.4 19.6-9.6 2.4-2.6 3-4 3-7.6 0-2.3-.1-2.8-.7-4.2-1-2.2-2.9-4-7-6.8-5.4-3.7-7.7-6.7-8.3-10.7-.5-3.4.1-5.7 3.1-12 3.1-6.5 3.9-9.2 4.4-15.8.3-4.2.8-5.9 2-7.2 1.3-1.4 2.4-1.9 5.5-2.3 5.1-.7 8.4-2 11-4.5 2.3-2.1 3.3-4.2 3.4-7.3l.1-2.3-1.3-1.4C65.4 71.6.3 0 0 0c-.1 0 1.5 1.9 3.4 4.3zm30.7 142.2c1.1-1.9.5-4.3-1.3-5.5-1.7-1.1-4.3-.6-4.3.9 0 .4.2.8.8 1 .9.5 1 1 .3 2.1s-.7 2.1.2 2.8c1.4 1.1 3.3.5 4.3-1.3zM74.6 93.9c-2.4.7-4.7 3.3-5.4 5.9-.4 1.6-.2 4.5.5 5.4 1.1 1.4 2.1 1.8 4.9 1.8 5.5 0 10.2-2.4 10.7-5.3.5-2.4-1.6-5.7-4.5-7.2-1.5-.8-4.6-1.1-6.2-.6zm6.4 5c.8-1.2.5-2.5-1-3.4-2.7-1.7-6.8-.3-6.8 2.3 0 1.3 2.1 2.7 4.1 2.7 1.3 0 3.1-.8 3.7-1.6z"
        />
      </svg>
    );
  };

  static ethereum = ({ ...props }) => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
        <g fill="none" fillRule="evenodd">
          <circle cx={16} cy={16} r={16} fill="#627EEA" />
          <g fill="#FFF" fillRule="nonzero">
            <path fillOpacity={0.602} d="M16.498 4v8.87l7.497 3.35z" />
            <path d="M16.498 4L9 16.22l7.498-3.35z" />
            <path fillOpacity={0.602} d="M16.498 21.968v6.027L24 17.616z" />
            <path d="M16.498 27.995v-6.028L9 17.616z" />
            <path fillOpacity={0.2} d="M16.498 20.573l7.497-4.353-7.497-3.348z" />
            <path fillOpacity={0.602} d="M9 16.22l7.498 4.353v-7.701z" />
          </g>
        </g>
      </svg>
    );
  };

  static matic = ({ ...props }) => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.4 33.5" {...props}>
        <path
          d="M29 10.2c-.7-.4-1.6-.4-2.4 0L21 13.5l-3.8 2.1-5.5 3.3c-.7.4-1.6.4-2.4 0L5 16.3c-.7-.4-1.2-1.2-1.2-2.1v-5c0-.8.4-1.6 1.2-2.1l4.3-2.5c.7-.4 1.6-.4 2.4 0L16 7.2c.7.4 1.2 1.2 1.2 2.1v3.3l3.8-2.2V7c0-.8-.4-1.6-1.2-2.1l-8-4.7c-.7-.4-1.6-.4-2.4 0L1.2 5C.4 5.4 0 6.2 0 7v9.4c0 .8.4 1.6 1.2 2.1l8.1 4.7c.7.4 1.6.4 2.4 0l5.5-3.2 3.8-2.2 5.5-3.2c.7-.4 1.6-.4 2.4 0l4.3 2.5c.7.4 1.2 1.2 1.2 2.1v5c0 .8-.4 1.6-1.2 2.1L29 28.8c-.7.4-1.6.4-2.4 0l-4.3-2.5c-.7-.4-1.2-1.2-1.2-2.1V21l-3.8 2.2v3.3c0 .8.4 1.6 1.2 2.1l8.1 4.7c.7.4 1.6.4 2.4 0l8.1-4.7c.7-.4 1.2-1.2 1.2-2.1V17c0-.8-.4-1.6-1.2-2.1L29 10.2z"
          fill="#8247e5"
        />
      </svg>
    );
  };

  static solana = ({ ...props }) => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397.7 311.7" {...props}>
        <linearGradient
          id="prefix__a"
          gradientUnits="userSpaceOnUse"
          x1={360.879}
          y1={351.455}
          x2={141.213}
          y2={-69.294}
          gradientTransform="matrix(1 0 0 -1 0 314)"
        >
          <stop offset={0} stopColor="#00ffa3" />
          <stop offset={1} stopColor="#dc1fff" />
        </linearGradient>
        <path
          d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
          fill="url(#prefix__a)"
        />
        <linearGradient
          id="prefix__b"
          gradientUnits="userSpaceOnUse"
          x1={264.829}
          y1={401.601}
          x2={45.163}
          y2={-19.148}
          gradientTransform="matrix(1 0 0 -1 0 314)"
        >
          <stop offset={0} stopColor="#00ffa3" />
          <stop offset={1} stopColor="#dc1fff" />
        </linearGradient>
        <path
          d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
          fill="url(#prefix__b)"
        />
        <linearGradient
          id="prefix__c"
          gradientUnits="userSpaceOnUse"
          x1={312.548}
          y1={376.688}
          x2={92.882}
          y2={-44.061}
          gradientTransform="matrix(1 0 0 -1 0 314)"
        >
          <stop offset={0} stopColor="#00ffa3" />
          <stop offset={1} stopColor="#dc1fff" />
        </linearGradient>
        <path
          d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
          fill="url(#prefix__c)"
        />
      </svg>
    );
  };

  static avalanche = ({ ...props }) => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 254 254" xmlSpace="preserve" {...props}>
        <circle
          cx={127}
          cy={127}
          r={127}
          style={{
            fillRule: 'evenodd',
            clipRule: 'evenodd',
            fill: '#e84142'
          }}
        />
        <path
          d="M171.8 130.3c4.4-7.6 11.5-7.6 15.9 0l27.4 48.1c4.4 7.6.8 13.8-8 13.8h-55.2c-8.7 0-12.3-6.2-8-13.8l27.9-48.1zm-53-92.6c4.4-7.6 11.4-7.6 15.8 0l6.1 11L155.1 74c3.5 7.2 3.5 15.7 0 22.9l-48.3 83.7c-4.4 6.8-11.7 11.1-19.8 11.6H46.9c-8.8 0-12.4-6.1-8-13.8l79.9-140.7z"
          style={{
            fill: '#fff'
          }}
        />
      </svg>
    );
  };

  static metamask = ({ ...props }) => {
    return (
      <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="75" cy="75" r="75" fill="#FCEAE7" />
        <path
          d="M110.967 37L79.3613 60.4741L85.206 46.6247L110.967 37Z"
          fill="#E2761B"
          stroke="#E2761B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M38.0039 37L69.3557 60.6965L63.7968 46.6247L38.0039 37Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M99.5954 91.413L91.1777 104.309L109.188 109.265L114.366 91.6988L99.5954 91.413Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34.668 91.6988L39.8138 109.265L57.8244 104.309L49.4068 91.413L34.668 91.6988Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M56.8098 69.6223L51.791 77.2141L69.6745 78.0082L69.0392 58.7905L56.8098 69.6223Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M92.1625 69.6223L79.7743 58.5682L79.3613 78.0082L97.2131 77.2141L92.1625 69.6223Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M57.8242 104.309L68.5607 99.0682L59.2854 91.8258L57.8242 104.309Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M80.4102 99.0682L91.1784 104.309L89.6855 91.8258L80.4102 99.0682Z"
          fill="#E4761B"
          stroke="#E4761B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M91.1764 104.309L80.4082 99.0682L81.2659 106.088L81.1706 109.042L91.1764 104.309Z"
          fill="#D7C1B3"
          stroke="#D7C1B3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M57.8242 104.309L67.8301 109.042L67.7666 106.088L68.5607 99.0682L57.8242 104.309Z"
          fill="#D7C1B3"
          stroke="#D7C1B3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M67.9889 87.1882L59.0312 84.5517L65.3524 81.6611L67.9889 87.1882Z"
          fill="#233447"
          stroke="#233447"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M80.9785 87.1882L83.615 81.6611L89.9679 84.5517L80.9785 87.1882Z"
          fill="#233447"
          stroke="#233447"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M57.8219 104.309L59.3466 91.413L49.4043 91.6988L57.8219 104.309Z"
          fill="#CD6116"
          stroke="#CD6116"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M89.6484 91.413L91.1731 104.309L99.5908 91.6988L89.6484 91.413Z"
          fill="#CD6116"
          stroke="#CD6116"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M97.2111 77.2141L79.3594 78.0082L81.0111 87.1882L83.6476 81.6612L90.0005 84.5518L97.2111 77.2141Z"
          fill="#CD6116"
          stroke="#CD6116"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M59.0275 84.5518L65.3804 81.6612L67.9852 87.1882L69.6687 78.0082L51.7852 77.2141L59.0275 84.5518Z"
          fill="#CD6116"
          stroke="#CD6116"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M51.7891 77.2141L59.2855 91.8259L59.0314 84.5518L51.7891 77.2141Z"
          fill="#E4751F"
          stroke="#E4751F"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M90.0012 84.5518L89.6836 91.8259L97.2118 77.2141L90.0012 84.5518Z"
          fill="#E4751F"
          stroke="#E4751F"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M69.6718 78.0083L67.9883 87.1883L70.0847 98.0201L70.5612 83.7577L69.6718 78.0083Z"
          fill="#E4751F"
          stroke="#E4751F"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M79.3596 78.0083L78.502 83.7259L78.8831 98.0201L81.0114 87.1883L79.3596 78.0083Z"
          fill="#E4751F"
          stroke="#E4751F"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M81.013 87.1882L78.8848 98.02L80.4095 99.0682L89.6848 91.8259L90.0024 84.5518L81.013 87.1882Z"
          fill="#F6851B"
          stroke="#F6851B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M59.0312 84.5518L59.2854 91.8259L68.5607 99.0682L70.0854 98.02L67.9889 87.1882L59.0312 84.5518Z"
          fill="#F6851B"
          stroke="#F6851B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M81.1713 109.042L81.2666 106.088L80.4724 105.389H68.4972L67.7666 106.088L67.8301 109.042L57.8242 104.309L61.3183 107.168L68.4019 112.092H80.5677L87.683 107.168L91.1771 104.309L81.1713 109.042Z"
          fill="#C0AD9E"
          stroke="#C0AD9E"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M80.408 99.0681L78.8833 98.0199H70.0844L68.5597 99.0681L67.7656 106.088L68.4962 105.389H80.4715L81.2656 106.088L80.408 99.0681Z"
          fill="#161616"
          stroke="#161616"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M112.3 61.9988L115 49.0388L110.966 37L80.4082 59.68L92.1611 69.6223L108.774 74.4823L112.459 70.1941L110.871 69.0506L113.412 66.7318L111.442 65.207L113.983 63.2694L112.3 61.9988Z"
          fill="#763D16"
          stroke="#763D16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34 49.0388L36.7 61.9988L34.9847 63.2694L37.5259 65.207L35.5882 66.7318L38.1294 69.0506L36.5412 70.1941L40.1941 74.4823L56.807 69.6223L68.56 59.68L38.0024 37L34 49.0388Z"
          fill="#763D16"
          stroke="#763D16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M108.772 74.4823L92.1593 69.6223L97.2099 77.2141L89.6816 91.8258L99.5922 91.6988H114.363L108.772 74.4823Z"
          fill="#F6851B"
          stroke="#F6851B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M56.808 69.6223L40.195 74.4823L34.668 91.6988H49.4068L59.2856 91.8258L51.7891 77.2141L56.808 69.6223Z"
          fill="#F6851B"
          stroke="#F6851B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M79.3596 78.0083L80.4079 59.68L85.2361 46.6248H63.7949L68.5596 59.68L69.6714 78.0083L70.0526 83.7894L70.0843 98.02H78.8832L78.9467 83.7894L79.3596 78.0083Z"
          fill="#F6851B"
          stroke="#F6851B"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  static metamaskAlt = ({ ...props }) => {
    return (
      <svg
        id="prefix__Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x={0}
        y={0}
        viewBox="0 0 318.6 318.6"
        xmlSpace="preserve"
        {...props}
      >
        <style>
          {
            '.prefix__st1,.prefix__st6{fill:#e4761b;stroke:#e4761b;stroke-linecap:round;stroke-linejoin:round}.prefix__st6{fill:#f6851b;stroke:#f6851b}'
          }
        </style>
        <path
          d="M274.1 35.5l-99.5 73.9L193 65.8z"
          fill="#e2761b"
          stroke="#e2761b"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="prefix__st1"
          d="M44.4 35.5l98.7 74.6-17.5-44.3zm193.9 171.3l-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9L50.1 263l56.7-15.6-26.5-40.6z"
        />
        <path
          className="prefix__st1"
          d="M103.6 138.2l-15.8 23.9 56.3 2.5-2-60.5zm111.3 0l-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5l33.9 16.5-4.7-39.3z"
        />
        <path
          d="M211.8 247.4l-33.9-16.5 2.7 22.1-.3 9.3zm-105 0l31.5 14.9-.2-9.3 2.5-22.1z"
          fill="#d7c1b3"
          stroke="#d7c1b3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M138.8 193.5l-28.2-8.3 19.9-9.1zm40.9 0l8.3-17.4 20 9.1z"
          fill="#233447"
          stroke="#233447"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M106.8 247.4l4.8-40.6-31.3.9zM207 206.8l4.8 40.6 26.5-39.7zm23.8-44.7l-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zm-120.2 23.1l20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z"
          fill="#cd6116"
          stroke="#cd6116"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M87.8 162.1l23.6 46-.8-22.9zm120.3 23.1l-1 22.9 23.7-46zm-64-20.6l-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0l-2.7 18 1.2 45 6.7-34.1z"
          fill="#e4751f"
          stroke="#e4751f"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="prefix__st6"
          d="M179.8 193.5l-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zm-69.2-8.3l.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z"
        />
        <path
          d="M180.3 262.3l.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z"
          fill="#c0ad9e"
          stroke="#c0ad9e"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M177.9 230.9l-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z"
          fill="#161616"
          stroke="#161616"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M278.3 114.2l8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z"
          fill="#763d16"
          stroke="#763d16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="prefix__st6"
          d="M267.2 153.5l-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zm-163.6-15.3l-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zm71 26.4l3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z"
        />
      </svg>
    );
  };

  static walletconnect = ({ ...props }) => (
    <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="75" cy="75" r="75" fill="#E7EEFC" />
      <path
        d="M42.065 54.1332C60.2408 36.3376 89.7096 36.3376 107.885 54.1332L110.073 56.2749C110.982 57.1647 110.982 58.6073 110.073 59.4971L102.59 66.8236C102.136 67.2685 101.399 67.2685 100.944 66.8236L97.9342 63.8763C85.2543 51.4616 64.6961 51.4616 52.0163 63.8763L48.7925 67.0326C48.3381 67.4775 47.6014 67.4775 47.147 67.0326L39.6641 59.7061C38.7553 58.8164 38.7553 57.3737 39.6641 56.484L42.065 54.1332ZM123.361 69.2851L130.021 75.8056C130.929 76.6954 130.929 78.138 130.021 79.0278L99.991 108.43C99.0822 109.32 97.6088 109.32 96.7 108.43C96.7 108.43 96.7 108.43 96.7 108.43L75.3868 87.5624C75.1596 87.3399 74.7912 87.3399 74.564 87.5624C74.564 87.5624 74.564 87.5624 74.564 87.5624L53.2512 108.43C52.3424 109.32 50.869 109.32 49.9602 108.43C49.9602 108.43 49.9602 108.43 49.9602 108.43L19.9296 79.0274C19.0208 78.1376 19.0208 76.695 19.9296 75.8052L26.5895 69.2847C27.4983 68.3949 28.9717 68.3949 29.8805 69.2847L51.1941 90.1524C51.4213 90.3749 51.7896 90.3749 52.0168 90.1524C52.0168 90.1524 52.0168 90.1524 52.0168 90.1524L73.3293 69.2847C74.2381 68.3949 75.7115 68.3948 76.6203 69.2846C76.6204 69.2846 76.6204 69.2846 76.6204 69.2846L97.9339 90.1524C98.1611 90.3749 98.5295 90.3749 98.7567 90.1524L120.07 69.2851C120.979 68.3953 122.452 68.3953 123.361 69.2851Z"
        fill="#3B99FC"
      />
    </svg>
  );

  static walletconnectAlt = ({ ...props }) => (
    <svg viewBox="0 0 300 185" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M61.439 36.256c48.91-47.888 128.212-47.888 177.123 0l5.886 5.764a6.041 6.041 0 010 8.67l-20.136 19.716a3.179 3.179 0 01-4.428 0l-8.101-7.931c-34.122-33.408-89.444-33.408-123.566 0l-8.675 8.494a3.179 3.179 0 01-4.428 0L54.978 51.253a6.041 6.041 0 010-8.67l6.46-6.327zM280.206 77.03l17.922 17.547a6.041 6.041 0 010 8.67l-80.81 79.122c-2.446 2.394-6.41 2.394-8.856 0l-57.354-56.155a1.59 1.59 0 00-2.214 0L91.54 182.37c-2.446 2.394-6.411 2.394-8.857 0L1.872 103.247a6.041 6.041 0 010-8.671l17.922-17.547c2.445-2.394 6.41-2.394 8.856 0l57.355 56.155a1.59 1.59 0 002.214 0L145.57 77.03c2.446-2.394 6.41-2.395 8.856 0l57.355 56.155a1.59 1.59 0 002.214 0L271.35 77.03c2.446-2.394 6.41-2.394 8.856 0z"
        fill="#3B99FC"
        fillRule="nonzero"
      />
    </svg>
  );

  static coinbasewallet = ({ ...props }) => (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z"
        fill="#1652F0"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.45508 20.0006C5.45508 28.0338 11.9673 34.546 20.0006 34.546C28.0338 34.546 34.546 28.0338 34.546 20.0006C34.546 11.9673 28.0338 5.45508 20.0006 5.45508C11.9673 5.45508 5.45508 11.9673 5.45508 20.0006ZM17.3137 15.3145C16.2091 15.3145 15.3137 16.2099 15.3137 17.3145V22.6882C15.3137 23.7928 16.2091 24.6882 17.3137 24.6882H22.6874C23.792 24.6882 24.6874 23.7928 24.6874 22.6882V17.3145C24.6874 16.2099 23.792 15.3145 22.6874 15.3145H17.3137Z"
        fill="white"
      />
    </svg>
  );

  static coinbasewalletAlt = ({ ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" {...props}>
      <g fill="#255DEF">
        <path d="M183.3 42.6c-22.8 2.7-47.6 11.3-65.8 22.6-35.6 22.3-61.6 57.4-71.9 97.3-11.1 42.3-4.2 88.2 18.7 125.2 24.7 39.8 64.2 66.4 111.2 74.9 7 1.2 15 1.8 26.5 1.8 18.4 0 29.8-1.6 46.5-6.6 55.6-16.5 99.2-63.4 111.3-119.9 7.4-33.9 4-68.1-9.6-98.9-21.2-48-61.9-81.8-112.7-93.6-9.3-2.1-28.4-4.4-36.5-4.3-3.6.1-11.6.7-17.7 1.5zm34.2 66.8c57.2 10.1 92.1 67 74.8 122-15.9 50.6-70.5 78.3-120.4 61.2-31.9-10.9-54.8-36.3-62.6-69.2-2.2-9.5-2.4-29.7-.4-38.9 5.7-25.9 19.7-46.5 41.6-60.9 19.6-12.9 44.4-18.2 67-14.2z" />
        <path d="M174.2 174.6c-2.2 1.5-2.2 1.8-2.2 28.3 0 24.7.1 26.9 1.8 28.4 1.6 1.5 5.1 1.7 28.4 1.7 24.4 0 26.6-.1 28.1-1.8 1.5-1.6 1.7-5.1 1.7-28.4 0-24.4-.1-26.6-1.8-28.1-1.6-1.5-5.1-1.7-27.8-1.7-21.9 0-26.3.2-28.2 1.6z" />
      </g>
    </svg>
  );
}
