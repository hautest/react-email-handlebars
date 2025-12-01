import { Body, Html, Text, Section } from "@react-email/components";
import { Unless, RuntimeProvider } from "react-email-handlebars";

export default function UnlessExample() {
  return (
    <RuntimeProvider value="preview">
      <Html>
        <Body>
          <Section>
            <Text>Unless Example:</Text>
            <Unless
              conditionPath="user.isPaid"
              previewCondition={false}
              then={
                <Text style={{ color: "red" }}>
                  Please upgrade your account to access premium features.
                </Text>
              }
              else={
                <Text style={{ color: "green" }}>
                  Thank you for being a premium member!
                </Text>
              }
            />
          </Section>
        </Body>
      </Html>
    </RuntimeProvider>
  );
}
