import { ReactNode } from "react";
import { useRuntime } from "../contexts/useRuntime";

export interface IfProps {
  conditionPath: string;
  then: ReactNode;
  else?: ReactNode;
  previewCondition: boolean;
}

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
