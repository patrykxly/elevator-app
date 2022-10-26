import { Direction } from "./enums/DirectionEnum";
import { Status } from "./enums/StatusEnum";
import { Elevator } from "./models/ElevatorModel";
import { WaitingPerson } from "./models/WaitingPersonModel";
import { deleteTargetFloorClass, deleteWaitingFloorClass } from "./UIActions";

export const elevatorSystem = (function () {
  const elevators: Array<Elevator> = [];

  function createElevator(id: number): Elevator {
    const elevator: Elevator = {
      Id: id,
      currentFloor: 0,
      targetFloor: 0,
      direction: Direction.Default,
      waitingPeople: [],
    };
    return elevator;
  }

  function addWaitingPerson(
    elevatorId: number,
    currentFloor: number,
    targetFloor: number
  ): void {
    const currentElevator: Elevator = elevatorSystem.current(elevatorId);
    const waitingPersonData: WaitingPerson = {
      Id: crypto.randomUUID(),
      elevatorId: elevatorId,
      currentFloor: currentFloor,
      targetFloor: targetFloor,
      status: setNewPersonStatus(currentElevator, currentFloor, targetFloor),
    };
    currentElevator.waitingPeople.push(waitingPersonData);
  }

  function setNewPersonStatus(
    currentElevator: Elevator,
    currentFloor: number,
    targetFloor: number
  ): Status {
    if (
      currentElevator.direction === Direction.Up ||
      currentElevator.direction === Direction.Default
    ) {
      return currentFloor === currentElevator.currentFloor &&
        targetFloor > currentFloor
        ? Status.going
        : Status.waiting;
    }
    return currentFloor === currentElevator.currentFloor &&
      targetFloor < currentFloor
      ? Status.going
      : Status.waiting;
  }

  function getNextTargetFloor(elevatorId: number): number {
    const currentElevator: Elevator = elevatorSystem.current(elevatorId);
    const pendingFloors: Array<number> = currentElevator.waitingPeople.map(
      (person) => person.currentFloor
    );
    const targetFloors: Array<number> = currentElevator.waitingPeople.map(
      (person) => person.targetFloor
    );
    if (currentElevator.waitingPeople.length === 0) return -1;
    if (
      currentElevator.waitingPeople.length === 1 &&
      pendingFloors.length === 1
    ) {
      if (
        currentElevator.waitingPeople[0].currentFloor ===
        currentElevator.currentFloor
      ) {
        currentElevator.waitingPeople[0].status = Status.going;
      }
      if (isPersonLeavingElevator(currentElevator)) {
        deleteTargetFloorClass(currentElevator.targetFloor);
        currentElevator.waitingPeople.pop();
        return -1;
      }
      if (pendingFloors[0] === currentElevator.currentFloor) {
        currentElevator.targetFloor =
          currentElevator.waitingPeople[0].targetFloor;
        return targetFloors[0];
      }
      if (isPersonWaiting(currentElevator, pendingFloors)) {
        return pendingFloors[0];
      }
      if (isPersonPickedUp(currentElevator, pendingFloors)) {
        updateElevatorOnPickup(currentElevator);
        return -2;
      }
    } else if (currentElevator.waitingPeople.length > 1) {
      let newTargetFloor = currentElevator.targetFloor;
      let peopleInElevator: Array<WaitingPerson> = [];
      let direction;
      if (currentElevator.currentFloor === 5) direction = Direction.Down;
      else if (currentElevator.currentFloor === 0) direction = Direction.Up;
      else direction = currentElevator.direction;
      let peopleInQueueAfterReachingFloor: Array<WaitingPerson> = [];

      if (
        new Set(
          currentElevator.waitingPeople.map((person) => person.currentFloor)
        ).size === 1 &&
        isPersonPickedUp(currentElevator, pendingFloors)
      ) {
        updateElevatorOnPickup(currentElevator);
        peopleInElevator = currentElevator.waitingPeople;
        peopleInQueueAfterReachingFloor = currentElevator.waitingPeople;
        return -2;
      }

      if (peopleInElevator.length === 0)
        peopleInElevator = getPeopleInElevatorAfterReachingFloor(
          direction,
          currentElevator
        );
      if (peopleInElevator.length !== 0) {
        newTargetFloor =
          direction === Direction.Up
            ? Math.max(...peopleInElevator.map((person) => person.targetFloor))
            : Math.min(...peopleInElevator.map((person) => person.targetFloor));
        currentElevator.targetFloor = newTargetFloor;
        peopleInElevator.map((person) => (person.status = Status.going));
        direction = currentElevator.direction;
      }
      if (peopleInQueueAfterReachingFloor.length === 0) {
        direction = currentElevator.direction;
        peopleInQueueAfterReachingFloor = getPeopleInQueueAfterReachingFloor(
          direction,
          currentElevator.waitingPeople
        );
        pushPeopleNotIncludedAfterGettingIntoElevator(
          currentElevator,
          peopleInElevator,
          peopleInQueueAfterReachingFloor
        );
      }
      if (
        peopleInQueueAfterReachingFloor.length !==
        currentElevator.waitingPeople.length
      ) {
        currentElevator.direction === Direction.Up
          ? deleteTargetFloorClass(currentElevator.currentFloor + 1)
          : deleteTargetFloorClass(currentElevator.currentFloor - 1);
        currentElevator.waitingPeople = peopleInQueueAfterReachingFloor;
        if (currentElevator.waitingPeople.length === 1)
          currentElevator.targetFloor =
            currentElevator.waitingPeople[0].targetFloor;
      }

      return newTargetFloor;
    }
    return -1;
  }

  function getPeopleInQueueAfterReachingFloor(
    direction: Direction,
    waitingPeople: Array<WaitingPerson>
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

  function getPeopleInElevatorAfterReachingFloor(
    direction: Direction,
    currentElevator: Elevator
  ): Array<WaitingPerson> {
    return direction === Direction.Up
      ? currentElevator.waitingPeople.filter(
          (person) =>
            (person.currentFloor === currentElevator.currentFloor + 1 ||
              person.currentFloor === currentElevator.currentFloor) &&
            person.targetFloor > person.currentFloor
        )
      : currentElevator.waitingPeople.filter(
          (person) =>
            (person.currentFloor === currentElevator.currentFloor - 1 ||
              person.currentFloor === currentElevator.currentFloor) &&
            person.targetFloor < person.currentFloor
        );
  }

  function getDirection(
    newCurrentFloor: number,
    targetFloor: number,
    currentFloor: number
  ): Direction {
    if (currentFloor && currentFloor !== newCurrentFloor) {
      return newCurrentFloor > currentFloor ? Direction.Up : Direction.Down;
    }
    return newCurrentFloor > targetFloor ? Direction.Down : Direction.Up;
  }

  function pushPeopleNotIncludedAfterGettingIntoElevator(
    currentElevator: Elevator,
    peopleInElevator: Array<WaitingPerson>,
    peopleInQueueAfterReachingFloor: Array<WaitingPerson>
  ): void {
    const peopleNotIncluded = peopleInElevator.filter(
      (person) =>
        person.status === Status.going &&
        person.currentFloor ===
          currentElevator.currentFloor + currentElevator.direction
    );
    peopleNotIncluded.forEach((person) =>
      peopleInQueueAfterReachingFloor.push(person)
    );
  }

  function updateElevatorOnPickup(currentElevator: Elevator): void {
    const waitingPeople: Array<WaitingPerson> = currentElevator.waitingPeople;
    const previousTargetFloor = waitingPeople[0].currentFloor;
    deleteWaitingFloorClass(waitingPeople[0].currentFloor);
    waitingPeople[0].currentFloor = waitingPeople[0].targetFloor;
    waitingPeople.map((person) => (person.status = Status.going));
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
        currentElevator.waitingPeople.length) as boolean)
    );
  }

  function isPersonWaiting(
    currentElevator: Elevator,
    pendingFloors: Array<number>
  ): boolean {
    return (
      currentElevator.waitingPeople[0]?.status === Status.waiting &&
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
      currentElevator.waitingPeople[0].status === Status.going &&
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

      if (currentElevator.waitingPeople.length === 1)
        this.update(elevatorId, currentElevator.currentFloor, pendingFloor);
    },

    update(
      elevatorId: number,
      newCurrentFloor: number,
      newTargetFloor: number,
      currentFloor?: number
    ): void {
      const currentElevator = this.current(elevatorId);
      const direction = getDirection(
        newCurrentFloor,
        newTargetFloor,
        currentFloor as number
      );
      currentElevator.currentFloor = newCurrentFloor;
      currentElevator.targetFloor = newTargetFloor;
      currentElevator.direction = direction;
      currentElevator.waitingPeople
        .filter((person) => person.status === Status.going)
        .forEach((person) => (person.currentFloor = newCurrentFloor));
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

    peopleQueue(elevatorId: number): Array<WaitingPerson> {
      return this.current(elevatorId).waitingPeople;
    }
  };
})();
