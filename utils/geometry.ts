import { Node, Triangle, ColorType, CheckResult } from '../types';

const SPACING = 60;
const OFFSET_Y = 50;

export const generateGrid = (rows: number = 6): { nodes: Record<string, Node>; triangles: Triangle[] } => {
  const nodes: Record<string, Node> = {};
  const triangles: Triangle[] = [];

  // Generate Nodes
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c <= r; c++) {
      const id = `${r}-${c}`;
      // Centering logic
      const xOffset = (rows - 1 - r) * (SPACING / 2); 
      const x = xOffset + c * SPACING + (window.innerWidth < 600 ? 20 : 100); // rudimentary responsive offset
      const y = OFFSET_Y + r * (SPACING * Math.sin(Math.PI / 3));

      nodes[id] = {
        id,
        row: r,
        col: c,
        color: null,
        x,
        y,
      };
    }
  }

  // Generate Triangles (Connections)
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c <= r; c++) {
       // "Up" triangle: (r,c), (r+1,c), (r+1,c+1)
       triangles.push({
         id: `up-${r}-${c}`,
         nodes: [`${r}-${c}`, `${r+1}-${c}`, `${r+1}-${c+1}`]
       });
       
       // "Down" triangle: formed by (r,c), (r,c+1), (r+1,c+1). 
       // This exists if c+1 exists in row r.
       if (c + 1 <= r) {
          triangles.push({
            id: `down-${r}-${c}`,
            nodes: [`${r}-${c}`, `${r}-${c+1}`, `${r+1}-${c+1}`]
          });
       }
    }
  }

  return { nodes, triangles };
};

export const checkBoard = (nodes: Record<string, Node>, triangles: Triangle[]): CheckResult => {
  const invalidNodeSets: string[][] = [];
  
  // Group nodes by color to optimize checking
  const colors: Record<string, Node[]> = { red: [], green: [], blue: [] };
  
  Object.values(nodes).forEach(n => {
    if (n.color) {
      colors[n.color].push(n);
    }
  });

  // Helper for squared Euclidean distance
  const distSq = (n1: Node, n2: Node) => (n1.x - n2.x)**2 + (n1.y - n2.y)**2;
  
  // Helper to check if 3 nodes form an equilateral triangle
  const isEquilateral = (n1: Node, n2: Node, n3: Node) => {
    const d1 = distSq(n1, n2);
    const d2 = distSq(n2, n3);
    const d3 = distSq(n3, n1);
    
    // Epsilon to handle floating point inaccuracies (though minimal in this grid)
    const eps = 1.0; 
    
    // Check if distances are approximately equal
    return Math.abs(d1 - d2) < eps && Math.abs(d2 - d3) < eps;
  };

  ['red', 'green', 'blue'].forEach(color => {
    const group = colors[color];
    // Check all unique triplets in the color group
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        for (let k = j + 1; k < group.length; k++) {
           if (isEquilateral(group[i], group[j], group[k])) {
             invalidNodeSets.push([group[i].id, group[j].id, group[k].id]);
           }
        }
      }
    }
  });

  return {
    valid: invalidNodeSets.length === 0,
    invalidTriangles: invalidNodeSets
  };
};

export const getNeighborLines = (triangles: Triangle[]): {p1: string, p2: string}[] => {
    // Helper to extract unique edges for rendering the grid lines
    const lines = new Set<string>();
    const result: {p1: string, p2: string}[] = [];

    triangles.forEach(t => {
        const [n1, n2, n3] = t.nodes;
        const edges = [[n1, n2], [n2, n3], [n3, n1]];
        edges.forEach(([a, b]) => {
            const key = [a, b].sort().join('|');
            if (!lines.has(key)) {
                lines.add(key);
                result.push({p1: a, p2: b});
            }
        });
    });
    return result;
}