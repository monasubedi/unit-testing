import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const renderSelect = () => {
    const onChange = vi.fn();
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    );

    return {
      onChange,
      button: screen.getByRole("combobox"),
      user: userEvent.setup(),
      getOptions: () => screen.findAllByRole("option"),
      getOption: (label: RegExp) =>
        screen.findByRole("option", { name: label }),
    };
  };
  it("should return select with new default", () => {
    const { button } = renderSelect();

    expect(button).toHaveTextContent(/new/i);
  });
  it("should return 3 items", async () => {
    const { button, user, getOptions } = renderSelect();
    await user.click(button);
    const options = await getOptions();
    expect(options).toHaveLength(3);
    const values = options.map((option) => option.textContent);
    expect(values).toEqual(["New", "Processed", "Fulfilled"]);
  });
  it.each([
    {
      label: /processed/i,
      value: "processed",
    },
    {
      label: /fulfilled/i,
      value: "fulfilled",
    },
  ])(
    "should call onChange with $value when $label is selected",
    async ({ label, value }) => {
      const { button, user, getOption, onChange } = renderSelect();
      await user.click(button);
      const option = await getOption(label);
      await user.click(option);
      expect(onChange).toHaveBeenCalledWith(value);
    }
  );
  it("should call onChange with new when  new is selected", async () => {
    const { button, user, getOption, onChange } = renderSelect();
    await user.click(button);
    const option = await getOption(/processed/i);
    await user.click(option);
    await user.click(button);
    const newOption = await getOption(/new/i);
    await user.click(newOption);
    expect(onChange).toHaveBeenCalledWith("new");
  });
});
