import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  const renderSearchbox = () => {
    const onChange = vi.fn();
    const searchTerm = "searchTerm";
    render(<SearchBox onChange={() => vi.fn()} />);
    return {
      onChange,
      searchTerm,
      input: screen.getByPlaceholderText(/search/i),
      user: userEvent.setup(),
    };
  };
  it("should return the input text", () => {
    const { input } = renderSearchbox();
    expect(input).toBeInTheDocument();
  });
  // it("should call the onchange function when user types and hit enter", async () => {
  //   const { input, user, onChange, searchTerm } = renderSearchbox();

  //   await user.type(input, `${searchTerm}{enter}`);
  //   expect(onChange).toHaveBeenCalledWith(searchTerm);
  // });
  it("should not call the onchange function when user types nth and hit enter", async () => {
    const { input, user, onChange } = renderSearchbox();
    await user.type(input, `{enter}`);
    expect(onChange).not.toHaveBeenCalled();
  });
});
