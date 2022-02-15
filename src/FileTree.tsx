import { invoke } from '@tauri-apps/api/tauri';
import { useState, MouseEvent } from 'react';
import styled from 'styled-components';
import { useWorkspace, Workspace } from './App';
import { OpenFileResponse, OpenFolderResponse } from './types/api';
import { Toolbar, Button, Pane } from './shared';

interface ListItemProps {
  selected: boolean
};

const TreeContainer = styled.div`
  background-color: #455265;
  color: #ffffff;
  list-style: none;
  flex: 1;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li<ListItemProps>`
  padding: 5px 0;
  overflow-x: hidden;
  text-overflow: ellipsis;
  text-align: center;
  background-color: ${({ selected }) => selected ? '#138a07' : ''};

  &:hover {
    background-color: ${({ selected }) => selected ? '#138a07' : '#2c3645'};
    cursor: pointer;
  }
`;

function FileTree() {
  const [files, setFiles] = useState<string[]>([]);
  const { workspace, setWorkspace } = useWorkspace();

  const formatFilename = (fullFile: string) => {
    // We only want to display the filename, not the full directory path
    return fullFile.replace(/^.*[\\\/]/, '');
  };

  const openFolder = () => {
    invoke<OpenFolderResponse>('open_folder').then((resp: OpenFolderResponse) => {
      setFiles(resp.body[1]);
      setWorkspace((state: Workspace) => ({
        ...state,
        dir: resp.body[0]
      }));
    });
  };

  const openFile = (fname: string) => (event: MouseEvent<HTMLLIElement>) => {
    event.preventDefault();
    invoke<OpenFileResponse>('open_file', {fname}).then((resp: OpenFileResponse) => {
      setWorkspace((state: Workspace) => ({
        ...state,
        file: fname,
        fileContents: resp.body
      }));
    });
  };
  
  return (
    <Pane>
      <Toolbar>
        <Button onClick={openFolder}>Open Folder</Button>
      </Toolbar>
      <TreeContainer>
        <p>Directory: {workspace?.dir}</p>
        <p>Files:</p>
        <List>
          {files.map(file => {
            return <ListItem key={file} onClick={openFile(file)} selected={file === workspace.file}>{formatFilename(file)}</ListItem>;
          })}
        </List>
      </TreeContainer>
    </Pane>
  );
}

export default FileTree;