import { elevatorSystem } from "./ElevatorSystem";
import { Elevator } from "./models/ElevatorModel";
import {
  SVGICON_UP,
  SVGICON_DOWN,
  SVGICON_UPNDOWN,
  SVGICON_BACK,
} from "./SVGIcons";

let currentElevatorNum = 1;
let currentFloor = 0;

export function onSelectSubmitClick(): void {
  const chosenElevatorsAmount: number = getChosenElevatorsAmount();
  elevatorSystem.init(chosenElevatorsAmount);
  hideElements("floor-levels-picker-container");
  createElevatorsViews(chosenElevatorsAmount);
  createElevatorsUI();
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

export function createElevatorsViews(elevatorsAmount: number): void {
  resetValues(elevatorsAmount);
  const titleElement: HTMLElement | null = document.getElementById("title");

  const elevatorSelectorContainer: HTMLElement = document.createElement("div");
  elevatorSelectorContainer.className = "elevator-selector-container";

  const selectText: HTMLElement = createElementWithClassName(
    "span",
    "select-elevator-text",
    "Select elevator: "
  );
  elevatorSelectorContainer.appendChild(selectText);
  createElevatorViewsButtons(elevatorsAmount, elevatorSelectorContainer);

  insertAfter(elevatorSelectorContainer, titleElement);
}

export function createElevatorsUI() {
  createBackButton();
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
  addListenerToElevatorIcon("elevator-icon");
  elevatorUIWrapper.appendChild(elevatorUIContainer);
  insertAfter(elevatorUIWrapper, titleElement);
  addStepButton(elevatorUIWrapper);
}

export function hideElements(...args: string[]): void {
  for (const el of args) {
    (document.getElementsByClassName(el)[0] as HTMLElement).style.display =
      "none";
  }
}

export function getChosenElevatorsAmount(): number {
  const selectList = document.getElementById("floor-levels-options");
  return Number((selectList as HTMLInputElement).value);
}

function createBackButton(): void {
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
  mainContainer.insertAdjacentHTML("beforebegin", backBtn);
  const backBtnElement: HTMLElement = document.getElementsByClassName(
    "back-btn"
  )[0] as HTMLElement;
  backBtnElement.addEventListener("click", () => {
    (
      document.getElementsByClassName(
        "floor-levels-picker-container"
      )[0] as HTMLElement
    ).style.display = "block";
    hideElements(
      "elevator-selector-container",
      "elevator-ui-wrapper",
      "back-btn"
    );
    closeModalDialog();
  });
}

function createElementWithClassName(
  tagName: string,
  className: string,
  innerText?: string
): HTMLElement {
  const el: HTMLElement = document.createElement(tagName);
  el.className = className;
  if (innerText) el.innerText = innerText;
  return el;
}

function insertAfter(
  newNode: HTMLElement,
  referenceNode: HTMLElement | null
): void {
  referenceNode?.parentNode?.insertBefore(newNode, referenceNode.nextSibling);
}

function addListenerToElevatorIcon(iconClassName: string): void {
  setTimeout(() => {
    document.querySelectorAll(`.${iconClassName}`).forEach((icon) => {
      icon.addEventListener("click", () => {
        const clickedFloor = icon.parentNode?.lastElementChild?.textContent;
        openModalDialog(clickedFloor as string);
      });
    });
  }, 0);
}

function openModalDialog(clickedFloor: string): void {
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
  addFloorButtonsInDialog(clickedFloor);
}

function closeModalDialog(): void {
  const dialogElement = document.getElementById(
    "choose-floor-dialog"
  ) as HTMLDialogElement;
  if (!dialogElement) return;
  dialogElement.close();
}

function addFloorButtonsInDialog(clickedFloor: string): void {
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
    addFloorBtnEventListener(floorBtn, clickedFloor);
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

function addFloorBtnEventListener(
  floorBtn: HTMLElement,
  clickedFloor: string
): void {
  floorBtn.addEventListener("click", () =>
    pickupOnFloorBtnClick(floorBtn, clickedFloor)
  );
}

function pickupOnFloorBtnClick(
  floorBtn: HTMLElement,
  clickedFloor: string
): void {
  const targetFloor = Number(floorBtn.textContent as string);
  elevatorSystem.pickup(currentElevatorNum, Number(clickedFloor), targetFloor);
}

function setCurrentElevatorFloorOnElevatorChange(): void {
  resetStepBtnEventListener();
  const currentElevator: Elevator = elevatorSystem.current(currentElevatorNum);
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

function addStepButton(elementBeforeBtn: HTMLElement): void {
  const stepButton: HTMLElement = createElementWithClassName(
    "button",
    "step-btn",
    "Step"
  );
  addStepButtonEventListener(stepButton);
  elementBeforeBtn.appendChild(stepButton);
}

function addStepButtonEventListener(stepButton: HTMLElement): void {
  stepButton.addEventListener("click", setNextFloor);
}

function setNextFloor(): void {
  currentFloor = elevatorSystem.step(currentElevatorNum);
  document.getElementsByClassName("current-floor")[0].className =
    "floor-number";
  Array.from(document.querySelectorAll(".floor-number"))
    .find((floorNum: Element) => {
      return Number(floorNum.textContent as string) === currentFloor;
    })
    ?.classList.add("current-floor");
}

function resetValues(elevatorsAmount: number): void {
  currentElevatorNum = 1;
  currentFloor = 0;
  elevatorSystem.resetSystem(elevatorsAmount);
}

function resetStepBtnEventListener(): void {
  const stepBtn = document.querySelectorAll(".step-btn")[0] as HTMLElement;
  stepBtn.removeEventListener("click", setNextFloor);
  addStepButtonEventListener(stepBtn);
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
    elevatorView.addEventListener("click", () => {
      document.getElementsByClassName("current-elevator")[0].className =
        "elevator-view";
      elevatorView.classList.add("current-elevator");
      currentElevatorNum = Number(elevatorView.textContent as string);
      setCurrentElevatorFloorOnElevatorChange();
    });
    elevatorSelectorContainer.appendChild(elevatorView);
  }
}
