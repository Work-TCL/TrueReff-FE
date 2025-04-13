import { useState } from 'react';

const useIsTruncate = (checkHorizontalOverflow?: boolean) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const isTextOverflow = (element: HTMLElement) => {
    if (checkHorizontalOverflow) {
      return element.scrollWidth > element.clientWidth;
    } else {
      return element.scrollHeight > element.clientHeight;
    }
  };

  const handleMouseEnterTruncate = (
    event: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) => {
    const element = event.currentTarget;
    setShowTooltip(isTextOverflow(element));
  };

  const handleMouseLeaveTruncate = () => {
    setShowTooltip(false);
  };

  return { showTooltip, handleMouseEnterTruncate, handleMouseLeaveTruncate };
};

export default useIsTruncate;
