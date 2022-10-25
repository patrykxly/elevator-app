import { Direction } from "./enums/DirectionEnum";
import { Status } from "./enums/StatusEnum";
import { Elevator } from "./models/ElevatorModel";
import { WaitingPerson } from "./models/WaitingPersonModel";
import { deleteTargetFloorClass } from "./UIActions";

export const elevatorSystem = (function () {
  const elevators: Array<Elevator> = [];
  let waitingPeople: Array<WaitingPerson> = [];

  function createElevator(id: number): Elevator {
    const elevator: Elevator = {
      Id: id,
      currentFloor: 0,
      targetFloor: 0,
      direction: Direction.Default,
    };
    return elevator;
  }

  function addWaitingPerson(
    elevatorId: number,
    currentFloor: number,
    targetFloor: number
  ): void {
    const waitingPersonData: WaitingPerson = {
      Id: crypto.randomUUID(),
      elevatorId: elevatorId,
      currentFloor: currentFloor,
      targetFloor: targetFloor,
      status: Status.waiting,
    };
    waitingPeople.push(waitingPersonData);
  }

  function getDirection(
    newCurrentFloor: number,
    targetFloor: number,
    currentFloor: number
  ) {
    if (currentFloor) {
      return newCurrentFloor > currentFloor ? Direction.Up : Direction.Down;
    }
    return newCurrentFloor > targetFloor ? Direction.Down : Direction.Up;
  }

  function getNextTargetFloor(elevatorId: number): number {
    const currentElevator: Elevator = elevatorSystem.current(elevatorId);
    const pendingFloors: Array<number> = waitingPeople.map(
      (person) => person.currentFloor
    );
    const waitingFloors: Array<number> = waitingPeople.map(
      (person) => person.targetFloor
    );
    if (waitingPeople.length === 0) return -1;
    if (waitingPeople.length === 1 && pendingFloors.length === 1) {
      if (waitingPeople[0].currentFloor === currentElevator.currentFloor) {
        waitingPeople[0].status = Status.going;
      }
      if (isPersonLeavingElevator(currentElevator)) {
        deleteTargetFloorClass(currentElevator.targetFloor);
        waitingPeople.pop();
        return -1;
      }
      if (pendingFloors[0] === currentElevator.currentFloor) {
        waitingPeople[0].status = Status.going;
        currentElevator.targetFloor = waitingPeople[0].targetFloor;
        return waitingFloors[0];
      }
      if (isPersonWaiting(currentElevator, pendingFloors)) {
        return pendingFloors[0];
      }
      if (isPersonPickedUp(currentElevator, pendingFloors)) {
        updateElevatorOnPickup(currentElevator);
        return -2;
      }
    } else if (waitingPeople.length > 1) {
      const direction = currentElevator.direction;
      let newTargetFloor = currentElevator.targetFloor;

      const peopleInQueueAfterReachingFloor =
        getPeopleInQueueAfterReachingFloor(direction);
    
      if (peopleInQueueAfterReachingFloor.length !== waitingPeople.length) {
        currentElevator.direction === Direction.Up
          ? deleteTargetFloorClass(currentElevator.currentFloor + 1)
          : deleteTargetFloorClass(currentElevator.currentFloor - 1);
      }

      waitingPeople = peopleInQueueAfterReachingFloor;

      const peopleAtTheSameFloor = getPeopleOnTheSameFloorAfterReachingFloor(
        direction,
        currentElevator
      );
      
      if (peopleAtTheSameFloor.length !== 0) {
        newTargetFloor =
          direction === Direction.Up
            ? Math.max(
                ...peopleAtTheSameFloor.map((person) => person.targetFloor)
              )
            : Math.min(
                ...peopleAtTheSameFloor.map((person) => person.targetFloor)
              );
        currentElevator.targetFloor = newTargetFloor;
        peopleAtTheSameFloor.map((person) => (person.status = Status.going));
      }
      return newTargetFloor;
    }
    return -1;
  }

  function getPeopleInQueueAfterReachingFloor(
    direction: Direction
  ): Array<WaitingPerson> {
    return direction === Direction.Up
      ? waitingPeople.filter((person) => {
          return !(
            person.currentFloor + 1 === person.targetFloor &&
            person.status === Status.going
          );
        })
      : waitingPeople.filter((person) => {
          return !(
            person.currentFloor - 1 === person.targetFloor &&
            person.status === Status.going
          );
        });
  }

  function getPeopleOnTheSameFloorAfterReachingFloor(
    direction: Direction,
    currentElevator: Elevator
  ): Array<WaitingPerson> {
    return direction === Direction.Up
      ? waitingPeople.filter(
          (person) =>
            person.currentFloor === currentElevator.currentFloor &&
            person.targetFloor > person.currentFloor
        )
      : waitingPeople.filter(
          (person) =>
            person.currentFloor === currentElevator.currentFloor &&
            person.targetFloor < person.currentFloor
        );
  }

  function updateElevatorOnPickup(currentElevator: Elevator): void {
    const previousTargetFloor = waitingPeople[0].currentFloor;
    waitingPeople[0].currentFloor = waitingPeople[0].targetFloor;
    waitingPeople[0].status = Status.going;
    elevatorSystem.update(
      currentElevator.Id,
      previousTargetFloor,
      waitingPeople[0].targetFloor,
      currentElevator.targetFloor
    );
  }

  function isPersonPickedUp(
    currentElevator: Elevator,
    pendingFloors: Array<number>
  ): boolean {
    return (
      (currentElevator.direction === Direction.Up &&
        pendingFloors[0] === currentElevator.currentFloor + 1) ||
      ((currentElevator.direction === Direction.Down &&
        pendingFloors[0] === currentElevator.currentFloor - 1 &&
        waitingPeople.length) as boolean)
    );
  }

  function isPersonWaiting(
    currentElevator: Elevator,
    pendingFloors: Array<number>
  ): boolean {
    return (
      waitingPeople[0]?.status === Status.waiting &&
      ((pendingFloors[0] !== currentElevator.currentFloor + 1 &&
        currentElevator.direction === Direction.Up) ||
        (currentElevator.direction === Direction.Down &&
          pendingFloors[0] !== currentElevator.currentFloor - 1))
    );
  }

  function isPersonLeavingElevator(currentElevator: Elevator): boolean {
    const elevatorDirection = getDirection(
      currentElevator.targetFloor,
      currentElevator.targetFloor,
      currentElevator.currentFloor
    );
    return (
      waitingPeople[0].status === Status.going &&
      ((elevatorDirection === Direction.Up &&
        currentElevator.currentFloor + 1 === currentElevator.targetFloor) ||
        (elevatorDirection === Direction.Down &&
          currentElevator.currentFloor - 1 === currentElevator.targetFloor))
    );
  }

  function findElevatorById(Id: number): Elevator | undefined {
    return elevators.find((elevator) => elevator.Id == Id);
  }

  return {
    init(elevatorsNum: number): void {
      for (let i = 1; i <= elevatorsNum; i++) {
        const elevator: Elevator = createElevator(i);
        elevators.push(elevator);
      }
    },

    resetSystem(elevatorsNum: number): void {
      elevators.length = 0;
      elevatorSystem.init(elevatorsNum);
    },

    pickup(
      elevatorId: number,
      pendingFloor: number,
      targetFloor: number
    ): void {
      addWaitingPerson(elevatorId, pendingFloor, targetFloor);
      const currentElevator: Elevator = this.current(elevatorId);

      if (currentElevator.currentFloor === pendingFloor) {
        this.update(elevatorId, currentElevator.currentFloor, targetFloor);
        return;
      }

      if (waitingPeople.length === 1)
        this.update(elevatorId, currentElevator.currentFloor, pendingFloor);
    },

    update(
      elevatorId: number,
      newCurrentFloor: number,
      newTargetFloor: number,
      currentFloor?: number
    ): void {
      const currentElevator = this.current(elevatorId);
      waitingPeople
        .filter((person) => person.status === Status.going)
        .forEach((person) => (person.currentFloor = newCurrentFloor));
      currentElevator.currentFloor = newCurrentFloor;
      currentElevator.targetFloor = newTargetFloor;
      currentElevator.direction = getDirection(
        newCurrentFloor,
        newTargetFloor,
        currentFloor as number
      );
    },

    step(elevatorId: number): number {
      const currentElevator = this.current(elevatorId);
      const nextTargetFloor: number = getNextTargetFloor(elevatorId);

      if (nextTargetFloor === -1) {
        this.update(
          elevatorId,
          currentElevator.targetFloor,
          currentElevator.targetFloor
        );
        return currentElevator.targetFloor;
      } else if (nextTargetFloor === -2) {
        return currentElevator.currentFloor;
      }

      const newCurrentFloor: number =
        nextTargetFloor > currentElevator.currentFloor
          ? currentElevator.currentFloor + 1
          : currentElevator.currentFloor - 1;
      this.update(
        elevatorId,
        newCurrentFloor,
        currentElevator.targetFloor,
        currentElevator.currentFloor
      );
      return currentElevator.currentFloor;
    },

    current(elevatorId: number): Elevator {
      return findElevatorById(elevatorId) as Elevator;
    },

    getWaitingPeople(): Array<WaitingPerson> {
      return waitingPeople;
    },

    status(): Array<Elevator> {
      return elevators;
    },
  };
})();
