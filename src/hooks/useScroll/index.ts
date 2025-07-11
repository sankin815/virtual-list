import { useEffect, useState } from "react";

export const useScroll = ({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement | HTMLSpanElement | null>;
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = scrollTop;
    }
  }, [ref, scrollTop]);
  return {
    scrollTop,
    setScrollTop,
  };
};
