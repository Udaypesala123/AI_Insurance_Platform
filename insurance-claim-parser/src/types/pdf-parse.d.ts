// types/pdf-parse.d.ts
declare module 'pdf-parse' {
  function pdfParse(
    dataBuffer: Buffer,
    options?: any
  ): Promise<{
    text: string;
    info: any;
    metadata: any;
    version: string;
    numpages: number;
  }>;

  export = pdfParse;
}
  