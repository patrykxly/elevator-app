import { closeModalDialog, openModalDialog } from "./Dialogs";
import { elevatorSystem } from "./ElevatorSystem";
import {
  currentElevatorNum,
  currentFloor,
  deleteWaitingFloorClass,
  hideElements,
  onFloorBtnClick,
  setCurrentElevatorFloorOnElevatorChange,
  setCurrentElevatorNum,
  setCurrentFloor,
} from "./UIActions";

export function addBackButtonEventListener(backBtnElement: HTMLElement): void {
  backBtnElement.addEventListener("click", () => {
    (
      document.getElementsByClassName(
        "floor-levels-picker-container"
      )[0] as HTMLElement
    ).style.display = "block";
    hideElements(
      "elevator-selector-container",
      "elevator-ui-wrapper",
      "back-btn",
      "queue-btn"
    );
    closeModalDialog();
  });
}

export function addElevatorIconEventListener(elevatorView: HTMLElement): void {
  elevatorView.addEventListener("click", () => {
    document.getElementsByClassName("current-elevator")[0].className =
      "elevator-view";
    elevatorView.classList.add("current-elevator");
    setCurrentElevatorNum(Number(elevatorView.textContent as string));
    setCurrentElevatorFloorOnElevatorChange();
  });
}

export function addStepButtonEventListener(stepButton: HTMLElement): void {
  stepButton.addEventListener("click", setNextFloor);
}

export function addElevatorButtonEventListener(iconClassName: string): void {
  setTimeout(() => {
    document.querySelectorAll(`.${iconClassName}`).forEach((icon) => {
      icon.addEventListener("click", () => {
        const clickedFloor = icon.parentNode?.lastElementChild?.textContent;
        openModalDialog(clickedFloor as string, icon);
      });
    });
  }, 0);
}

export function addFloorBtnEventListener(
  floorBtn: HTMLElement,
  clickedFloor: string,
  icon: Element
): void {
  floorBtn.addEventListener("click", () =>
    onFloorBtnClick(floorBtn, clickedFloor, icon)
  );
}

export function resetStepBtnEventListener(): void {
  const stepBtn = document.querySelectorAll(".step-btn")[0] as HTMLElement;
  stepBtn.removeEventListener("click", setNextFloor);
  addStepButtonEventListener(stepBtn);
}

function setNextFloor(): void {
  setCurrentFloor(elevatorSystem.step(currentElevatorNum));
  setNewCurrentFloorAndDeleteWaitingFloor(currentFloor);
}

function setNewCurrentFloorAndDeleteWaitingFloor(currentFloor: number): void {
  document.getElementsByClassName("current-floor")[0].className =
    "floor-number";
  const newCurrentFloor = Array.from(
    document.querySelectorAll(".floor-number")
  ).find((floorNum: Element) => {
    return Number(floorNum.textContent as string) === currentFloor;
  });
  newCurrentFloor?.classList.add("current-floor");
  deleteWaitingFloorClass(currentFloor);
}
