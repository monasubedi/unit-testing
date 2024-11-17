/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../src/entities";
import BrowseProducts from "../../src/pages/BrowseProductsPage";
import { db } from "../mocks/db";

import AllProviders from "../AllProviders";
import { simulateDelay, simulateError } from "../utils";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];
  beforeAll(() => {
    [1, 2, 3].forEach((item) => {
      const category = db.category.create({ name: "Category" + item });
      categories.push(category);
      [1, 2].forEach(() => {
        const product = db.product.create({ categoryId: category.id });
        products.push(product);
      });
    });
  });
  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    const productIds = products.map((p) => p.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });
  const renderComponent = () => {
    render(<BrowseProducts />, { wrapper: AllProviders });

    return {
      getProductsSkeleton: () =>
        screen.queryByRole("progressbar", { name: /products/ }),
      getCategoriesSkeleton: () =>
        screen.getByRole("progressbar", { name: /categories/i }),
      user: userEvent.setup,
    };
  };
  it("should return skeleton loading while fetching the categories data", () => {
    simulateDelay("/categories");
    const { getCategoriesSkeleton } = renderComponent();
    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  it("should remove skeleton loading when categories are fetched", async () => {
    const { getCategoriesSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  it("should return skeleton loading while fetching the products data", async () => {
    simulateDelay("/products");
    const { getProductsSkeleton } = renderComponent();
    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it("should remove skeleton loading when categories are fetched", async () => {
    const { getProductsSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it("should not return error if fetching categories fails", async () => {
    simulateError("/categories");
    const { getCategoriesSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getCategoriesSkeleton);
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: /category/i })
    ).not.toBeInTheDocument();
  });

  it("should return error if fetching products fails", async () => {
    simulateError("/products");
    renderComponent();
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should return correct categories", async () => {
    renderComponent();
    const button = await screen.findByRole("combobox");
    expect(button).toHaveTextContent(/category/i);
    const user = userEvent.setup();
    await user.click(button);
    const options = await screen.findAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render the products", async () => {
    const { getProductsSkeleton } = renderComponent();
    await waitForElementToBeRemoved(getProductsSkeleton);
    products.forEach((p) => {
      expect(screen.getByText(p.name)).toBeInTheDocument();
    });
  });

  it("should render products according to the selected category", async () => {
    renderComponent();
    const selectedCategory = categories[0];
    const button = await screen.findByRole("combobox");
    const user = userEvent.setup();
    await user.click(button);
    const option = await screen.findByRole("option", {
      name: selectedCategory.name,
    });
    await user.click(option);
    const rows = screen.getAllByRole("row");
    const products = db.product.findMany({
      where: { categoryId: { equals: selectedCategory.id } },
    });

    expect(products).toHaveLength(rows.length - 1);
  });
  it("should render all products when all is selected", async () => {
    renderComponent();
    const button = await screen.findByRole("combobox");
    const user = userEvent.setup();
    await user.click(button);
    const option = await screen.findByRole("option", {
      name: /all/i,
    });
    await user.click(option);
    const rows = screen.getAllByRole("row");
    const products = db.product.getAll();

    expect(products).toHaveLength(rows.length - 1);
  });
});
