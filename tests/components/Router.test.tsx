import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../../src/routes";
import { db } from "../mocks/db";

describe("Router", () => {
  const renderComponent = (path: string) => {
    const router = createMemoryRouter(routes, {
      initialEntries: [path],
    });
    render(<RouterProvider router={router} />);
  };
  it("should return home page for /", () => {
    renderComponent("/");
    expect(screen.getByRole("heading", { name: /home/i })).toBeInTheDocument();
  });
  it("should return products page for /products", () => {
    renderComponent("/products");
    expect(
      screen.getByRole("heading", { name: /products/i })
    ).toBeInTheDocument();
  });
  it("should return products detail page for /products/1", async () => {
    const product = db.product.create();
    renderComponent("/products/" + product.id);

    expect(
      await screen.findByRole("heading", { name: product.name })
    ).toBeInTheDocument();
  });
  it("should return not found message page for invalid route", () => {
    renderComponent("/invalid");

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
  it("should return admin page for /admin", () => {
    renderComponent("/admin");

    expect(screen.getByRole("heading", { name: /admin/i })).toBeInTheDocument();
  });
});
