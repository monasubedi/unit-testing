import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Product } from "../../src/entities";
import routes from "../../src/routes";
import { db } from "../mocks/db";

describe("ProductDetailPage", () => {
  let product: Product;
  beforeAll(() => {
    product = db.product.create();
  });
  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it("should render product detail page for products/:id", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/products/" + product.id],
    });
    render(<RouterProvider router={router} />);
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    expect(
      screen.getByRole("heading", { name: product.name })
    ).toBeInTheDocument();
    expect(screen.getByText("$" + product.price)).toBeInTheDocument();
  });
});
