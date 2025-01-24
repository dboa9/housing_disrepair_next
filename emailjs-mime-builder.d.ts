// File Location: housing_disrepair_next/emailjs-mime-builder.d.ts
// Description: Type declaration for the emailjs-mime-builder module.

declare module 'emailjs-mime-builder' {
  export class MIMEMultipart {
    constructor();
    attach(part: any): void;
    asBytes(): Uint8Array;
    addHeader(name: string, value: string): void; // Add this line
  }
  export class MIMEText {
    constructor(content: string, type: string);
  }
}