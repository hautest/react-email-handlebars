import { ReactNode } from "react";
import { useRuntime } from "../contexts/useRuntime";

export interface IfProps {
  /**
   * The path to the variable in the handlebars context to check (e.g. "user.isSubscribed").
   */
  conditionPath: string;
  /**
   * Content to render if the condition is true.
   */
  then: ReactNode;
  /**
   * Content to render if the condition is false.
   */
  else?: ReactNode;
  /**
   * The boolean value to simulate the condition in preview mode.
   */
  previewCondition: boolean;
}

/**
 * A component that conditionally renders content.
 * In preview mode, it renders based on `previewCondition`.
 * In build mode, it generates Handlebars `{{#if}}` syntax.
 *
 * @param {IfProps} props - The component props.
 * @returns {JSX.Element} The rendered content or Handlebars syntax.
 *
 * @example
 * ```tsx
 * <If
 *   conditionPath="isLoggedIn"
 *   previewCondition={true}
 *   then={<div>Welcome back!</div>}
 *   else={<div>Please log in</div>}
 * />
 * ```
 */
export function If(props: IfProps) {
  const runtime = useRuntime("If");

  if (runtime === "build") {
    return (
      <>
        {`{{#if ${props.conditionPath}}}`}
        {props.then}
        {props.else && "{{else}}"}
        {props.else}
        {`{{/if}}`}
      </>
    );
  }

  return <>{props.previewCondition ? props.then : props.else}</>;
}
