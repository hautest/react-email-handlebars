import { createContext, use } from "react";

export function createSafeContext<T>(contextName: string) {
  const context = createContext<T | null>(null);

  const useCustom = (consumerName: string) => {
    const value = use(context);
    if (value === null) {
      throw new Error(`${consumerName} must be used within ${contextName}`);
    }
    return value;
  };
  return [context.Provider, useCustom] as const;
}
