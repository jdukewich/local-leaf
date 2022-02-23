import { render, screen } from "@testing-library/react";
import Navbar from "../Navbar";

describe("Navbar", () => {
  it("should contain the title of the app", () => {
    render(<Navbar />);
    expect(screen.getByText("Local Leaf")).toBeTruthy();
  });
});
