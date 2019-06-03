let FPS = 60;
let dx = [-1, 0, 1, 0];
let dy = [0, -1, 0, 1];
let p1move = [65, 87, 68, 83]; // a w d s
let p1gun = [71, 89, 74, 72]; // g y j h
let centerX = 300,
  centerY = 300;
let Radius = 300;
let player = [0];
let bullet = [];
let grenade = [];
let reload = 500;
let GameStatus = "ready"; // ready ended playing
let timeStart = 0;
let fragCD = 12;
let smokeCD = 10;
let inf = 100000000;
let rainbowColor = [
  "rgb(148, 0, 211)",
  "rgb(75, 0, 130)",
  "rgb(0, 0, 255)",
  "rgb(0, 255, 0)",
  "rgb(255, 255, 0",
  "rgb(255, 127, 0)",
  "rgb(255, 0, 0)"
]; // from violet to red

/*
a w d s : p1 move
g y j h : p1 aim
space: p1 shoot
arrows : p2 move
mouse : p2 aim
left mouse : p2 shoot
q : p1 auto shoot
backspace: p2 auto shoot
e : p1 hold smoke, release to throw
r : p1 throw frag, ___
0 : p2 throw smoke, ___
. : p2 throw frag, ___
*/
