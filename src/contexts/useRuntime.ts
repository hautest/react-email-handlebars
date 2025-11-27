import { createSafeContext } from "../utils/createSafeContext";

export type Runtime = "build" | "preview";

export const [RuntimeProvider, useRuntime] =
  createSafeContext<Runtime>("RuntimeContext");
