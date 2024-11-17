import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
  it("should return null if image urls is empty", () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
  it("should return a list of images", () => {
    const imageUrls: string[] = ["image1", "image2", "image2"];
    render(<ProductImageGallery imageUrls={imageUrls} />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(3);
    imageUrls.forEach((im, i) => {
      expect(images[i]).toHaveAttribute("src", im);
    });
  });
});
