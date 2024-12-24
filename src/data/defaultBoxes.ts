export interface Box {
  value: string;
  label: string;
}

export const DEFAULT_BOXES: Box[] = [
  { value: "general", label: "General QA" },
  { value: "technical", label: "Technical QA" },
  { value: "product", label: "Product QA" },
  // Add all your default boxes here
] 