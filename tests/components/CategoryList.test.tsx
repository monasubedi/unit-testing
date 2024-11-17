import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import CategoryList from "../../src/components/CategoryList";
import { Category } from "../../src/entities";
import ReduxProvider from "../../src/providers/ReduxProvider";
import { db } from "../mocks/db";
import { simulateDelay, simulateError } from "../utils";

describe("CategoryList", () => {
  const categories: Category[] = [];
  beforeAll(() => {
    [1, 2].forEach(() => {
      const category = db.category.create();
      categories.push(category);
    });
  });
  afterAll(() => {
    const categoryIds: number[] = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });
  });
  const renderComponent = () => {
    render(
      <ReduxProvider>
        <CategoryList />
      </ReduxProvider>
    );
  };

  it("should render a loading while fetching the categories", () => {
    simulateDelay("/categories");
    renderComponent();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  it("should throw an error when fetching the categories fails", async () => {
    simulateError("/categories");
    renderComponent();
    const loading = screen.getByText(/loading/i);
    await waitForElementToBeRemoved(loading);
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
  it("should render the category list when fetching the data is done", async () => {
    renderComponent();
    const loading = screen.getByText(/loading/i);
    await waitForElementToBeRemoved(loading);
    categories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });
});
