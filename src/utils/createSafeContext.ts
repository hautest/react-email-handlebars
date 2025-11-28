import { createContext, useContext, type Context } from "react";
import { createRequire } from "module";

export function createSafeContext<T>(contextName: string) {
  let createContextFn: <TValue>(defaultValue: TValue) => Context<TValue> = createContext;
  let useContextFn: <TValue>(context: Context<TValue>) => TValue = useContext;

  // Try to use jsx-email's context functions if available
  try {
    const req = createRequire(import.meta.url);
    const jsxEmail = req("jsx-email");

    if (jsxEmail?.createContext && jsxEmail?.useContext) {
      createContextFn = jsxEmail.createContext;
      useContextFn = jsxEmail.useContext;
    }
  } catch {
    // jsx-email not found, use React's context (already set as default)
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
