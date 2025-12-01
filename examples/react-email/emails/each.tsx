import { Body, Html, Text, Section } from "@react-email/components";
import { Each, RuntimeProvider } from "react-email-handlebars";
import { z } from "zod";

const itemSchema = z.object({
  name: z.string(),
  email: z.string(),
});

type Item = z.infer<typeof itemSchema>;

export default function EachExample() {
  const previewData: Item[] = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
    { name: "Bob Johnson", email: "bob@example.com" },
  ];

  return (
    <RuntimeProvider value="preview">
      <Html>
        <Body>
          <Section>
            <Text>User List:</Text>
            <Each
              previewData={previewData}
              each="users"
              schema={itemSchema}
              renderItem={(item) => (
                <div key={item.email}>
                  <Text>
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
}
