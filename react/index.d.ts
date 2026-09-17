import type { CSSProperties, ReactElement } from 'react';
import type { ShapeSource, SandOptions } from '../src/index.js';
export interface SandCanvasProps {
  shapes: ShapeSource[];
  options?: Partial<SandOptions>;
  pin?: string | null;
  onError?: (error: Error) => void;
  className?: string;
  style?: CSSProperties;
}
export function SandCanvas(props: SandCanvasProps): ReactElement;
