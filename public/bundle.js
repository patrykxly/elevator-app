/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://elevator-app/./src/style.scss?");

/***/ }),

/***/ "./src/elevatorSystem.ts":
/*!*******************************!*\
  !*** ./src/elevatorSystem.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.elevatorSystem = void 0;\r\nexports.elevatorSystem = (function () {\r\n    let elevators = [];\r\n    function createElevatorModel(id) {\r\n        let elevator = {\r\n            Id: id,\r\n            currentFloor: 0,\r\n            targetFloor: 0,\r\n            direction: 0,\r\n        };\r\n        return elevator;\r\n    }\r\n    function findElevatorModelById(Id) {\r\n        return elevators.find((elevator) => elevator.Id == Id);\r\n    }\r\n    return {\r\n        init(elevatorsNum) {\r\n            for (let i = 0; i < elevatorsNum; i++) {\r\n                let elevator = createElevatorModel(i);\r\n                elevators.push(elevator);\r\n            }\r\n        },\r\n        pickup(elevatorId, targetFloor, direction) {\r\n            let elevator = findElevatorModelById(elevatorId);\r\n            if (!elevator)\r\n                return;\r\n            elevator.targetFloor = targetFloor;\r\n            elevator.direction = direction;\r\n        },\r\n        update(oldElevatorModelId, newElevatorModelId, newCurrentFloor, newTargetFloor) {\r\n            let elevator = findElevatorModelById(oldElevatorModelId);\r\n            if (!elevator)\r\n                return;\r\n            elevator.Id = newElevatorModelId;\r\n            elevator.currentFloor = newCurrentFloor;\r\n            elevator.targetFloor = newTargetFloor;\r\n        },\r\n        step(elevatorId) {\r\n            let elevator = findElevatorModelById(elevatorId);\r\n            if (!elevator)\r\n                return;\r\n            elevator.currentFloor += 1;\r\n        },\r\n        status() {\r\n            return elevators;\r\n        },\r\n    };\r\n})();\r\n\n\n//# sourceURL=webpack://elevator-app/./src/elevatorSystem.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nconst elevatorSystem_1 = __webpack_require__(/*! ./elevatorSystem */ \"./src/elevatorSystem.ts\");\r\n__webpack_require__(/*! ./style.scss */ \"./src/style.scss\");\r\nwindow.onload = () => {\r\n    var _a;\r\n    addSelectOptions();\r\n    (_a = document\r\n        .getElementsByClassName(\"submit-btn\")[0]) === null || _a === void 0 ? void 0 : _a.addEventListener(\"click\", (e) => {\r\n        e.preventDefault();\r\n        onSelectSubmitClick();\r\n    });\r\n};\r\nfunction addSelectOptions() {\r\n    let selectList = document.getElementById(\"floor-levels-options\");\r\n    for (let i = 1; i <= 16; i++) {\r\n        const option = document.createElement(\"option\");\r\n        option.value = String(i);\r\n        option.innerText = String(i);\r\n        selectList === null || selectList === void 0 ? void 0 : selectList.appendChild(option);\r\n    }\r\n}\r\nfunction onSelectSubmitClick() {\r\n    const selectList = document.getElementById(\"floor-levels-options\");\r\n    const chosenElevatorsAmount = Number(selectList.value);\r\n    document.getElementsByClassName(\"floor-levels-picker-container\")[0].style.display = \"none\";\r\n    elevatorSystem_1.elevatorSystem.init(chosenElevatorsAmount);\r\n    createElevatorsView(chosenElevatorsAmount);\r\n}\r\nfunction createElevatorsView(elevatorsAmount) {\r\n    const titleElement = document.getElementById(\"title\");\r\n    let elevatorSelectorContainer = document.createElement(\"div\");\r\n    elevatorSelectorContainer.className = \"elevator-selector-container\";\r\n    let selectText = document.createElement(\"span\");\r\n    selectText.innerText = \"Select elevator: \";\r\n    selectText.className = \"select-elevator-text\";\r\n    elevatorSelectorContainer.appendChild(selectText);\r\n    for (let i = 1; i <= elevatorsAmount; i++) {\r\n        let elevatorView = document.createElement(\"div\");\r\n        elevatorView.className = \"elevator-view\";\r\n        elevatorView.innerText = String(i);\r\n        elevatorSelectorContainer.appendChild(elevatorView);\r\n    }\r\n    titleElement === null || titleElement === void 0 ? void 0 : titleElement.appendChild(elevatorSelectorContainer);\r\n}\r\n\n\n//# sourceURL=webpack://elevator-app/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;