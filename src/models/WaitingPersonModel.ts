import { Status } from "../enums/StatusEnum";

export interface WaitingPerson {
    Id: string,
    elevatorId: number,
    currentFloor: number,
    targetFloor: number,
    status: Status
}