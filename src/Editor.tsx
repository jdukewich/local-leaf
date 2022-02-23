import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useWorkspace, Workspace } from "./App";
import AceEditor from "react-ace";
import { Button, Pane, TextContainer, ToolbarSpaced, FlexDiv } from "./shared";

import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/theme-dracula";

interface EditorProps {
  width: number;
}

function Editor({ width }: EditorProps) {
  const { workspace, setWorkspace } = useWorkspace();
  const [fontSize, setFontSize] = useState(12);

  const saveFile = () => {
    if (workspace.fileContents !== "" && workspace.file !== "") {
      invoke("save_file", {
        fname: workspace.file,
        contents: workspace.fileContents,
      });
    }
  };

  const updateFile = (value: string, event: any) => {
    setWorkspace((state: Workspace) => ({
      ...state,
      fileContents: value,
    }));
  };

  return (
    <Pane>
      <ToolbarSpaced>
        <Button onClick={saveFile}>Save</Button>
        <TextContainer>
          <span>Current File: {workspace?.file.replace(/^.*[\\/]/, "")}</span>
        </TextContainer>
        <FlexDiv>
          <TextContainer>Font Size: {fontSize}</TextContainer>
          <Button onClick={() => setFontSize(fontSize + 0.5)}>+</Button>
          <Button onClick={() => setFontSize(fontSize - 0.5)}>-</Button>
        </FlexDiv>
      </ToolbarSpaced>
      <AceEditor
        mode="latex"
        theme="dracula"
        onChange={updateFile}
        name="text-editor"
        fontSize={fontSize}
        value={workspace?.fileContents}
        height="100%"
        width={width + "px"}
        showPrintMargin={false}
        wrapEnabled={true}
        setOptions={{ fixedWidthGutter: true }}
      />
    </Pane>
  );
}

export default Editor;
