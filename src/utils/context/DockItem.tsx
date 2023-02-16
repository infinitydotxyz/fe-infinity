import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useEvent } from 'react-use';
import { twMerge } from 'tailwind-merge';
import { useMouse } from '../context/MouseProvider';
import { useDock } from './Dock';
import { DockContextType, DockItemProps, MouseType } from './types';

const DockItem = ({ id, children, highlighted, className, ...props }: DockItemProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const mouse = useMouse() as MouseType;
  const dock = useDock() as DockContextType;
  const [elCenterX, setElCenterX] = useState<number>(0);

  const dimension = useTransform(mouse.position.x, (mouseX) => {
    return 40 + 15 * Math.cos((((mouseX - elCenterX) / (dock.width ?? 0)) * Math.PI) / 2) ** 58;
  });

  const spring = useSpring(40, {
    damping: 10,
    stiffness: 150,
    mass: 0.01
  });

  useEffect(() => {
    return dimension.onChange((val) => {
      if (dock?.hovered) {
        spring.set(val);
      } else {
        spring.set(40);
      }
    });
  }, [spring, dimension, dock?.hovered]);

  useEffect(() => {
    const rect = ref.current ? ref.current.getBoundingClientRect() : null;
    if (rect) {
      setElCenterX(rect.x + rect.width / 2);
    }
  }, []);

  useEvent('resize', () => {
    const rect = ref.current ? ref.current.getBoundingClientRect() : null;
    if (rect) {
      setElCenterX(rect.x + rect.width / 2);
    }
  });

  return (
    <motion.li className="relative" {...props}>
      <motion.button
        ref={ref}
        id={id}
        className="ui-box relative h-full w-full"
        aria-describedby={id}
        style={{
          height: spring,
          width: spring
        }}
      >
        {children}
      </motion.button>
      {highlighted && (
        <span
          className={twMerge('absolute left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-primary', className)}
          aria-hidden="true"
        />
      )}
    </motion.li>
  );
};

export default DockItem;
