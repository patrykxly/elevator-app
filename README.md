# Elevator app
## Description
App is simulating elevator system, letting user to move between different floors. There are 6 floors and there is possibility to pick up to 16 elevators. First we choose the number of elevators and then you can switch their views using buttons at the bottom. The elevator state is saved each time you go to the other one. <br />
Selecting floors is done by using buttons at the right side of floor numbers. The number on the left side of chosen button defines on which floor the user is waiting at the moment. The elevator will pick him up and then go to the target floor chosen on the dialog which appears after clicking the button. Target floor buttons are marked as red and buttons at the right side of floors with waiting people are marked as yellow. It is possible to pick up many people at once. You can check people queue in the current elevator by clicking 'View queue' button at the upper right.<br /> 
The 'Step' button allows us to change the current floor depending on the current elevator target. <br />
You can change elevators amount by clicking 'Back' button and selecting it once again. Then the whole system will be reseted. <br />
## The algorithm
When there is only one person waiting for the elevator, the elevator will go for him and get him to the destination. When there are more people in the queue, the elevator direction is set to the direction in which the first person in the queue is going and then every person waiting on the floors on the way to the destination and going in the same direction is picked and taken to the target floor. Then the elevator will go for the people that want to go to the other direction and take them to the right place. If the elevator is on the way to the first person in queue and some other person wants to go in the same direction and will reach the target before or when the elevator stops, he will be picked up and taken here. 

## Technologies and tools used
* TypeScript
* SCSS/HTML
* Webpack

## Installation
To run the app locally on VSCode:
* Clone the repo and go to the repo folder
* Write `npm i` in the terminal
* Write `npm run serve` in the terminal
* Enter `localhost:8080 ` in the browser
