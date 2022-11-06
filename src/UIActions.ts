import { openPeopleQueueDialog } from "./Dialogs";
import { elevatorSystem } from "./ElevatorSystem";
import {
  addBackButtonEventListener,
  addElevatorButtonEventListener,
  addElevatorIconEventListener,
  addStepButtonEventListener,
  resetStepBtnEventListener,
} from "./EventListeners";
import { Elevator } from "./models/ElevatorModel";
import {
  SVGICON_UP,
  SVGICON_DOWN,
  SVGICON_UPNDOWN,
  SVGICON_BACK,
} from "./SVGIcons";

export let currentElevatorNum = 1;
export let currentFloor = 0;

export function setCurrentElevatorNum(newNum: number): void {
  currentElevatorNum = newNum;
}

export function setCurrentFloor(newFloor: number): void {
  currentFloor = newFloor;
}

export function onSelectSubmitClick(): void {
  const chosenElevatorsAmount: number = getChosenElevatorsAmount();
  elevatorSystem.init(chosenElevatorsAmount);
  hideElements("floor-levels-picker-container");
  createElevatorsViews(chosenElevatorsAmount);
  createElevatorsUI();
}

export function onFloorBtnClick(
  floorBtn: HTMLElement,
  clickedFloor: string,
  icon: Element
): void {
  const targetFloor = Number(floorBtn.textContent as string);
  if (currentFloor !== Number(clickedFloor)) icon.classList.add("waiting");

  addTargetClassToButton(Number(floorBtn.textContent));
  elevatorSystem.pickup(currentElevatorNum, Number(clickedFloor), targetFloor);
}

export function createSelectOptions(): void {
  const selectList = document.getElementById("floor-levels-options");
  for (let i = 1; i <= 16; i++) {
    const option = document.createElement("option");
    option.value = String(i);
    option.innerText = String(i);
    selectList?.appendChild(option);
  }
}

export function deleteWaitingFloorClass(numToDelete: number): void {
  const newCurrentFloor = Array.from(
    document.querySelectorAll(".floor-number")
  ).find((floorNum: Element) => {
    return Number(floorNum.textContent as string) === numToDelete;
  });
  if (
    newCurrentFloor?.parentNode?.firstElementChild?.classList.contains(
      "waiting"
    )
  ) {
    newCurrentFloor.parentNode.firstElementChild.setAttribute(
      "class",
      "elevator-icon"
    );
  }
}

export function setCurrentElevatorFloorOnElevatorChange(): void {
  resetStepBtnEventListener();
  const currentElevator: Elevator = elevatorSystem.current(currentElevatorNum);
  setFloorButtonsAfterElevatorViewChange(currentElevator);
  currentFloor = currentElevator.currentFloor;
  const currentFloorElement: Element | undefined = Array.from(
    document.querySelectorAll(".floor-number")
  ).find((floorNum: Element) => {
    return Number(floorNum.textContent as string) === currentFloor;
  });
  if (currentFloorElement?.classList.contains("current-floor")) return;
  else {
    document.getElementsByClassName("current-floor")[0].className =
      "floor-number";
    currentFloorElement?.classList.add("current-floor");
  }
}

export function deleteTargetFloorClass(targetFloor: number): void {
  const targetFloorElement = Array.from(
    document.querySelectorAll(".floor-number")
  ).find((floorNum: Element) => {
    return Number(floorNum.textContent as string) === targetFloor;
  });
  if (
    targetFloorElement?.parentNode?.firstElementChild?.classList.contains(
      "target"
    )
  ) {
    targetFloorElement.parentNode.firstElementChild.setAttribute(
      "class",
      "elevator-icon"
    );
  }
}

export function createElementWithClassName(
  tagName: string,
  className: string,
  innerText?: string
): HTMLElement {
  const el: HTMLElement = document.createElement(tagName);
  el.className = className;
  if (innerText) el.innerText = innerText;
  return el;
}

export function hideElements(...args: string[]): void {
  for (const el of args) {
    (document.getElementsByClassName(el)[0] as HTMLElement).style.display =
      "none";
  }
}

function createElevatorsViews(elevatorsAmount: number): void {
  resetValues(elevatorsAmount);
  const titleElement: HTMLElement | null = document.getElementById("title");

  const elevatorSelectorContainer: HTMLElement = createElementWithClassName(
    "div",
    "elevator-selector-container"
  );

  const selectText: HTMLElement = createElementWithClassName(
    "span",
    "select-elevator-text",
    "Select elevator: "
  );
  elevatorSelectorContainer.appendChild(selectText);
  createElevatorViewsButtons(elevatorsAmount, elevatorSelectorContainer);

  insertAfter(elevatorSelectorContainer, titleElement);
}

function createElevatorsUI() {
  createBackButton();
  createQueueButton();
  const titleElement: HTMLElement | null = document.getElementById("title");
  const elevatorUIWrapper: HTMLElement = createElementWithClassName(
    "div",
    "elevator-ui-wrapper"
  );
  const elevatorUIContainer: HTMLElement = createElementWithClassName(
    "div",
    "elevator-ui-container"
  );
  createElevatorUIContainer(elevatorUIContainer);
  addElevatorButtonEventListener("elevator-icon");
  elevatorUIWrapper.appendChild(elevatorUIContainer);
  insertAfter(elevatorUIWrapper, titleElement);
  addStepButton(elevatorUIWrapper);
}

function createBackButton(): void {
  const nav = createElementWithClassName("div", "nav-container");
  if (document.getElementsByClassName("back-btn").length !== 0) {
    const existingBtnElement: HTMLElement = document.getElementsByClassName(
      "back-btn"
    )[0] as HTMLElement;
    if (existingBtnElement.style.display == "none")
      existingBtnElement.style.display = "flex";
    return;
  }
  const backBtn = SVGICON_BACK;
  const mainContainer: HTMLElement = document.getElementsByTagName("main")[0];
  nav.insertAdjacentHTML("afterbegin", backBtn);
  mainContainer.insertAdjacentElement("beforebegin", nav);
  const backBtnElement: HTMLElement = document.getElementsByClassName(
    "back-btn"
  )[0] as HTMLElement;
  addBackButtonEventListener(backBtnElement);
}

function createQueueButton(): void {
  if (document.getElementsByClassName("queue-btn").length === 0) {
    const queueButton: HTMLElement = createElementWithClassName(
      "button",
      "queue-btn",
      "View queue"
    );
    queueButton.addEventListener("click", () => {
      openPeopleQueueDialog();
    });
    document
      .getElementsByClassName("nav-container")[0]
      .appendChild(queueButton);
  } else {
    (
      document.getElementsByClassName("queue-btn")[0] as HTMLElement
    ).style.display = "block";
  }
}

function createElevatorUIContainer(elevatorUIContainer: HTMLElement): void {
  for (let i = 5; i >= 0; i--) {
    let floorNumEl: HTMLElement;
    const floorNumContainer = createElementWithClassName(
      "div",
      "floor-num-container"
    );
    if (i === 0) {
      floorNumEl = createElementWithClassName(
        "p",
        "floor-number current-floor",
        "0"
      );
      floorNumContainer.insertAdjacentHTML("beforeend", SVGICON_UP);
    } else if (i === 5) {
      floorNumEl = createElementWithClassName("p", "floor-number", "5");
      floorNumContainer.insertAdjacentHTML("beforeend", SVGICON_DOWN);
    } else {
      floorNumEl = createElementWithClassName("p", "floor-number", String(i));
      floorNumContainer.insertAdjacentHTML("beforeend", SVGICON_UPNDOWN);
    }
    floorNumContainer.appendChild(floorNumEl);
    elevatorUIContainer.appendChild(floorNumContainer);
  }
}

function createElevatorViewsButtons(
  elevatorsAmount: number,
  elevatorSelectorContainer: HTMLElement
): void {
  for (let i = 1; i <= elevatorsAmount; i++) {
    let elevatorView: HTMLElement;
    if (i === 1) {
      elevatorView = createElementWithClassName(
        "div",
        "elevator-view current-elevator",
        String(i)
      );
    } else {
      elevatorView = createElementWithClassName(
        "div",
        "elevator-view",
        String(i)
      );
    }
    addElevatorIconEventListener(elevatorView);
    elevatorSelectorContainer.appendChild(elevatorView);
  }
}

function addStepButton(elementBeforeBtn: HTMLElement): void {
  const stepButton: HTMLElement = createElementWithClassName(
    "button",
    "step-btn",
    "Step"
  );
  addStepButtonEventListener(stepButton);
  elementBeforeBtn.appendChild(stepButton);
}

function addTargetClassToButton(floorNum: number): void {
  Array.from(document.querySelectorAll(".floor-number"))
    .find((num) => Number(num.textContent) === floorNum)
    ?.parentNode?.firstElementChild?.classList.add("target");
}

function addWaitingClassToButton(floorNum: number): void {
  Array.from(document.querySelectorAll(".floor-number"))
    .find((num) => Number(num.textContent) === floorNum)
    ?.parentNode?.firstElementChild?.classList.add("waiting");
}

function getChosenElevatorsAmount(): number {
  const selectList = document.getElementById("floor-levels-options");
  return Number((selectList as HTMLInputElement).value);
}

function insertAfter(
  newNode: HTMLElement,
  referenceNode: HTMLElement | null
): void {
  referenceNode?.parentNode?.insertBefore(newNode, referenceNode.nextSibling);
}

function setFloorButtonsAfterElevatorViewChange(
  currentElevator: Elevator
): void {
  Array.from(document.querySelectorAll(".elevator-icon")).forEach((icon) =>
    icon.setAttribute("class", "elevator-icon")
  );
  currentElevator.waitingPeople.forEach((person) => {
    addTargetClassToButton(person.targetFloor);
    if (currentElevator.currentFloor !== person.currentFloor)
      addWaitingClassToButton(person.currentFloor);
  });
}

function resetValues(elevatorsAmount: number): void {
  currentElevatorNum = 1;
  currentFloor = 0;
  elevatorSystem.resetSystem(elevatorsAmount);
}