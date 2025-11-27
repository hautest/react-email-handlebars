import * as React from "react";

// jsx-email compatibility: try to import jsx-email's context if available
let jsxEmailContext: any;
try {
  // @ts-ignore - optional import
  jsxEmailContext = require("jsx-email");
} catch {
  // jsx-email not available, use standard React
}

function createContextCompat<T>(defaultValue: T) {
  if (jsxEmailContext?.createContext) {
    return jsxEmailContext.createContext(defaultValue);
  }
  return React.createContext(defaultValue);
}

function useContextCompat<T>(context: React.Context<T>) {
  if (jsxEmailContext?.useContext) {
    return jsxEmailContext.useContext(context);
  }
  return React.useContext(context);
}

export function createSafeContext<T>(contextName: string) {
  const context = createContextCompat<T | null>(null);

  const useSafeContext = (consumerName: string) => {
    const value = useContextCompat(context);
    if (value === null) {
      throw new Error(`${consumerName} must be used within ${contextName}`);
    }
    return value;
  };
  return [context.Provider, useSafeContext] as const;
}
