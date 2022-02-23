import { useState, useMemo } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { Loading, Button, TextContainer, FlexDiv, ToolbarSpaced } from './shared';
import styled from 'styled-components';
import { invoke } from '@tauri-apps/api/tauri';
import { CompileResponse } from './types/api';
import { useWorkspace } from './App';

interface pdfDoc {
  numPages: number;
}

const PDFPane = styled.div`
  overflow-y: scroll;
  display: flex;
  flex: 1;
`;

const PDFDocument = styled(Document)`
  margin: auto;
`;

function PDF() {
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1);
  const { workspace } = useWorkspace();
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const memoData = useMemo(() => ({data: pdfData}), [pdfData]);

  const recompile = () => {
    invoke('save_file', {fname: workspace?.file, contents: workspace?.fileContents}).then(() => {
      invoke<CompileResponse>('compile_tex', {fname: workspace?.file, outdir: workspace?.dir}).then((resp: CompileResponse) => {
        setPdfData(resp.body);
      });
    });
  };

  function onDocumentLoadSuccess({ numPages: nextNumPages }: pdfDoc) {
    setNumPages(nextNumPages);
  }

  return (
    <>
      <ToolbarSpaced>
          <Button onClick={recompile}>Recompile</Button>
          <FlexDiv>
            <TextContainer>
              <span>Zoom</span>
            </TextContainer>
            <Button onClick={() => setScale(scale + 0.5)}>+</Button>
            <Button onClick={() => setScale(scale - 0.5)}>-</Button>
          </FlexDiv>
      </ToolbarSpaced>
      <PDFPane>
        <PDFDocument 
          file={memoData}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<Loading />}
          noData={<span>No Data</span>}
        >
          {
            Array.from(
              new Array(numPages),
              (_, index) => (
                <Page 
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  scale={scale}
                />
              ),
            )
          }
        </PDFDocument>
      </PDFPane>
    </>
  );
}
  
export default PDF;