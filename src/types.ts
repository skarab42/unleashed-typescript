export type Patch = { version: string; path: string };

export type ReplaceRule = {
  description: string;
  pattern: string | RegExp;
  value: string;
};
export type Rule = { file: string; replace: ReplaceRule[] };
