import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@rstest/core";
import { Unless } from "../src/components/Unless";
import { RuntimeProvider } from "../src/contexts/useRuntime";

describe("Unless Component", () => {
  describe("Preview Mode", () => {
    it("renders 'then' content when previewCondition is false", () => {
      render(
        <RuntimeProvider value="preview">
          <Unless
            conditionPath="user.isSubscribed"
            previewCondition={false}
            then={<div>Subscribe now!</div>}
          />
        </RuntimeProvider>
      );

      expect(screen.getByText("Subscribe now!")).toBeInTheDocument();
    });

    it("renders 'then' content (not else) when previewCondition is false with else provided", () => {
      render(
        <RuntimeProvider value="preview">
          <Unless
            conditionPath="user.isSubscribed"
            previewCondition={false}
            then={<div>Subscribe now!</div>}
            else={<div>Thank you for subscribing!</div>}
          />
        </RuntimeProvider>
      );

      expect(screen.getByText("Subscribe now!")).toBeInTheDocument();
      expect(
        screen.queryByText("Thank you for subscribing!")
      ).not.toBeInTheDocument();
    });

    it("renders else content when previewCondition is true", () => {
      render(
        <RuntimeProvider value="preview">
          <Unless
            conditionPath="user.isSubscribed"
            previewCondition={true}
            else={<div>Thank you for subscribing!</div>}
            then={<div>Subscribe now!</div>}
          />
        </RuntimeProvider>
      );

      expect(
        screen.getByText("Thank you for subscribing!")
      ).toBeInTheDocument();
      expect(screen.queryByText("Subscribe now!")).not.toBeInTheDocument();
    });

    it("renders nothing if else is not provided and previewCondition is true", () => {
      const { container } = render(
        <RuntimeProvider value="preview">
          <Unless
            conditionPath="user.isSubscribed"
            previewCondition={true}
            then={<div>Subscribe now!</div>}
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
          <Unless
            conditionPath="user.isSubscribed"
            previewCondition={false} // Ignored in build mode
            then={<div>Subscribe now!</div>}
          />
        </RuntimeProvider>
      );

      expect(container.innerHTML).toBe(
        "{{#unless user.isSubscribed}}<div>Subscribe now!</div>{{/unless}}"
      );
    });

    it("renders handlebars syntax with else content", () => {
      const { container } = render(
        <RuntimeProvider value="build">
          <Unless
            conditionPath="user.isSubscribed"
            previewCondition={false}
            else={<div>Thank you for subscribing!</div>}
            then={<div>Subscribe now!</div>}
          />
        </RuntimeProvider>
      );

      expect(container.innerHTML).toBe(
        "{{#unless user.isSubscribed}}<div>Subscribe now!</div>{{else}}<div>Thank you for subscribing!</div>{{/unless}}"
      );
    });
  });
});
