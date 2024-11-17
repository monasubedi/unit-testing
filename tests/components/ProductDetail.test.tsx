/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { server } from "../mocks/server";
import { delay, http, HttpResponse } from "msw";
import { db } from "../mocks/db";
import { Product } from "../../src/entities";
import AllProviders from "../AllProviders";

describe("ProductDetail", () => {
  let product: Product = {
    id: 0,
    name: "",
    price: 0,
  };
  beforeAll(() => {
    const newPro = db.product.create();
    product = { ...newPro };
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it("should return product detail when the product is found.", async () => {
    render(<ProductDetail productId={product.id} />, { wrapper: AllProviders });

    const name = await screen.findByText(new RegExp(product.name));
    expect(name).toBeInTheDocument();

    const price = await screen.findByText(new RegExp(product.price.toString()));
    expect(price).toBeInTheDocument();
  });
  it("should return product detail when the product is found.", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    server.use(http.get("/products/1", () => HttpResponse.json(null)));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    const text = await screen.findByText(/not found/i);
    expect(text).toBeInTheDocument();
  });
  it("should return invalid when the product is 0.", async () => {
    render(<ProductDetail productId={0} />, { wrapper: AllProviders });

    const text = await screen.findByText(/invalid/i);
    expect(text).toBeInTheDocument();
  });
  it("should return an error when it throws an error.", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    server.use(http.get("/products/1", () => HttpResponse.error()));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    const text = await screen.findByText(/error/i);
    expect(text).toBeInTheDocument();
  });

  it("should return a loading indicator when data is fetching", async () => {
    server.use(
      http.get("/products/1", async () => {
        await delay();
        return HttpResponse.json({});
      })
    );
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });
  it("should remove a loading indicator when data is fetched", async () => {
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
  it("should remove an error when data fetching fails.", async () => {
    server.use(http.get("/products/1", () => HttpResponse.error()));
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
