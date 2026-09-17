export interface SandOptions {
  count: number; pointSize: number; sizeVariation: number; shadeVariation: number; opacity: number;
  introMs: number; moveMs: number; holdMs: number; stagger: number; scatterPhase: number;
  scatterReach: number; scatterDepth: number; flightFade: number; jitter: number;
  depthRange: number; depthContrast: number; dustShare: number; tilt: number; tiltEase: number; sway: number;
  pictureScale: number; offsetX: number; offsetY: number; layoutMs: number; layoutPuff: number;
  cloudRadius: number; cloudFar: number; blurRadius: number; fillDensity: number; interiorTone: number;
  color: string; colorDark: string;
}
export interface Raster { w: number; h: number; data: Uint8ClampedArray }
export interface ShapeSource {
  name: string; url?: string; depthUrl?: string; scale?: number; pinOnly?: boolean;
  raster?: () => { line: Raster; depth?: Raster | null } | Promise<{ line: Raster; depth?: Raster | null }>;
}
export interface TextOptions { name?: string; scale?: number; fontFamily?: string; fontWeight?: number; letterSpacing?: number; extrude?: number }
export type SandStatus = { state: 'loading'; count: number } | { state: 'ready'; count: number; shapes: string[] } | { state: 'error'; message: string };
export interface Settings { shapes: ShapeSource[]; options?: Partial<SandOptions>; worker?: boolean; onStatus?: (status: SandStatus) => void; onError?: (error: Error) => void }
export class SandKit {
  constructor(canvas: HTMLCanvasElement, settings: Settings);
  readonly ready: Promise<void>;
  setShapes(shapes: ShapeSource[]): Promise<void>;
  setOptions(options: Partial<SandOptions>): Promise<void>;
  pin(name?: string | null): void;
  replay(): void;
  pause(): void;
  resume(): void;
  dispose(): void;
}
export const DEFAULTS: Readonly<SandOptions>;
export const PARAMETERS: Record<Exclude<keyof SandOptions, 'color' | 'colorDark'>, {group: string; label: string; value: number; min: number; max: number; step: number; help: string; rebuild: boolean}>;
export function normalizeOptions(input?: Partial<SandOptions>, base?: SandOptions): SandOptions;
export function textShape(text: string, options?: TextOptions): ShapeSource;
export function rasterizeText(text: string, options?: TextOptions): Promise<{line: Raster; depth: Raster}>;
export function readPixels(url: string): Promise<Raster>;
export function validatePair(line: Raster, depth?: Raster | null): void;
