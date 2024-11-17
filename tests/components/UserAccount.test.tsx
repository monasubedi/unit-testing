import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  const user: User = { id: 1, name: "mona" };
  it("should render edit button when the user has admin access", () => {
    render(<UserAccount user={{ ...user, isAdmin: true }} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });
  it("should render edit button when the user does not have admin access", () => {
    render(<UserAccount user={user} />);

    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });
  it("should render user name", () => {
    render(<UserAccount user={user} />);

    const text = screen.getByText(user.name);
    expect(text).toBeInTheDocument();
  });
});
