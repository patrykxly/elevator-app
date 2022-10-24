# Elevator app
## Description
App is simulating elevator system, letting user to move between different floors. There are 6 floors and there is possibility to pick up to 16 elevators. First we choose the number of elevators and then you can switch them using buttons at the bottom. The elevator state is saved each time you go to the other one.<br />
Selecting floors is done by using buttons at the right side of floor numbers. The number on the left side of chosen button defines on which floor the user is waiting at the moment. The elevator will pick him up and then go to the target floor chosen on the dialog which appears after clicking the button.<br /> 
The 'Step' button allows us to change the current floor depending on the current elevator target. <br />
You can change elevators number by clicking 'Back' button and selecting it once again. Then the whole system will be reseted.

## Technologies and tools used
* TypeScript
* SCSS/HTML
* Webpack

## Installation
To run the app locally on VSCode:
* Clone repo 
* Write `npm i` in the terminal
* Write npm run serve