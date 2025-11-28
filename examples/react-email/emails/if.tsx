import { Body, Html, Text } from "@react-email/components";
import { If, RuntimeProvider } from "react-email-handlebars";

export default function IfExample() {
  return (
    <RuntimeProvider value="preview">
      <Html>
        <Body>
          <If
            conditionPath="if-key"
            previewCondition={false}
            then={<Text>You are an admin</Text>}
            else={<Text>You are not an admin</Text>}
          />
        </Body>
      </Html>
    </RuntimeProvider>
  );
}
