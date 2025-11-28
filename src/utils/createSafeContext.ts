import type { Context } from "react";
import { createRequire } from "module";

export function createSafeContext<T>(contextName: string) {
  let createContextFn: <TValue>(defaultValue: TValue) => Context<TValue>;
  let useContextFn: <TValue>(context: Context<TValue>) => TValue;

  try {
    const req = createRequire(import.meta.url);
    const jsxEmail = req("jsx-email");

    if (jsxEmail?.createContext && jsxEmail?.useContext) {
      createContextFn = jsxEmail.createContext;
      useContextFn = jsxEmail.useContext;
    }
  } catch {
    // jsx-email not found
  }

  if (!createContextFn!) {
    // @ts-ignore
    const { createRequire } = require("module");
    const req = createRequire(import.meta.url);
    const React = req("react");
    createContextFn = React.createContext;
    useContextFn = React.useContext;
  }

  const context = createContextFn<T | null>(null);

  const useSafeContext = (consumerName: string): T => {
    const value = useContextFn(context);
    if (value === null) {
      throw new Error(`${consumerName} must be used within ${contextName}`);
    }
    return value;
  };

  return [context.Provider, useSafeContext] as const;
}
