import { db } from "./db";

export const handlers = [
  ...db.product.toHandlers("rest"),
  ...db.category.toHandlers("rest"),
];

// export const handlers = [
//   http.get("/categories", () => {
//     return HttpResponse.json(products);
//   }),
//   http.get("/products", () => {
//     return HttpResponse.json(products);
//   }),
//   http.get("/products/:id", ({ params }) => {
//     const productId = params.id as string;
//     const product = products.find((p) => p.id === parseInt(productId));

//     if (!product) {
//       return new HttpResponse(null, { status: 404 });
//     }
//     return HttpResponse.json(product);
//   }),
// ];
