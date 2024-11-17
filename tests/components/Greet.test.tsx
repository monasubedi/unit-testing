import { render, screen } from "@testing-library/react";
import Greet from "../../src/components/Greet";

describe("Greet", () => {
  it("should render Hello with the name when name is provided", () => {
    render(<Greet name="Mona Subedi" />);
    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/mona subedi/i);
  });
  it("should render login button when name is not provided", () => {
    render(<Greet />);
    const login = screen.getByRole("button");
    expect(login).toBeInTheDocument();
    expect(login).toHaveTextContent(/login/i);
  });
});
