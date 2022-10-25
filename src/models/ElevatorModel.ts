import { Direction } from "../enums/DirectionEnum";
import { WaitingPerson } from "./WaitingPersonModel";

export interface Elevator {
  Id: number;
  currentFloor: number;
  targetFloor: number;
  direction: Direction;
  waitingPeople: Array<WaitingPerson>;
}
