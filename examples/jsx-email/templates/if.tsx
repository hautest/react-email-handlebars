import { Body, Head, Html, Preview, Text } from "jsx-email";
import { If, RuntimeProvider } from "react-email-handlebars";

export const templateName = "if";

export const Template = () => (
  <RuntimeProvider value="preview">
    <Html>
      <Head />
      <Preview>if</Preview>
      <Body>
        <If
          conditionPath="if-key"
          previewCondition={true}
          then={<Text style={{ color: "red" }}>You are an admin</Text>}
          else={<Text style={{ color: "blue" }}>You are not an admin</Text>}
        />
        <Text>test</Text>
      </Body>
    </Html>
  </RuntimeProvider>
);
