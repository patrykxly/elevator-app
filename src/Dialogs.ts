import { elevatorSystem } from "./ElevatorSystem";
import { addFloorBtnEventListener } from "./EventListeners";
import { createElementWithClassName, currentElevatorNum } from "./UIActions";

export function openModalDialog(clickedFloor: string, icon: Element): void {
  const mainEl = document.getElementsByTagName("main")[0] as HTMLElement;
  mainEl.insertAdjacentHTML(
    "afterbegin",
    `
      <dialog id = "choose-floor-dialog" open>
        <h3>Choose the floor</h3>
        <form method="dialog" class = "choose-floor-form">
        </form>
      </dialog>
    `
  );
  addFloorButtonsInDialog(clickedFloor, icon);
}

export function closeModalDialog(): void {
  const dialogElement = document.getElementById(
    "choose-floor-dialog"
  ) as HTMLDialogElement;
  if (!dialogElement) return;
  dialogElement.close();
}

export function openPeopleQueueDialog(): void {
  const mainEl = document.getElementsByTagName("main")[0] as HTMLElement;
  mainEl.insertAdjacentHTML(
    "afterbegin",
    `
      <dialog id = "queue-dialog" open>
        <h3>Queue</h3>
      </dialog>
    `
  );
  addContentToQueueDialog();
}

function addFloorButtonsInDialog(clickedFloor: string, icon: Element): void {
  const chooseFloorForm =
    document.getElementsByClassName("choose-floor-form")[0];
  const chooseFloorButtonsContainer = createElementWithClassName(
    "div",
    "choose-floor-buttons-container"
  );
  for (let i = 0; i <= 5; i++) {
    if (i === Number(clickedFloor)) continue;
    const floorBtn = createElementWithClassName(
      "button",
      "choose-floor-button",
      String(i)
    );
    addFloorBtnEventListener(floorBtn, clickedFloor, icon);
    chooseFloorButtonsContainer.appendChild(floorBtn);
  }
  chooseFloorForm.appendChild(chooseFloorButtonsContainer);
  chooseFloorForm.insertAdjacentHTML(
    "beforeend",
    `
      <button value="cancel" class="cancel-dialog-btn">Cancel</button>
    `
  );
}

function addContentToQueueDialog(): void {
  const queueDialog = document.getElementById("queue-dialog");
  const closeButton: HTMLElement = getCloseQueueButton(
    queueDialog as HTMLDialogElement
  );
  queueDialog?.insertAdjacentElement("afterbegin", closeButton);
  const waitingPeople = elevatorSystem.peopleQueue(currentElevatorNum);
  waitingPeople.forEach((person, index) => {
    const waitingPeopleContainer = createElementWithClassName(
      "div",
      "waiting-people-container"
    );
    const personNum = createElementWithClassName(
      "p",
      "person-num",
      String(index) + "."
    );
    const personCurrentFloor = createElementWithClassName(
      "div",
      "person-current-floor",
      "Current floor - " + String(person.currentFloor)
    );
    const personTargetFloor = createElementWithClassName(
      "div",
      "person-current-floor",
      "Target floor - " + String(person.targetFloor)
    );
    waitingPeopleContainer.append(
      personNum,
      personCurrentFloor,
      personTargetFloor
    );
    queueDialog?.append(waitingPeopleContainer);
  });
}

function getCloseQueueButton(queueDialog: HTMLDialogElement): HTMLElement {
  const closeButton: HTMLElement = createElementWithClassName(
    "button",
    "queue-dialog-close-btn",
    "x"
  );
  closeButton.addEventListener("click", () => {
    queueDialog.close();
  });
  return closeButton;
}
