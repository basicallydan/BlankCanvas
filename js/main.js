// The game
function Game (mainCanvas) {
	this.gameLoop = false;
	this.cycleIntervalTime = 10;
	this.mainCanvas = mainCanvas;
	this.drawingContext = mainCanvas.getContext('2d');
	this.loading = [];
	this.images = {};
	this.sounds = {};
	this.currentAudioSource = '';
	this.eventListeners = {};
}

Game.prototype.on = function (eventName, cb) {
	if (this.eventListeners[eventName]) {
		this.eventListeners[eventName].push(cb);
	} else {
		this.eventListeners[eventName] = [ cb ];
	}
};

Game.prototype.trigger = function () {
	var args = Array.prototype.slice.call(arguments);
	var eventName;
	if (args[0]) {
		eventName = args[0];
	}
	if (this.eventListeners[eventName] && this.eventListeners[eventName].length) {
		for (var i = this.eventListeners[eventName].length - 1; i >= 0; i--) {
			this.eventListeners[eventName][i].apply(this||window, args.slice(1, arguments.length));
		}
	}
};

Game.prototype.reset = function () {
	this.paused = false;
	this.start();
};

Game.prototype.startAsyncLoadingStep = function (stepName) {
	this.loading.push(stepName);
};

Game.prototype.finishAsyncLoadingStep = function (stepName) {
	this.loading.remove(stepName);
	if (this.loading.length === 0) {
		console.log('Finished all the loading');
		this.trigger('loadComplete', 1);
	}
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
			console.log('Finished loading images.');
			this.finishAsyncLoadingStep('images');
			if (next) {
				next(images);
			}
		}
	}

	console.log('Loading ' + sources.length + ' images.');
	this.startAsyncLoadingStep('images');

	sources.forEach(function (src) {
		var im = new Image();
		im.onload = finish;
		im.src = src;
		this.storeLoadedImage(src, im);
	}, this);
};

Game.prototype.storeLoadedAudio = function (key, sound) {
	this.sounds[key] = sound;
};

Game.prototype.getLoadedAudio = function (key) {
	if (key && this.sounds[key]) {
		return this.sounds[key];
	}
};

Game.prototype.loadAudio = function (sources, next) {
	var loaded = 0;
	var sounds = {};

	function finish () {
		loaded += 1;
		if (loaded === sources.length) {
			console.log('Finished loading audio.');
			this.finishAsyncLoadingStep('audio');
			if (next) {
				next(sounds);
			}
		}
	}

	console.log('Loading ' + sources.length + ' sounds.');

	sources.forEach(function (src) {
		var au = new Audio();
		var g = this;
		au.addEventListener('canplaythrough', function () { finish.apply(game); }, false);
		au.preload = 'auto';
		au.src = src;
		this.storeLoadedAudio(src, au);
	}, this);
};

Game.prototype.playAudio = function (sourceName) {
	if (this.currentAudioSource) {
		this.sounds[sourceName].play();
		this.currentAudioSource = sourceName;
	} else {
		this.sounds[sourceName].play();
		this.currentAudioSource = sourceName;
	}
};

Game.prototype.pauseAudio = function () {
	if (this.currentAudioSource) {
		this.sounds[this.currentAudioSource].pause();
	}
};

var mainCanvas = document.getElementById('game-canvas');
var game = new Game(mainCanvas);
game.loadAudio(['audio/waves-of-diamond_fatkidwithajetpack.mp3']);
game.on('loadComplete', function (a) {
	game.start();
	game.playAudio('audio/waves-of-diamond_fatkidwithajetpack.mp3');
});