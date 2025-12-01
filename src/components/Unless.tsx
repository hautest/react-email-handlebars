import { ReactNode } from "react";
import { useRuntime } from "../contexts/useRuntime";

export interface UnlessProps {
  /**
   * The path to the variable in the handlebars context to check (e.g. "user.hasPaid").
   */
  conditionPath: string;
  /**
   * Content to render if the condition is false (the main block of #unless).
   */
  then: ReactNode;
  /**
   * Content to render if the condition is true (the {{else}} block).
   */
  else?: ReactNode;
  /**
   * The boolean value to simulate the condition in preview mode.
   * Note: If this is true, the `else` block is rendered. If false, `then` is rendered.
   */
  previewCondition: boolean;
}

/**
 * A component that conditionally renders content when a condition is falsy.
 * This is the inverse of the `If` component.
 *
 * @param {UnlessProps} props - The component props.
 * @returns {JSX.Element} The rendered content or Handlebars syntax.
 *
 * @example
 * ```tsx
 * <Unless
 *   conditionPath="user.isVerified"
 *   previewCondition={false}
 *   then={<div>Please verify your email.</div>}
 *   else={<div>Thanks for verifying!</div>}
 * />
 * ```
 */
export function Unless(props: UnlessProps) {
  const runtime = useRuntime("Unless");

  if (runtime === "build") {
    return (
      <>
        {`{{#unless ${props.conditionPath}}}`}
        {props.then}
        {props.else && "{{else}}"}
        {props.else}
        {`{{/unless}}`}
      </>
    );
  }

  return <>{props.previewCondition ? props.else : props.then}</>;
}
