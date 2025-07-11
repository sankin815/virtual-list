import {
  CSSProperties,
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export const ScrollBox = forwardRef<
  { scrollTo: (top: number) => void },
  { children: ReactNode; style: CSSProperties }
>(({ children, style }, actionRef) => {
  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useImperativeHandle(actionRef, () => {
    return {
      scrollTo: (top: number) => {
        setScrollTop(top);
      },
    };
  });
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);
  return (
    <div
      ref={ref}
      style={{ ...style, overflow: "auto", willChange: "transform" }}
    >
      {children}
    </div>
  );
});
