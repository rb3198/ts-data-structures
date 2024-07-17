export interface IArea {
  getMinCoord: (axis: number) => number;
  getMaxCoord: (axis: number) => number;
  isWithinBounds: (point: number[]) => boolean;
}
