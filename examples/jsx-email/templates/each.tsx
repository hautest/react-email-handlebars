import { Body, Head, Html, Preview, Text, Section } from "jsx-email";
import { Each, RuntimeProvider } from "react-email-handlebars";
import { z } from "zod";

export const templateName = "each";

const itemSchema = z.object({
  name: z.string(),
  email: z.string(),
});

type Item = z.infer<typeof itemSchema>;

export const Template = () => {
  const previewData: Item[] = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
    { name: "Bob Johnson", email: "bob@example.com" },
  ];

  return (
    <RuntimeProvider value="preview">
      <Html>
        <Head />
        <Preview>each example</Preview>
        <Body>
          <Section>
            <Text>User List:</Text>
            <Each
              previewData={previewData}
              each="users"
              schema={itemSchema}
              renderItem={(item) => (
                <div>
                  <Text style={{ color: "green" }}>
                    Name: {item.name}, Email: {item.email}
                  </Text>
                </div>
              )}
            />
          </Section>
        </Body>
      </Html>
    </RuntimeProvider>
  );
};
