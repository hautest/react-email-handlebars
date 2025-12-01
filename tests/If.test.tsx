import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@rstest/core";
import { If } from "../src/components/If";
import { RuntimeProvider } from "../src/contexts/useRuntime";

describe("If Component", () => {
  describe("Preview Mode", () => {
    it("renders 'then' content when previewCondition is true", () => {
      render(
        <RuntimeProvider value="preview">
          <If
            conditionPath="showTitle"
            previewCondition={true}
            then={<h1>Title shown</h1>}
            else={<h1>Title hidden</h1>}
          />
        </RuntimeProvider>
      );

      expect(screen.getByText("Title shown")).toBeInTheDocument();
      expect(screen.queryByText("Title hidden")).not.toBeInTheDocument();
    });

    it("renders 'else' content when previewCondition is false", () => {
      render(
        <RuntimeProvider value="preview">
          <If
            conditionPath="showTitle"
            previewCondition={false}
            then={<h1>Title shown</h1>}
            else={<h1>Title hidden</h1>}
          />
        </RuntimeProvider>
      );

      expect(screen.getByText("Title hidden")).toBeInTheDocument();
      expect(screen.queryByText("Title shown")).not.toBeInTheDocument();
    });

    it("renders nothing if else is not provided and previewCondition is false", () => {
      const { container } = render(
        <RuntimeProvider value="preview">
          <If
            conditionPath="showTitle"
            previewCondition={false}
            then={<h1>Title shown</h1>}
          />
        </RuntimeProvider>
      );

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("Build Mode", () => {
    it("renders handlebars syntax with then content", () => {
      const { container } = render(
        <RuntimeProvider value="build">
          <If
            conditionPath="user.isSubscribed"
            previewCondition={true} // Ignored in build mode
            then={<div>Exclusive Content</div>}
          />
        </RuntimeProvider>
      );

      expect(container.innerHTML).toBe(
        "{{#if user.isSubscribed}}<div>Exclusive Content</div>{{/if}}"
      );
    });

    it("renders handlebars syntax with else content", () => {
      const { container } = render(
        <RuntimeProvider value="build">
          <If
            conditionPath="user.isSubscribed"
            previewCondition={true}
            then={<div>Exclusive Content</div>}
            else={<div>Public Content</div>}
          />
        </RuntimeProvider>
      );

      expect(container.innerHTML).toBe(
        "{{#if user.isSubscribed}}<div>Exclusive Content</div>{{else}}<div>Public Content</div>{{/if}}"
      );
    });
  });
});
