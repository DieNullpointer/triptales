import React from 'react';

type Props = {
  spaceBetween?: number;
  children: React.ReactNode;
};

const List: React.FC<Props> = ({ spaceBetween = 4, children }) => {
  return (
    <div className={`flex flex-col items-start space-y-${spaceBetween}`}>
      {children}
    </div>
  );
};

export default List;
