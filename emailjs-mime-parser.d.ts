// File Location: housing_disrepair_next/emailjs-mime-parser.d.ts
// Description: Type declaration for the emailjs-mime-parser module.

declare module 'emailjs-mime-parser' {
  export function parseMIMETree(input: string | Buffer): any;
  export class MIMEBase {
    constructor(type: string, subtype: string);
    setPayload(payload: Buffer | string): void;
    addHeader(name: string, value: string): void;
  }
  export const encoders: {
    encodeBase64: (mime: MIMEBase) => void;
  };
}
