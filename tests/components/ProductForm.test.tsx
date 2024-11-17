import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";
import ProductForm from "../../src/components/ProductForm";
import { Category, Product } from "../../src/entities";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";

describe("ProductForm", () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });
  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  const renderProductForm = (product?: Product) => {
    const onSubmit = vi.fn();
    render(
      <>
        <ProductForm product={product} onSubmit={onSubmit} />
        <Toaster />
      </>,
      {
        wrapper: AllProviders,
      }
    );

    return {
      getPlaceholderText: (name: RegExp) =>
        screen.getByPlaceholderText(new RegExp(name)),
      onSubmit,
    };
  };
  it("should render all the form fields", async () => {
    const { getPlaceholderText } = renderProductForm();
    await screen.findByRole("form");
    expect(getPlaceholderText(/name/i)).toBeInTheDocument();

    expect(getPlaceholderText(/price/i)).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", { name: /category/i })
    ).toBeInTheDocument();
  });

  it("should render the initial data", async () => {
    const product: Product = {
      id: 1,
      name: "product one",
      price: 10,
      categoryId: category.id,
    };
    const { getPlaceholderText } = renderProductForm(product);
    await screen.findByRole("form");

    expect(getPlaceholderText(/name/i)).toHaveValue(product.name);

    expect(getPlaceholderText(/price/i)).toHaveValue(product.price.toString());

    expect(
      screen.getByRole("combobox", { name: /category/i })
    ).toHaveTextContent(category.name);
  });

  it("should put focus on first input after rendering the page", async () => {
    const { getPlaceholderText } = renderProductForm();
    await screen.findByRole("form");
    expect(getPlaceholderText(/name/i)).toHaveFocus();
  });

  it.each([
    { scenario: "missing", errorMessage: /required/i },
    {
      scenario: "exceeds 255 characters",
      name: "a".repeat(256),
      errorMessage: /255/i,
    },
  ])(
    "should display error message when name $scenario",
    async ({ name, errorMessage }) => {
      const { getPlaceholderText } = renderProductForm();
      await screen.findByRole("form");
      const submitBtn = screen.getByRole("button", { name: /submit/i });
      const user = userEvent.setup();
      if (name !== undefined)
        await user.type(getPlaceholderText(/name/i), name);
      await user.type(getPlaceholderText(/price/i), "10");
      const select = screen.getByRole("combobox", { name: /category/i });
      await user.click(select);
      const options = screen.getAllByRole("option");
      await user.click(options[0]);

      await user.click(submitBtn);
      const alert = await screen.findByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(errorMessage);
    }
  );

  it.each([
    { scenario: "missing", errorMessage: /required/i },
    { scenario: "exceeds 1000", price: 1200, errorMessage: /1000/i },
    { scenario: "lower than 1", price: 0, errorMessage: /1/i },
    { scenario: "negative", price: -1, errorMessage: /1/i },
    { scenario: "not a number", price: "a", errorMessage: /required/i },
  ])(
    "should display price error when $scenario ",
    async ({ price, errorMessage }) => {
      const { getPlaceholderText } = renderProductForm();
      await screen.findByRole("form");
      const user = userEvent.setup();
      await user.type(getPlaceholderText(/name/i), "something");
      const select = screen.getByRole("combobox", { name: /category/i });
      await user.click(select);
      const options = screen.getAllByRole("option");
      await user.click(options[0]);
      if (price !== undefined) {
        await user.type(getPlaceholderText(/price/i), price.toString());
      }

      const submitBtn = screen.getByRole("button", { name: /submit/i });
      await user.click(submitBtn);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent(errorMessage);
    }
  );

  it("should call onsubmit with correct formData", async () => {
    const { getPlaceholderText, onSubmit } = renderProductForm();
    await screen.findByRole("form");
    const user = userEvent.setup();
    await user.type(getPlaceholderText(/name/i), "product one");
    await user.type(getPlaceholderText(/price/i), "10");
    const select = screen.getByRole("combobox", { name: /category/i });
    await user.click(select);
    const options = screen.getAllByRole("option");
    await user.click(options[0]);

    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await user.click(submitBtn);
    expect(onSubmit).toHaveBeenCalledWith({
      name: "product one",
      price: 10,
      categoryId: category.id,
    });
  });

  it("should return toast error if onsubmit fails", async () => {
    const { getPlaceholderText, onSubmit } = renderProductForm();
    onSubmit.mockRejectedValue({});
    await screen.findByRole("form");
    const user = userEvent.setup();
    await user.type(getPlaceholderText(/name/i), "product one");
    await user.type(getPlaceholderText(/price/i), "10");
    const select = screen.getByRole("combobox", { name: /category/i });
    await user.click(select);
    const options = screen.getAllByRole("option");
    await user.click(options[0]);

    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await user.click(submitBtn);

    const status = await screen.findByRole("status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveTextContent(/error/i);
  });

  it("should disable the button upon submission", async () => {
    const { getPlaceholderText, onSubmit } = renderProductForm();
    onSubmit.mockReturnValue(new Promise(() => {}));
    await screen.findByRole("form");
    const user = userEvent.setup();
    await user.type(getPlaceholderText(/name/i), "product one");
    await user.type(getPlaceholderText(/price/i), "10");
    const select = screen.getByRole("combobox", { name: /category/i });
    await user.click(select);
    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await user.click(submitBtn);
    expect(submitBtn).toBeDisabled();
  });

  it("should enable the button after submiting", async () => {
    const { onSubmit, getPlaceholderText } = renderProductForm();
    onSubmit.mockResolvedValue({});
    await screen.findByRole("form");
    const user = userEvent.setup();
    await user.type(getPlaceholderText(/name/i), "product one");
    await user.type(getPlaceholderText(/price/i), "10");
    const select = screen.getByRole("combobox", { name: /category/i });
    await user.click(select);
    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await user.click(submitBtn);
    expect(submitBtn).not.toBeDisabled();
  });
  it("should enable the button after submission fails", async () => {
    const { onSubmit, getPlaceholderText } = renderProductForm();
    onSubmit.mockRejectedValue("error");
    await screen.findByRole("form");
    const user = userEvent.setup();
    await user.type(getPlaceholderText(/name/i), "product one");
    await user.type(getPlaceholderText(/price/i), "10");
    const select = screen.getByRole("combobox", { name: /category/i });
    await user.click(select);
    const options = screen.getAllByRole("option");
    await user.click(options[0]);
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    await user.click(submitBtn);
    expect(submitBtn).not.toBeDisabled();
  });
});
