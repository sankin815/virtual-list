import React, { useRef } from "react";
import { VirtualList } from "@/components";

export const Home = () => {
  const dataSource1 = Array.from({ length: 1000 }, (_, index) => index);
  const containerStyle = {
    width: 200,
    height: 300,
    backgroundColor: "lightgray",
  };

  const actionRef = useRef<{ scrollTo: (top: number) => void } | undefined>(
    undefined
  );

  console.log(
    "%c actionRef ",
    "background: #604c48; padding: 6px; border-radius: 1px 0 0 1px; color: #fff",
    actionRef
  );
  return (
    <div
      style={{
        padding: 88,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 88,
      }}
    >
      <button onClick={() => actionRef.current?.scrollTo(1000)}>
        scroll to 1000
      </button>
      <VirtualList
        containerStyle={containerStyle}
        dataSource={dataSource1}
        type="fixed"
        itemHeight={50}
        renderItem={(data, index, style) => (
          <div style={style}>
            {data}-{index}
          </div>
        )}
        actionRef={actionRef}
      />
      <VirtualList
        containerStyle={containerStyle}
        dataSource={dataSource1}
        type="fixed"
        itemHeight={100}
        renderItem={(data, index, style) => (
          <div style={style}>
            {data}-{index}
          </div>
        )}
      />
      <VirtualList
        containerStyle={containerStyle}
        dataSource={dataSource1}
        type="fixed"
        itemHeight={100}
        renderItem={(data, index, style) => (
          <div style={style}>
            {data}-{index}
          </div>
        )}
      />
    </div>
  );
};
