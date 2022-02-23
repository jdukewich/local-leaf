export interface Response {
  status: string;
  message?: string;
}

export interface OpenFileResponse extends Response {
  body: string;
}

export interface OpenFolderResponse extends Response {
  body: [string, string[]];
}

export interface SaveFileResponse extends Response {
  body: string;
}

export interface CompileResponse extends Response {
  body: Uint8Array;
}
