/// <reference types="chrome" />

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.mjs' {
  const content: any;
  export default content;
}

