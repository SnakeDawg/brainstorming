import { useState } from 'react';

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 px-3 py-2 text-sm text-white bg-neutral-800 rounded-lg shadow-lg whitespace-normal max-w-xs -top-2 left-full ml-2 transform -translate-y-full">
          {content}
          <div className="absolute top-1/2 right-full transform translate-y-1/2">
            <div className="border-8 border-transparent border-r-neutral-800"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
