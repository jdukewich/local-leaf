import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FileTree from "../FileTree";
import * as AppModule from "../App";

jest.mock("@tauri-apps/api/tauri", () => {
  return {
    invoke: (cmd: string, args: any) => {
      switch (cmd) {
        case "open_folder":
          return Promise.resolve({
            body: ["testDir", ["testFile1", "testFile2"]],
          });
        case "open_file":
          return Promise.resolve({ body: "fileContents" });
        default:
          break;
      }
    },
  };
});

describe("FileTree", () => {
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

  it("should contain directory and files", () => {
    render(<FileTree />);
    expect(screen.getByText("Directory:")).toBeTruthy();
    expect(screen.getByText("Files:")).toBeTruthy();
  });

  it("should open a folder", async () => {
    render(<FileTree />);
    userEvent.click(screen.getByText("Open Folder"));

    expect(await screen.findByText("testFile1")).toBeTruthy();
    expect(await screen.findByText("testFile2")).toBeTruthy();
    expect(setWorkspaceTracker).toHaveBeenCalledWith({
      dir: "testDir",
      file: "",
      fileContents: "",
    });
  });

  it("should open a file", async () => {
    useWorkspaceSpy.mockReturnValue({
      workspace: { ...workspace, dir: "testDir", file: "testFile1" },
      setWorkspace: (callback: Function) => {
        setWorkspaceTracker(callback({ ...workspace, dir: "testDir" }));
      },
    });
    render(<FileTree />);
    expect(screen.getByText("Directory: testDir")).toBeTruthy();

    // Click open folder again to render the file list
    userEvent.click(screen.getByText("Open Folder"));
    expect(await screen.findByText("testFile1")).toBeTruthy();

    // Now click on a file to open it
    userEvent.click(screen.getByText("testFile1"));
    expect(await screen.findByText("testFile1")).toHaveStyle(
      `background-color: #138a07`
    );
    expect(setWorkspaceTracker).toHaveBeenCalledWith({
      dir: "testDir",
      file: "testFile1",
      fileContents: "fileContents",
    });
  });
});
