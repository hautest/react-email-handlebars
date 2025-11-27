import type { ReactNode } from "react";
import z from "zod";
import { useRuntime } from "../contexts/useRuntime";

function createProxyFromSchema<T>(schema: z.ZodSchema<T>): T {
  if (!(schema instanceof z.ZodObject)) {
    throw new Error("Schema must be a ZodObject");
  }

  const shape = schema.shape;
  const proxyObject: Record<string, any> = {};

  for (const key in shape) {
    proxyObject[key] = `{{${key}}}`;
  }

  return proxyObject as T;
}

export interface EachProps<TItem extends object> {
  previewData: TItem[];
  each: string;
  renderItem: (item: TItem) => ReactNode;
  schema: z.ZodSchema<TItem>;
}

export function Each<TItem extends object>({
  previewData,
  renderItem,
  each,
  schema,
}: EachProps<TItem>) {
  const runtime = useRuntime("Each");

  if (runtime === "build") {
    const schemaProxy = createProxyFromSchema(schema);
    const reactProxyNode = renderItem(schemaProxy);
    return (
      <>
        {`{{#each ${each}}}`}
        {reactProxyNode}
        {`{{/each}}`}
      </>
    );
  }

  return <>{previewData?.map((item) => renderItem(item))}</>;
}
