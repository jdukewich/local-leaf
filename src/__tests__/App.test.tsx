import { render, screen, fireEvent } from "@testing-library/react";
import { ReactChildren } from "react";
import App from "../App";

jest.mock("../PDF", () => ({
  __esModule: true,
  default: () => <div data-testid="testPDF" />,
}));
jest.mock("../FileTree", () => ({
  __esModule: true,
  default: () => <div data-testid="testFileTree" />,
}));
jest.mock("../Editor", () => ({
  __esModule: true,
  default: () => <div data-testid="testEditor" />,
}));
jest.mock("react-resizable", () => {
  return {
    __esModule: true,
    ...jest.requireActual("react-ace"),
    ResizableBox: ({
      onResize,
      children,
    }: {
      onResize: (e: any, data: any) => any;
      children: ReactChildren;
    }) => (
      <div
        data-testid="testBox"
        onClick={() => onResize(null, { size: { height: 1, width: 1 } })}
      >
        {children}
      </div>
    ),
  };
});

describe("App", () => {
  it("renders the three panes", async () => {
    render(<App />);
    expect(screen.getByTestId("testPDF")).toBeInTheDocument();
    expect(screen.getByTestId("testFileTree")).toBeInTheDocument();
    expect(screen.getByTestId("testEditor")).toBeInTheDocument();
  });

  it("resizes the panes", async () => {
    render(<App />);
    screen.getAllByTestId("testBox").forEach((node) => {
      fireEvent.click(node);
    });
    // Maybe add better checks that the resize worked
  });
});
