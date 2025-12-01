import { Body, Head, Html, Preview, Text, Section } from "jsx-email";
import { Unless, RuntimeProvider } from "react-email-handlebars";

export const templateName = "unless";

export const Template = () => {
  return (
    <RuntimeProvider value="preview">
      <Html>
        <Head />
        <Preview>unless example</Preview>
        <Body>
          <Section>
            <Text>Unless Example:</Text>
            <Unless
              conditionPath="user.isVerified"
              previewCondition={false}
              then={
                <Text style={{ color: "orange" }}>
                  Please verify your email address.
                </Text>
              }
              else={<Text style={{ color: "blue" }}>Email verified!</Text>}
            />
          </Section>
        </Body>
      </Html>
    </RuntimeProvider>
  );
};
