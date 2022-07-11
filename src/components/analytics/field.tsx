import React, { ReactNode, useState } from 'react';
import { GoTriangleUp, GoTriangleDown } from 'react-icons/go';
import { AiOutlineCaretUp, AiOutlineCaretDown } from 'react-icons/ai';

export interface FieldProps {
  type?: string;
  value?: string | number;
  label?: string | React.ReactNode;
  sortable?: boolean;
  onSort?: ((direction: string) => void) | ((direction: string) => void) | null | undefined;
  onClick?: () => void;
  content?: ReactNode;
  children?: React.ReactNode;
}

export const Field = ({ onSort, sortable = false, onClick, type, label, value, content, children }: FieldProps) => {
  const [sortOrder, setSortOrder] = useState('desc');
  const styles = {
    stat: {
      container: {
        className: `
          w-full h-full overflow-hidden
          flex flex-row place-content-center
        `
      },
      field: {
        container: {
          className: `
            ${sortable ? 'w-content h-content' : 'w-full h-full '}
            overflow-hidden
            flex flex-row
          `
        }
      },
      sorting: {
        container: {
          className: `
            w-full h-full overflow-hidden
            flex flex-col ${sortable ? 'flex-[0.5]' : ''}
            place-items-center gap-0
          `
        },
        asc: {
          container: {
            className: `
              w-full h-full
              flex flex-row items-end justify-center
            `
          },
          element: {
            className: `
              text-xs hover:cursor-pointer
              transition active:translate-y-1 hover:text-green-700
            `
          }
        },
        desc: {
          container: {
            className: `
              w-full h-full
              flex flex-row items-start justify-center
            `
          },
          element: {
            className: `
              text-xs active:-translate-y-1 hover:cursor-pointer
              transition hover:text-red-600
            `
          }
        }
      }
    },
    image: {
      positioner: {
        className: `
          w-full h-full overflow-hidden
          grid items-center justify-center
        `
      },
      container: {
        className: `
          w-[50px] h-[50px] overflow-hidden
          rounded-full
        `
      },
      element: {
        className: `
          w-full h-full
        `
      }
    },
    action: {
      container: {
        className: `
          w-full h-full overflow-hidden
          grid items-center justify-center
        `
      },
      button: {
        container: {
          className: `
            w-content h-content overflow-hidden
            bg-black rounded-full p-2
            grid
          `
        }
      }
    },
    index: {
      container: {
        className: `
          w-full h-full overflow-hidden
          grid justify-center items-center 
        `
      },
      element: {
        className: `
          text-theme-light-800 text-2xl font-heading
        `
      }
    },
    string: {
      container: {
        className: `
          w-full h-full overflow-hidden
          grid justify-start items-center
          cursor-pointer
        `
      },
      element: {
        className: `
          text-theme-light-900 font-bold text-md
        `
      }
    },
    custom: {
      container: {
        className: `
          w-full h-full overflow-hidden
          grid justify-start items-center
          cursor-pointer
        `
      },
      element: {
        className: ``
      }
    },
    number: {
      container: {
        className: `
          w-[100px] h-full overflow-hidden
          grid justify-start items-center truncate
          ${sortable ? 'cursor-pointer' : ''}
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
    change: {
      container: {
        className: `
          w-[100px] h-full overflow-hidden
          grid justify-center items-center
          ${sortable ? 'cursor-pointer' : ''}
        `
      },
      label: {
        className: `
          self-end
          font-bold font-mono
          text-sm text-theme-light-800
        `
      },
      value: (value: number) => ({
        className: `
          self-start
          font-bold font-mono
          text-sm text-theme-light-900
          ${value > 0 ? 'text-theme-light-500' : ''}
          ${value < 0 ? 'text-theme-light-600' : ''}
          ${value === 0 ? 'text-theme-light-900' : ''}
          flex gap-1 items-center
        `
      })
    },
    percentage: {
      container: {
        className: `
          w-[100px] h-full overflow-hidden
          grid justify-start items-center px-4
          ${sortable ? 'cursor-pointer' : ''}
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
      }
    }
  };

  const handleOnClick = () => {
    if (onClick) {
      onClick();
    } else if (onSort) {
      onSort?.(sortOrder);
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    }
  };

  return (
    <>
      <div {...styles?.stat?.container}>
        <div {...styles?.stat?.field?.container}>
          {type === 'image' && (
            <div {...styles?.image?.positioner}>
              <div {...styles?.image?.container}>
                <img src={String(value)} {...styles?.image?.element} />
              </div>
            </div>
          )}
          {type === 'string' && (
            <div {...styles?.string?.container} onClick={onClick}>
              <div {...styles?.string?.element}>{value}</div>
            </div>
          )}
          {type === 'custom' && (
            <div {...styles?.custom?.container} onClick={onClick}>
              <div {...styles?.custom?.element}>{children}</div>
            </div>
          )}
          {type === 'index' && (
            <div {...styles?.index?.container} onClick={onClick}>
              <div {...styles?.index?.element}>{value}</div>
            </div>
          )}
          {type === 'number' && (
            <div {...styles?.number?.container} onClick={handleOnClick}>
              <div {...styles?.number?.label}>{label}</div>
              <div {...styles?.number?.value}>{value}</div>
            </div>
          )}
          {type === 'change' && (
            <div {...styles?.change?.container} onClick={handleOnClick}>
              <div {...styles?.change?.label}>{label}</div>
              <div {...styles?.change?.value(Number(value))}>
                {Number(value) > 0 ? (
                  <>
                    <GoTriangleUp /> {value?.toLocaleString()} %
                  </>
                ) : Number(value) < 0 ? (
                  <>
                    <GoTriangleDown /> {String(Math.abs(Number(value)))?.toLocaleString()} %
                  </>
                ) : (
                  `-`
                )}
              </div>
            </div>
          )}
          {type === 'percentage' && (
            <div {...styles?.percentage?.container} onClick={handleOnClick}>
              <div {...styles?.percentage?.pill}>
                <div {...styles?.percentage?.progress}></div>
                <div {...styles?.percentage?.grid}>
                  <div {...styles?.percentage?.label}>{label}</div>
                  <div className="font-mono font-bold  text-sm z-20">{value}</div>
                </div>
              </div>
            </div>
          )}
          {type === 'action' && <div {...styles?.action?.container}>{content}</div>}
        </div>
        {sortable && (
          <div {...styles?.stat?.sorting?.container}>
            <button {...styles?.stat?.sorting?.asc?.container} onClick={() => onSort?.('asc')}>
              <AiOutlineCaretUp {...styles?.stat?.sorting?.asc?.element} />
            </button>
            <button {...styles?.stat?.sorting?.desc?.container} onClick={() => onSort?.('desc')}>
              <AiOutlineCaretDown {...styles?.stat?.sorting?.desc?.element} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
