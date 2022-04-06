import React from 'react';

interface Props {
  type?: string;
  label?: string;
  value?: string;
}

export function Field({ type, label, value }: Props) {
  const styles = {
    image: {
      positioner: {
        className: `
          w-full h-full overflow-hidden
          grid items-center justify-end
        `
      },
      container: {
        className: `
          w-[48px] h-[48px] overflow-hidden
          rounded-full
        `
      },
      element: {
        className: `
          w-full h-full
        `
      }
    },
    action: {},
    string: {
      container: {
        className: `
          w-full h-full overflow-hidden
          grid place-items-center
        `
      },
      element: {
        className: `
          text-theme-light-900 font-bold text-md
        `
      }
    },
    number: {
      container: {
        className: `
          w-full h-full overflow-hidden
          grid place-items-center
        `
      },
      label: {
        className: `
          self-end
          font-bold font-mono
          text-sm text-theme-light-800
        `
      },
      value: {
        className: `
          self-start
          font-bold font-mono
          text-sm text-theme-light-900
        `
      }
    },
    percentage: {
      container: {
        className: `
          w-full h-full overflow-hidden
          grid place-items-center px-4
        `
      },
      pill: {
        className: `
          w-full h-content relative overflow-hidden
          bg-theme-light-50 rounded-full
        `
      },
      progress: {
        style: { width: `${value}` },
        className: `
          absolute inset-0
          bg-blue-300 z-10
          w-full h-full justify-between
        `
      },
      grid: {
        className: `
          w-full h-full z-1
          flex items-center justify-between
          py-4 px-6 z-20
        `
      },
      label: {
        className: `
          font-mono font-normal
          text-sm z-20
        `
      },
      value: {
        className: `
          font-mono font-bold
          text-sm z-20
        `
      }
    }
  };

  return (
    <>
      {type === 'image' && (
        <div {...styles?.image?.positioner}>
          <div {...styles?.image?.container}>
            <img src={value} {...styles?.image?.element} />
          </div>
        </div>
      )}
      {type === 'action' && <></>}
      {type === 'string' && (
        <div {...styles?.string?.container}>
          <p {...styles?.string?.element}>{value}</p>
        </div>
      )}
      {type === 'number' && (
        <div {...styles?.number?.container}>
          <p {...styles?.number?.label}>{label}</p>
          <p {...styles?.number?.value}>{value}</p>
        </div>
      )}
      {type === 'percentage' && (
        <div {...styles?.percentage?.container}>
          <div {...styles?.percentage?.pill}>
            <div {...styles?.percentage?.progress}></div>
            <div {...styles?.percentage?.grid}>
              <p {...styles?.percentage?.label}>{label}</p>
              <p {...styles?.percentage?.value}>{value}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Field;
