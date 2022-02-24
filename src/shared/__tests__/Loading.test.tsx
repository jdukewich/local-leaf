import { render } from "@testing-library/react";
import Loading from "../Loading";

describe("Loading", () => {
  it("should render the spinner", () => {
    const { container } = render(<Loading />);
    expect(container).toBeVisible();
  });
});
