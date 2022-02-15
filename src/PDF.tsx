import { invoke } from '@tauri-apps/api/tauri';
import { useState } from 'react';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { useWorkspace } from './App';
import { CompileResponse } from './types/api';
import { Loading, Toolbar, Button, TextContainer } from './shared';
import styled from 'styled-components';

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
  const [loading, setLoading] = useState(false);

  const recompile = () => {
    setLoading(true);
    invoke('save_file', {fname: workspace?.file, contents: workspace?.fileContents}).then(() => {
      invoke<CompileResponse>('compile_tex', {fname: workspace?.file, outdir: workspace?.dir}).then((resp: CompileResponse) => {
        setPdfData(resp.body);
        setLoading(false);
      });
    });
  };

  function onDocumentLoadSuccess({ numPages: nextNumPages }: pdfDoc) {
    setNumPages(nextNumPages);
  }

  return (
    <>
      <Toolbar>
          <Button onClick={recompile}>Recompile</Button>
          <TextContainer>
            <span>Zoom</span>
          </TextContainer>
          <Button onClick={() => setScale(scale + 0.5)}>+</Button>
          <Button onClick={() => setScale(scale - 0.5)}>-</Button>
      </Toolbar>
      <PDFPane>
        <PDFDocument 
          file={pdfData && !loading ? {data: pdfData} : undefined}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<Loading />}
          noData={<Loading />}
        >
          {
            Array.from(
              new Array(numPages),
              (el, index) => (
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