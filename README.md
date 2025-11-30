# react-email-handlebars

> Handlebars template support for React Email and JSX Email

A library that bridges the gap between React-based email templates and Handlebars templating. Write your email templates once using React components, and generate Handlebars-compatible templates for dynamic content rendering.

[한국어 문서](./README.kr.md)

## Features

- **Dual Runtime Support**: Works seamlessly with both [React Email](https://react.email/) and [JSX Email](https://jsx.email/)
- **Type-Safe**: Full TypeScript support with Zod schema validation
- **Preview Mode**: Preview your emails with sample data during development
- **Build Mode**: Generate Handlebars templates for production use
- **Conditional Rendering**: `If` component for conditional content
- **List Rendering**: `Each` component for iterating over data arrays

## Installation

```bash
npm install react-email-handlebars zod
# or
pnpm add react-email-handlebars zod
# or
yarn add react-email-handlebars zod
```

### Peer Dependencies

This library requires React 19 or higher:

```bash
npm install react@^19.0.0 react-dom@^19.0.0
```

## Usage

### Runtime Provider

Wrap your email template with `RuntimeProvider` to specify the runtime mode:

- `preview`: Renders with preview data (for development)
- `build`: Generates Handlebars template syntax (for production)

### If Component

Conditionally render content based on a Handlebars path.

#### React Email Example

```tsx
import { Body, Html, Text } from "@react-email/components";
import { If, RuntimeProvider } from "react-email-handlebars";

export default function WelcomeEmail() {
  return (
    <RuntimeProvider value="build">
      <Html>
        <Body>
          <If
            conditionPath="user.isAdmin"
            previewCondition={false}
            then={<Text>You are an admin</Text>}
            else={<Text>You are not an admin</Text>}
          />
        </Body>
      </Html>
    </RuntimeProvider>
  );
}
```

**Generated Handlebars Template:**

```handlebars
{{#if user.isAdmin}}
  You are an admin
{{else}}
  You are not an admin
{{/if}}
```

#### JSX Email Example

```tsx
import { Body, Html, Text } from "jsx-email";
import { If, RuntimeProvider } from "react-email-handlebars";

export const Template = () => (
  <RuntimeProvider value="preview">
    <Html>
      <Body>
        <If
          conditionPath="user.isPremium"
          previewCondition={true}
          then={<Text>Premium Features Unlocked!</Text>}
          else={<Text>Upgrade to Premium</Text>}
        />
      </Body>
    </Html>
  </RuntimeProvider>
);
```

### Each Component

Iterate over arrays and render items with type safety.

#### React Email Example

```tsx
import { Body, Html, Text, Section } from "@react-email/components";
import { Each, RuntimeProvider } from "react-email-handlebars";
import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  email: z.string(),
});

type User = z.infer<typeof userSchema>;

export default function UserListEmail() {
  const previewData: User[] = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Smith", email: "jane@example.com" },
  ];

  return (
    <RuntimeProvider value="build">
      <Html>
        <Body>
          <Section>
            <Text>User List:</Text>
            <Each
              previewData={previewData}
              each="users"
              schema={userSchema}
              renderItem={(user) => (
                <div>
                  <Text>Name: {user.name}</Text>
                  <Text>Email: {user.email}</Text>
                </div>
              )}
            />
          </Section>
        </Body>
      </Html>
    </RuntimeProvider>
  );
}
```

**Generated Handlebars Template:**

```handlebars
{{#each users}}
  <div>
    <p>Name: {{name}}</p>
    <p>Email: {{email}}</p>
  </div>
{{/each}}
```

#### JSX Email Example

```tsx
import { Body, Html, Text } from "jsx-email";
import { Each, RuntimeProvider } from "react-email-handlebars";
import { z } from "zod";

const productSchema = z.object({
  name: z.string(),
  price: z.number(),
});

export const Template = () => {
  const previewData = [
    { name: "Product A", price: 29.99 },
    { name: "Product B", price: 49.99 },
  ];

  return (
    <RuntimeProvider value="preview">
      <Html>
        <Body>
          <Each
            previewData={previewData}
            each="products"
            schema={productSchema}
            renderItem={(product) => (
              <Text>
                {product.name}: ${product.price}
              </Text>
            )}
          />
        </Body>
      </Html>
    </RuntimeProvider>
  );
};
```

## API Reference

### `RuntimeProvider`

**Props:**
- `value`: `"preview" | "build"` - Runtime mode

### `If`

**Props:**
- `conditionPath`: `string` - Handlebars path for the condition
- `previewCondition`: `boolean` - Condition value for preview mode
- `then`: `ReactNode` - Content to render when condition is true
- `else?`: `ReactNode` - Optional content to render when condition is false

### `Each`

**Props:**
- `previewData`: `TItem[]` - Array of items for preview mode
- `each`: `string` - Handlebars path for the array
- `schema`: `z.ZodSchema<TItem>` - Zod schema defining item structure
- `renderItem`: `(item: TItem) => ReactNode` - Function to render each item

## Development

### Setup

```bash
pnpm install
```

### Build

```bash
pnpm run build
```

### Watch Mode

```bash
pnpm run dev
```

### Run Examples

#### React Email Example

```bash
cd examples/react-email
pnpm install
pnpm run dev
```

Visit http://localhost:3000 to see the examples.

#### JSX Email Example

```bash
cd examples/jsx-email
pnpm install
pnpm run dev
```

## How It Works

The library provides two runtime modes:

1. **Preview Mode** (`runtime="preview"`):
   - Uses the provided `previewData` and `previewCondition`
   - Renders actual React components
   - Perfect for development and testing

2. **Build Mode** (`runtime="build"`):
   - Generates Handlebars template syntax
   - Uses Zod schemas to create placeholder variables
   - Outputs template strings ready for production use

The runtime context is managed via React Context API, ensuring compatibility with both React Email and JSX Email environments.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
