import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Editor from "../Editor";
import * as AppModule from "../App";

jest.mock("@tauri-apps/api/tauri", () => {
  return {
    invoke: (cmd: string, args: any) => {
      switch (cmd) {
        case "save_file":
          return Promise.resolve();
        default:
          break;
      }
    },
  };
});

jest.mock("react-ace", () => {
  return {
    __esModule: true,
    ...jest.requireActual("react-ace"),
    default: ({ onChange }: { onChange: (value: string) => any }) => (
      <div data-testid="testEditor" onChange={onChange("testValue")}>
        Editor
      </div>
    ),
  };
});

describe("Editor", () => {
  const TauriModule = require("@tauri-apps/api/tauri");
  const invokeSpy = jest.spyOn(TauriModule, "invoke");
  const useWorkspaceSpy = jest.spyOn(AppModule, "useWorkspace");
  const workspace = { dir: "", file: "", fileContents: "" };
  const setWorkspaceTracker = jest.fn((newWorkspace) => newWorkspace);

  beforeEach(() => {
    jest.clearAllMocks();
    useWorkspaceSpy.mockReturnValue({
      workspace,
      setWorkspace: (callback: Function) => {
        setWorkspaceTracker(callback(workspace));
      },
    });
  });

  it("should not invoke save_file with no file", async () => {
    useWorkspaceSpy.mockReturnValueOnce({
      workspace: { ...workspace, fileContents: "testContents" },
      setWorkspace: (callback: Function) => {
        setWorkspaceTracker(callback(workspace));
      },
    });
    render(<Editor width={1} />);
    userEvent.click(screen.getByText("Save"));
    expect(invokeSpy).not.toHaveBeenCalled();
  });

  it("should save the file", async () => {
    useWorkspaceSpy.mockReturnValueOnce({
      workspace: {
        ...workspace,
        file: "testFile",
        fileContents: "testContents",
      },
      setWorkspace: (callback: Function) => {
        setWorkspaceTracker(callback(workspace));
      },
    });
    render(<Editor width={1} />);
    userEvent.click(screen.getByText("Save"));
    expect(invokeSpy).toHaveBeenCalledWith("save_file", {
      fname: "testFile",
      contents: "testContents",
    });
  });

  it("should update the file state", async () => {
    render(<Editor width={1} />);
    fireEvent.change(screen.getByTestId("testEditor"));
    expect(setWorkspaceTracker).toHaveBeenCalledWith({
      dir: "",
      file: "",
      fileContents: "testValue",
    });
  });

  it("should change font size whens buttons are clicked", async () => {
    render(<Editor width={1} />);
    userEvent.click(screen.getByText("+"));
    expect(await screen.findByText("Font Size: 14.5")).toBeTruthy();
    userEvent.click(screen.getByText("-"));
    expect(await screen.findByText("Font Size: 14")).toBeTruthy();
  });
});
