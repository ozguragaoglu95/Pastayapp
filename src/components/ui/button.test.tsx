import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button Component", () => {
    it("renders button correctly", () => {
        render(<Button>Click me</Button>);
        const button = screen.getByText("Click me");
        expect(button).toBeInTheDocument();
    });

    it("applies variant classes correctly", () => {
        // This is a basic test, in a real scenario we'd check class names or styles
        render(<Button variant="destructive">Delete</Button>);
        const button = screen.getByText("Delete");
        expect(button).toHaveClass("bg-destructive");
    });
});
