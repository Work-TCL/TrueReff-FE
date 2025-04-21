import { useRef, useState } from 'react';

const useIsTruncate = (checkHorizontalOverflow?: boolean) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const textRef = useRef<HTMLParagraphElement>(null);

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

  return { showTooltip, handleMouseEnterTruncate, handleMouseLeaveTruncate,textRef };
};

export default useIsTruncate;
