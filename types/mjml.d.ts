declare module 'mjml' {
  export interface MjmlOptions {
    beautify?: boolean;
    minify?: boolean;
    validationLevel?: 'strict' | 'soft' | 'skip';
    filePath?: string;
  }

  export interface MjmlError {
    line: number;
    message: string;
    tagName: string;
    formattedMessage: string;
  }

  export interface MjmlParsingResult {
    html: string;
    errors: MjmlError[];
    json?: object;
  }

  function mjml2html(mjmlString: string, options?: MjmlOptions): MjmlParsingResult;
  export default mjml2html;
}
