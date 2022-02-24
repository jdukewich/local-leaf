import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/dom";
import PDF from "../PDF";
import { ReactChildren } from "react";

jest.mock("@tauri-apps/api/tauri", () => {
  return {
    invoke: (cmd: string, args: any) => {
      switch (cmd) {
        case "save_file":
          return Promise.resolve();
        case "compile_tex":
          return Promise.resolve({ body: "fakePDF" });
        default:
          break;
      }
    },
  };
});

jest.mock("react-pdf/dist/esm/entry.webpack", () => {
  return {
    Document: ({
      file,
      onLoadSuccess,
      children,
    }: {
      file: any;
      onLoadSuccess: Function;
      children: ReactChildren;
    }) => (
      <div data-testid="document">
        <button
          data-testid="setNumPagesButton"
          onClick={() => onLoadSuccess({ numPages: 2 })}
        ></button>
        {file?.data}
        {children}
      </div>
    ),
    Page: ({ scale, pageNumber }: { scale: number; pageNumber: number }) => (
      <div data-testid={`page${pageNumber}`}>Scale{scale}</div>
    ),
  };
});

describe("PDF", () => {
  it("should recompile when button is clicked", async () => {
    render(<PDF />);
    userEvent.click(screen.getByText("Recompile"));
    expect(await screen.findByText("fakePDF")).toBeTruthy();
  });

  it("should zoom when button is clicked", async () => {
    render(<PDF />);
    expect(screen.getByText("Zoom")).toBeTruthy();
    // This is hacky to get pages to render since I don't have valid PDF data
    userEvent.click(screen.getByTestId("setNumPagesButton"));
    userEvent.click(screen.getByText("+"));
    expect(
      within(screen.getByTestId("page1")).getByText("Scale1.5")
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("page2")).getByText("Scale1.5")
    ).toBeInTheDocument();

    userEvent.click(screen.getByText("-"));
    expect(
      within(screen.getByTestId("page1")).getByText("Scale1")
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("page2")).getByText("Scale1")
    ).toBeInTheDocument();
  });
});
