let ready = false;
let display = false;
let car;
let grid;
let frontSensor;
let sideSensor;

let gridDimensions;
let gridSize;

function init() {
	if (display)
		return;

	createCanvas(gridDimensions * gridSize, gridDimensions * gridSize);
}

function setup() {
	setupSocket();
}

function draw() {
	if (!display)
		return;

	background(220);
}