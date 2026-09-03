import { FunctionComponent, HTMLAttributes, ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from 'src/lib/utils';

type InheritedProps = Pick<HTMLAttributes<HTMLHeadingElement>, 'id'>;

type HeadingProps = InheritedProps & {
  children: ReactNode;
  level: '1' | '2' | '3' | '4' | '5' | '6';
  className?: string;
};

export const Heading: FunctionComponent<HeadingProps> = (props) => {
  const { children, level, className, ...rest } = props;
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={cn(headingVariants({ variant: level }), className)} {...rest}>
      {children}
    </Tag>
  );
};

const headingVariants = cva('text-gray-700', {
  variants: {
    variant: {
      '1': 'scroll-m-20 text-4xl font-extrabold tracking-tight',
      '2': 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      '3': 'scroll-m-20 text-2xl font-semibold tracking-tight',
      '4': 'scroll-m-20 text-xl font-semibold tracking-tight',
      '5': 'scroll-m-20 text-lg font-semibold tracking-tight',
      '6': 'scroll-m-20 text-base font-semibold tracking-tight',
    },
  },
  defaultVariants: {
    variant: '1',
  },
});
