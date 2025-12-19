import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DiceTool } from "./DiceTool";

describe("DiceTool", () => {
  it("renders the dice roller UI", () => {
    render(<DiceTool />);

    // The mock returns just the key name (e.g., "sides" from "diceTool.sides")
    expect(screen.getByLabelText("sides")).toBeInTheDocument();
    expect(screen.getByLabelText("count")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /roll/i })).toBeInTheDocument();
  });

  it("shows result after rolling", () => {
    render(<DiceTool />);

    const rollButton = screen.getByRole("button", { name: /roll/i });
    fireEvent.click(rollButton);

    // Result should be displayed (mocked translation returns "total")
    expect(screen.getByText("total")).toBeInTheDocument();
  });

  it("allows changing the number of sides", () => {
    render(<DiceTool />);

    const sidesInput = screen.getByLabelText("sides") as HTMLInputElement;
    fireEvent.change(sidesInput, { target: { value: "20" } });

    expect(sidesInput.value).toBe("20");
  });

  it("allows changing the number of dice", () => {
    render(<DiceTool />);

    const countInput = screen.getByLabelText("count") as HTMLInputElement;
    fireEvent.change(countInput, { target: { value: "3" } });

    expect(countInput.value).toBe("3");
  });

  it("allows switching to rolls mode", () => {
    render(<DiceTool />);

    const rollsRadio = screen.getByLabelText("modeRolls");
    fireEvent.click(rollsRadio);

    expect(rollsRadio).toBeChecked();
  });
});
