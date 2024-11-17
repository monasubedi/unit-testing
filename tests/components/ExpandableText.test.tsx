import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
  it("should return the text if the text length is lower than the limit", () => {
    const text = "Hello";
    render(<ExpandableText text={text} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });
  it("should return the truncated text if the text length is more than the limit", () => {
    const text = "H".repeat(300);
    render(<ExpandableText text={text} />);
    const truncatedText = text.substring(0, 255) + "...";
    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    const button = screen.getByRole("button");
    // expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/more/i);
  });
  it("should return the full text if show more button is clicked", async () => {
    const text = "H".repeat(300);
    render(<ExpandableText text={text} />);

    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);
    expect(screen.getByText(text)).toBeInTheDocument();
    expect(button).toHaveTextContent(/less/i);
  });
  it("should return the truncated text if show less button is clicked", async () => {
    const text = "H".repeat(300);
    const truncatedText = text.substring(0, 255) + "...";
    render(<ExpandableText text={text} />);

    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);
    await user.click(button);
    expect(screen.getByText(truncatedText)).toBeInTheDocument();
    expect(button).toHaveTextContent(/more/i);
  });
});
