import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@rstest/core";
import { z } from "zod";
import { Each } from "../src/components/Each";
import { RuntimeProvider } from "../src/contexts/useRuntime";

const UserSchema = z.object({
  name: z.string(),
  email: z.string(),
});

type User = z.infer<typeof UserSchema>;

const mockUsers: User[] = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
];

describe("Each Component", () => {
  describe("Preview Mode", () => {
    it("renders list of items based on previewData", () => {
      render(
        <RuntimeProvider value="preview">
          <Each
            each="users"
            schema={UserSchema}
            previewData={mockUsers}
            renderItem={(user) => (
              <div key={user.email} data-testid="user-item">
                {user.name} - {user.email}
              </div>
            )}
          />
        </RuntimeProvider>
      );

      const items = screen.getAllByTestId("user-item");
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent("Alice - alice@example.com");
      expect(items[1]).toHaveTextContent("Bob - bob@example.com");
    });

    it("renders empty list when previewData is empty", () => {
      render(
        <RuntimeProvider value="preview">
          <Each
            each="users"
            schema={UserSchema}
            previewData={[]}
            renderItem={(user) => <div>{user.name}</div>}
          />
        </RuntimeProvider>
      );

      expect(screen.queryByTestId("user-item")).not.toBeInTheDocument();
    });
  });

  describe("Build Mode", () => {
    it("renders handlebars syntax with schema placeholders", () => {
      const { container } = render(
        <RuntimeProvider value="build">
          <Each
            each="users"
            schema={UserSchema}
            previewData={mockUsers} // Ignored in build mode
            renderItem={(user) => (
              <div>
                <span>Name: {user.name}</span>
                <span>Email: {user.email}</span>
              </div>
            )}
          />
        </RuntimeProvider>
      );

      expect(container.innerHTML).toBe(
        "{{#each users}}<div><span>Name: {{name}}</span><span>Email: {{email}}</span></div>{{/each}}"
      );
    });

    it("throws error if schema is not a ZodObject", () => {
      const originalConsoleError = console.error;
      console.error = () => {}; // No-op

      try {
        expect(() => {
          render(
            <RuntimeProvider value="build">
              <Each
                each="items"
                schema={z.array(z.string()) as any}
                previewData={[]}
                renderItem={(item: any) => <div>{item}</div>}
              />
            </RuntimeProvider>
          );
        }).toThrow("Schema must be a ZodObject");
      } finally {
        console.error = originalConsoleError;
      }
    });
  });
});
