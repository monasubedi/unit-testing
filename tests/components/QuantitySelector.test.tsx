import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuantitySelector from "../../src/components/QuantitySelector";
import { Product } from "../../src/entities";
import { CartProvider } from "../../src/providers/CartProvider";

describe("QuantitySelector", () => {
  const renderComponent = () => {
    const product: Product = {
      id: 1,
      name: "product one",
      price: 10,
      categoryId: 11,
    };
    render(
      <CartProvider>
        <QuantitySelector product={product} />
      </CartProvider>
    );

    return {
      getAddToCart: () =>
        screen.queryByRole("button", { name: /add to cart/i }),
      getQualityControls: () => ({
        quantity: screen.queryByRole("status"),
        decrementBtn: screen.queryByRole("button", { name: "-" }),
        incrementBtn: screen.queryByRole("button", { name: "+" }),
      }),

      user: userEvent.setup(),
    };
  };
  it("should render add to cart button in the beginning", () => {
    const { getAddToCart } = renderComponent();

    expect(getAddToCart()).toBeInTheDocument();
  });
  it("should render quantity selector after adding one item in the cart", async () => {
    const { getAddToCart, user, getQualityControls } = renderComponent();

    await user.click(getAddToCart()!);
    const { quantity, incrementBtn, decrementBtn } = getQualityControls();

    expect(getAddToCart()).not.toBeInTheDocument();

    expect(incrementBtn).toBeInTheDocument();

    expect(quantity).toBeInTheDocument();
    expect(quantity).toHaveTextContent("1");

    expect(decrementBtn).toBeInTheDocument();
  });

  it("should increment the quantity", async () => {
    const { getAddToCart, user, getQualityControls } = renderComponent();
    await user.click(getAddToCart()!);
    const { quantity, incrementBtn } = getQualityControls();

    await user.click(incrementBtn!);
    expect(quantity).toHaveTextContent("2");
  });

  it("should decrement the quantity", async () => {
    const { getAddToCart, user, getQualityControls } = renderComponent();
    await user.click(getAddToCart()!);
    const { quantity, decrementBtn } = getQualityControls();
    await user.click(decrementBtn!);
    expect(quantity).toHaveTextContent("1");
    await user.click(decrementBtn!);
    expect(quantity).not.toBeInTheDocument();
    expect(getAddToCart()).toBeInTheDocument();
  });
});
