import { Direction } from "../enums/DirectionEnum";

export interface Elevator {
  Id: number;
  currentFloor: number;
  targetFloor: number;
  direction: Direction;
}
