import * as React from "react";

/**
 * 自定义 Hook：useRefFunc
 *
 * 功能：
 * 1. 返回一个缓存的函数引用，该函数可以在依赖项未发生变化的情况下保持引用不变。
 * 2. 即使在组件多次渲染时，仍然能够调用最新的回调函数。
 *
 * 使用场景：
 * 适用于需要在依赖项不变化的情况下，将最新的回调函数传递给子组件、事件监听器或异步操作。
 *
 * 参数：
 * @param callback {T} - 需要缓存的回调函数。
 *
 * 返回值：
 * {T} - 包装后的回调函数，其行为与传入的 `callback` 一致。
 *
 * 实现原理：
 * 1. 使用 `useRef` 保存传入的回调函数，确保引用最新版本的回调。
 * 2. 使用 `useCallback` 创建一个固定引用的函数，在调用时从 `ref` 中动态获取最新的回调。
 */
export function useRefFunc<T extends (...args: any[]) => any>(callback: T): T {
  const funcRef = React.useRef<T | undefined>(undefined);
  funcRef.current = callback;

  const cacheFn = React.useCallback((...args: any[]) => {
    return funcRef.current?.(...args);
  }, []);

  return cacheFn as T;
}
