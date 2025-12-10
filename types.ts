export type ColorType = 'red' | 'green' | 'blue' | null;

export interface Node {
  id: string;
  row: number;
  col: number;
  color: ColorType;
  x: number;
  y: number;
}

export interface Triangle {
  nodes: [string, string, string]; // IDs of the 3 vertices
  id: string;
}

export interface GameState {
  nodes: Record<string, Node>;
  triangles: Triangle[];
  isComplete: boolean;
  hasErrors: boolean;
}

export interface CheckResult {
  valid: boolean;
  invalidTriangles: string[][]; // Array of arrays of 3 Node IDs (identifying the invalid equilateral triangle)
}