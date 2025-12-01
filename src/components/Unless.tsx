import { ReactNode } from "react";
import { useRuntime } from "../contexts/useRuntime";

export interface UnlessProps {
  conditionPath: string;
  children: ReactNode;
  else?: ReactNode;
  previewCondition: boolean;
}

export function Unless(props: UnlessProps) {
  const runtime = useRuntime("Unless");

  if (runtime === "build") {
    return (
      <>
        {`{{#unless ${props.conditionPath}}}`}
        {props.children}
        {props.else && "{{else}}"}
        {props.else}
        {`{{/unless}}`}
      </>
    );
  }

  return <>{props.previewCondition ? props.else : props.children}</>;
}
