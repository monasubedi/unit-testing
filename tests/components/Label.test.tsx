import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import { Language } from "../../src/providers/language/type";

describe("Label", () => {
  const renderComponent = (label: string, language: Language) => {
    render(
      <LanguageProvider language={language}>
        <Label labelId={label} />
      </LanguageProvider>
    );
  };
  describe("should render the text when language is en", () => {
    it.each([
      { label: "welcome", text: "Welcome" },
      { label: "new_product", text: "New Product" },
      { label: "edit_product", text: "Edit Product" },
    ])(
      "should render the correct $text when the language is $language",
      ({ label, text }) => {
        renderComponent(label, "en");

        expect(screen.getByText(text)).toBeInTheDocument();
      }
    );
  });
  describe("should render the text when language is es", () => {
    it.each([
      { label: "welcome", text: "Bienvenidos" },
      { label: "new_product", text: "Nuevo Producto" },
      { label: "edit_product", text: "Editar Producto" },
    ])(
      "should render the correct $text when the language is $language",
      ({ label, text }) => {
        renderComponent(label, "es");

        expect(screen.getByText(text)).toBeInTheDocument();
      }
    );
  });
  it("should throw an error when invalid language id is given", () => {
    expect(() => renderComponent("!", "en")).toThrowError();
  });
});
