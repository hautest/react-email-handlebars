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
  /**
   * The array of data items to loop over in the preview mode.
   */
  previewData: TItem[];
  /**
   * The name of the variable to loop over in the Handlebars template (e.g., "users").
   */
  each: string;
  /**
   * A function that returns a React Node for each item.
   */
  renderItem: (item: TItem) => ReactNode;
  /**
   * A Zod schema representing the shape of the item. Used to generate Handlebars placeholders in build mode.
   */
  schema: z.ZodSchema<TItem>;
}

/**
 * A component that renders a list of items.
 * In preview mode, it iterates over `previewData`.
 * In build mode, it generates a Handlebars `{{#each}}` block using placeholders derived from the `schema`.
 *
 * @template TItem - The type of the item being iterated over.
 * @param {EachProps<TItem>} props - The component props.
 * @returns {JSX.Element} The rendered list or Handlebars syntax.
 *
 * @example
 * ```tsx
 * const UserSchema = z.object({ name: z.string() });
 *
 * <Each
 *   each="users"
 *   schema={UserSchema}
 *   previewData={[{ name: "Alice" }]}
 *   renderItem={(user) => <div>{user.name}</div>}
 * />
 * ```
 */
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
