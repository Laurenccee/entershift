import React from 'react';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function Title({ className, children }: TitleProps) {
  return (
    <>
      <h1
        className={`text-4xl  underline px-2 bg-primary font-semibold ${className}`}
      >
        {children}
      </h1>
    </>
  );
}
