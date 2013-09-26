// The game
function Game (mainCanvas) {
	this.gameLoop = false;
	this.cycleIntervalTime = 10;
	this.mainCanvas = mainCanvas;
	this.drawingContext = mainCanvas.getContext('2d');
	this.loading = false;
}

Game.prototype.reset = function () {
	this.paused = false;
	this.start();
};

Game.prototype.start = function () {
	this.gameLoop = setInterval(this.cycle, this.cycleIntervalTime);
	this.paused = false;
	console.log('Game has now started');
};

Game.prototype.pause = function () {
	if (this.gameLoop && !this.paused) {
		console.log('Game has been paused');
		this.paused = true;
		clearInterval(this.gameLoop);
	}
};

Game.prototype.cycle = function () {
	// First we clear the canvas by setting the width to the width
	this.mainCanvas .width = this.mainCanvas.width;
};

Game.prototype.storeLoadedImage = function (key, image) {
	if (!this.images) {
		this.images = {};
	}

	this.images[key] = image;
};

Game.prototype.getLoadedImage = function (key) {
	if (this.images[key]) {
		return this.images[key];
	}
};

Game.prototype.loadImages = function (sources, next) {
	var loaded = 0;
	var images = {};

	function finish () {
		loaded += 1;
		if (loaded === sources.length) {
			next(images);
		}
	}

	this.loading = true;

	sources.each(function (src) {
		var im = new Image();
		im.onload = finish;
		im.src = src;
		this.storeLoadedImage(src, im);
	});
};

var mainCanvas = document.getElementById('game-canvas');
var game = new Game(mainCanvas);
game.start();