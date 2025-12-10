import React, { useMemo } from 'react';
import { Node, Triangle, ColorType } from '../types';
import { getNeighborLines } from '../utils/geometry';

interface TriangleBoardProps {
  nodes: Record<string, Node>;
  triangles: Triangle[];
  invalidTriangles: string[][]; // Updated to array of node triplets
  onNodeClick: (id: string) => void;
  selectedColor: ColorType;
}

const COLOR_MAP: Record<string, string> = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  empty: '#334155', // slate-700
};

const GLOW_MAP: Record<string, string> = {
  red: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))',
  green: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))',
  blue: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))',
  empty: 'none',
};

export const TriangleBoard: React.FC<TriangleBoardProps> = ({ 
  nodes, 
  triangles, 
  invalidTriangles,
  onNodeClick,
  selectedColor 
}) => {
  
  // Memoize lines so we don't recalculate on every render
  const lines = useMemo(() => getNeighborLines(triangles), [triangles]);

  const nodeList = Object.values(nodes) as Node[];

  // Determine bounds for SVG viewBox
  const minX = Math.min(...nodeList.map(n => n.x)) - 20;
  const maxX = Math.max(...nodeList.map(n => n.x)) + 20;
  const minY = Math.min(...nodeList.map(n => n.y)) - 20;
  const maxY = Math.max(...nodeList.map(n => n.y)) + 20;
  const width = maxX - minX;
  const height = maxY - minY;

  return (
    <div className="relative flex justify-center items-center w-full max-w-3xl mx-auto p-4">
      <svg 
        viewBox={`${minX} ${minY} ${width} ${height}`} 
        className="w-full h-auto max-h-[60vh] overflow-visible"
        style={{ filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}
      >
        {/* Draw Problem Triangles Highlight Background */}
        {invalidTriangles.map((ids, idx) => {
            const p1 = nodes[ids[0]];
            const p2 = nodes[ids[1]];
            const p3 = nodes[ids[2]];
            
            if (!p1 || !p2 || !p3) return null;
            
            return (
                <path 
                    key={`bad-${idx}`}
                    d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} Z`}
                    fill="rgba(255, 0, 0, 0.3)"
                    stroke="red"
                    strokeWidth="2"
                    className="animate-pulse"
                />
            )
        })}

        {/* Draw Connecting Lines */}
        {lines.map((line, idx) => {
          const n1 = nodes[line.p1];
          const n2 = nodes[line.p2];
          return (
            <line
              key={`line-${idx}`}
              x1={n1.x}
              y1={n1.y}
              x2={n2.x}
              y2={n2.y}
              stroke="#94a3b8"
              strokeWidth="2"
              opacity="0.5"
            />
          );
        })}

        {/* Draw Nodes */}
        {nodeList.map((node) => {
          const isFilled = node.color !== null;
          return (
            <g 
              key={node.id} 
              onClick={() => onNodeClick(node.id)}
              className="cursor-pointer group"
              style={{ filter: isFilled ? GLOW_MAP[node.color!] : 'none' }}
            >
              {/* Hit area larger than visible circle */}
              <circle cx={node.x} cy={node.y} r="15" fill="transparent" />
              
              {/* Visible Circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isFilled ? 10 : 8}
                fill={isFilled ? COLOR_MAP[node.color!] : '#1e293b'}
                stroke={isFilled ? 'white' : '#cbd5e1'}
                strokeWidth={isFilled ? 2 : 2}
                className="transition-all duration-300 ease-out group-hover:r-12"
              />
              
              {/* Hover Preview Indicator if tool selected */}
              {!isFilled && selectedColor && (
                  <circle 
                    cx={node.x} 
                    cy={node.y} 
                    r="6" 
                    fill={COLOR_MAP[selectedColor]} 
                    opacity="0"
                    className="group-hover:opacity-50 transition-opacity"
                  />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};