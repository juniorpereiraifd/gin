import {
  AriaAttributes,
  AriaRole,
  FunctionComponent,
  ReactNode,
  useEffect,
  isValidElement,
  PropsWithChildren,
} from 'react';
import { AnimatePresence, motion, usePresence, HTMLMotionProps, TargetAndTransition } from 'framer-motion';

type AriaProps = AriaAttributes & {
  role?: AriaRole;
};

export type RevealProps = Omit<HTMLMotionProps<'div'>, keyof AriaProps> & {
  ariaProps?: AriaProps;
  fadeDuration?: number;
  sizeDuration?: number;
  className?: string;
  children?: ReactNode;
  onReveal?: () => void;
  onHide?: () => void;
};

export type RevealContentProps = Omit<RevealProps, 'children'> & {
  children: ReactNode;
};

function isNonEmpty(children: ReactNode): boolean {
  return isValidElement(children) || typeof children === 'string';
}

const RevealContent: FunctionComponent<PropsWithChildren<RevealContentProps>> = (props) => {
  const [isPresent, safeToRemove] = usePresence();
  const { children, ariaProps, fadeDuration = 0.2, sizeDuration = 0.2, onReveal, onHide, ...htmlProps } = props;

  useEffect(() => {
    if (!isPresent) {
      safeToRemove?.();
    }
  }, [isPresent, safeToRemove]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        height: 0,
      }}
      animate={{
        opacity: 1,
        height: 'auto',
        transition: {
          height: {
            duration: sizeDuration,
          },
          opacity: {
            delay: sizeDuration,
            duration: fadeDuration,
          },
        },
      }}
      exit={{
        opacity: 0,
        height: 0,
        transition: {
          height: {
            delay: fadeDuration,
            duration: sizeDuration,
          },
          opacity: {
            duration: fadeDuration,
          },
        },
      }}
      transition={{
        easings: {
          type: 'tween',
          ease: 'easeInOut',
        },
      }}
      onAnimationComplete={(definition: TargetAndTransition): void => {
        if (definition.opacity === 1) {
          onReveal?.();
        }

        if (definition.opacity === 0) {
          onHide?.();
        }
      }}
      {...htmlProps}
      {...(isPresent ? ariaProps : { 'aria-hidden': true })}
    >
      {children}
    </motion.div>
  );
};

export const Reveal: FunctionComponent<PropsWithChildren<RevealProps>> = ({ children, ...props }) => (
  <AnimatePresence initial={false}>
    {isNonEmpty(children) && <RevealContent {...props}>{children}</RevealContent>}
  </AnimatePresence>
);
