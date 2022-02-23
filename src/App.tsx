import {
  useState,
  createContext,
  useEffect,
  useContext,
  SyntheticEvent,
} from "react";
import styled from "styled-components";
import FileTree from "./FileTree";
import Editor from "./Editor";
import PDF from "./PDF";
import Navbar from "./Navbar";
import { ResizableBox as Box, ResizeCallbackData } from "react-resizable";
import { Container, Row } from "./shared";

export interface Workspace {
  dir: string;
  file: string;
  fileContents: string;
}

const initialWorkspace: Workspace = { dir: "", file: "", fileContents: "" };
export const WorkspaceContext = createContext<{
  workspace: Workspace;
  setWorkspace: any;
}>({ workspace: initialWorkspace, setWorkspace: () => {} });
export const useWorkspace = () => useContext(WorkspaceContext);

const ContentRow = styled(Row)`
  max-height: 95%;
`;

const ResizableBox = styled(Box)`
  display: flex;
  flex-direction: column;
  max-height: 100%;
`;

const PDFPane = styled.div`
  max-height: 100%;
  background-color: #e4e8ee;
  display: flex;
  flex-direction: column;
`;

const resizerStyles = {
  backgroundColor: "#2c3645",
  width: "10px",
  height: "100%",
  cursor: "ew-resize",
  position: "absolute" as "absolute",
};

function App() {
  const [width, setWidth] = useState({
    fileTree: Math.floor(window.innerWidth / 6),
    editor: Math.floor((5 * window.innerWidth) / 12),
    viewer:
      window.innerWidth -
      Math.floor((5 * window.innerWidth) / 12) -
      Math.floor(window.innerWidth / 6),
  });

  const [workspace, setWorkspace] = useState(initialWorkspace);

  function handleResize() {
    setWidth({
      fileTree: Math.floor(window.innerWidth / 6),
      editor: Math.floor((5 * window.innerWidth) / 12),
      viewer:
        window.innerWidth -
        Math.floor((5 * window.innerWidth) / 12) -
        Math.floor(window.innerWidth / 6),
    });
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);

  const resizeLeft = (
    event: SyntheticEvent<Element, Event>,
    { node, size, handle }: ResizeCallbackData
  ) => {
    const dX = width.fileTree - size.width;
    setWidth({
      ...width,
      fileTree: size.width,
      editor: width.editor + dX,
    });
  };

  const resizeRight = (
    event: SyntheticEvent<Element, Event>,
    { node, size, handle }: ResizeCallbackData
  ) => {
    const dX = width.editor - size.width;
    setWidth({
      ...width,
      editor: size.width,
      viewer: width.viewer + dX,
    });
  };

  return (
    <WorkspaceContext.Provider value={{ workspace, setWorkspace }}>
      <Container>
        <Navbar />
        <ContentRow>
          <ResizableBox
            axis={"x"}
            width={width.fileTree}
            height={Infinity}
            onResize={resizeLeft}
            maxConstraints={[width.fileTree + width.editor - 15, Infinity]}
            handle={
              <div
                style={{ left: width.fileTree - 10 + "px", ...resizerStyles }}
              />
            }
          >
            <FileTree />
          </ResizableBox>
          <ResizableBox
            axis={"x"}
            width={width.editor}
            height={Infinity}
            onResize={resizeRight}
            maxConstraints={[window.innerWidth - width.fileTree - 15, Infinity]}
            handle={
              <div
                style={{
                  left: width.fileTree + width.editor - 10 + "px",
                  ...resizerStyles,
                }}
              />
            }
          >
            <Editor width={width.editor - 10} />
          </ResizableBox>
          <PDFPane style={{ width: width.viewer }}>
            <PDF />
          </PDFPane>
        </ContentRow>
      </Container>
    </WorkspaceContext.Provider>
  );
}

export default App;
