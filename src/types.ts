export interface Patch {
  version: string;
  path: string;
}

export interface ReplaceRule {
  description: string;
  pattern: string | RegExp;
  value: string;
}
export interface Rule {
  file: string;
  replace: ReplaceRule[];
}
