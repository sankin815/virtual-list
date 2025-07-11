import { useRefFunc, useScroll } from "@/hooks";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

export type VirtualListProps<T> = {
  dataSource: Array<T>;
  overScanCount?: number;
  containerStyle: { height: number } & Omit<React.CSSProperties, "height">;
  contentStyle?: React.CSSProperties;
  actionRef?: React.RefObject<{ scrollTo: (top: number) => void } | undefined>;
  renderItem: (
    dataSource: T,
    index: number,
    { height }: CSSProperties
  ) => React.ReactNode;
} & (
  | {
      /** 固定高度列表 */
      type: "fixed";
      itemHeight: number;
    }
  | {
      /** 变高度列表，不同index对应的高度不同 */
      type: "variable";
      getItemHeight: (index: number) => number;
    }
  | {
      /** 动态高度，用户也不知道每个item的高度 */
      type: "dynamic";
    }
);

export const VirtualList = <T,>(props: VirtualListProps<T>) => {
  const defaultProps = {
    overScanCount: 5,
  };
  const {
    dataSource,
    overScanCount,
    containerStyle,
    contentStyle,
    renderItem,
    actionRef,
    ...virtualTypeProps
  } = {
    ...defaultProps,
    ...props,
  };

  const cacheSizeMap = useRef<Map<number, { height: number; top: number }>>(
    new Map()
  );

  const ref = useRef<HTMLDivElement>(null);
  const { scrollTop, setScrollTop } = useScroll({ ref });
  useEffect(() => {
    if (actionRef) {
      actionRef.current = {
        scrollTo: setScrollTop,
      };
    }
  }, [actionRef, setScrollTop]);

  const totalHeight = useMemo(() => {
    switch (virtualTypeProps.type) {
      case "fixed":
        return dataSource.length * virtualTypeProps.itemHeight;
      case "variable":
        return dataSource.reduce(
          (acc, item, index) => acc + virtualTypeProps.getItemHeight(index),
          0
        );
      case "dynamic": {
        return 0;
      }
      default: {
        const tsNever: never = virtualTypeProps;
        if (process.env.NODE_ENV !== "production") {
          throw new Error(`Invalid virtual type: ${JSON.stringify(tsNever)}`);
        }
      }
    }
  }, [dataSource, virtualTypeProps]);

  const indexInfo = useMemo(() => {
    switch (virtualTypeProps.type) {
      case "fixed": {
        const startIndex = Math.floor(scrollTop / virtualTypeProps.itemHeight);
        const endIndex =
          Math.ceil(containerStyle.height / virtualTypeProps.itemHeight) +
          startIndex -
          1;
        return {
          startIndex,
          endIndex,
          overScanStartIndex: Math.max(0, startIndex - overScanCount),
          overScanEndIndex: Math.min(
            dataSource.length - 1,
            endIndex + overScanCount
          ),
        };
      }
      case "variable": {
        return {
          startIndex: scrollTop,
          endIndex: scrollTop,
          overScanStartIndex: scrollTop - overScanCount,
          overScanEndIndex: scrollTop + overScanCount,
        };
      }
      case "dynamic": {
        return {
          startIndex: scrollTop,
          endIndex: scrollTop,
          overScanStartIndex: scrollTop - overScanCount,
          overScanEndIndex: scrollTop + overScanCount,
        };
      }
      default: {
        const tsNever: never = virtualTypeProps;
        if (process.env.NODE_ENV !== "production") {
          throw new Error(`Invalid virtual type: ${JSON.stringify(tsNever)}`);
        }
      }
    }
  }, [
    scrollTop,
    overScanCount,
    virtualTypeProps,
    dataSource.length,
    containerStyle.height,
  ]);
  console.log(
    "%c indexInfo ",
    "background: #83b154; padding: 6px; border-radius: 1px 0 0 1px; color: #fff",
    indexInfo
  );

  const items = useMemo(() => {
    const _items: React.ReactNode[] = [];
    for (
      let i = indexInfo!.overScanStartIndex;
      i <= indexInfo!.overScanEndIndex;
      i++
    ) {
      _items.push(
        renderItem(dataSource[i], i, {
          position: "absolute",
          top: i * (virtualTypeProps.type === "fixed" ? virtualTypeProps.itemHeight : 0),
          left: 0,
          width: "100%",
          height:
            virtualTypeProps.type === "fixed" ? virtualTypeProps.itemHeight : 0,
        })
      );
    }
    return _items;
  }, [dataSource, indexInfo, renderItem, virtualTypeProps]);

  console.log(
    "%c items ",
    "background: #497566; padding: 6px; border-radius: 1px 0 0 1px; color: #fff",
    items
  );

  return (
    <div
      style={{
        ...containerStyle,
        position: "relative",
        overflow: "auto",
        willChange: "transform",
      }}
      ref={ref}
      onScroll={(e) => {
        setScrollTop(e.currentTarget.scrollTop);
      }}
    >
      <div style={{ ...contentStyle, height: totalHeight }}>{items}</div>
    </div>
  );
};

VirtualList.displayName = "VirtualList";
