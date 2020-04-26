var gameStarted = false;
var playerHealth = 300;
var defaultPlayerHealth = playerHealth;
var boostedPlayerHealth = 600;
var waves = 45;
var difficultyMultiplier = 1;


var ua = navigator.userAgent.toLowerCase();
var healthAlreadyBoosted = false;
Game.playerHealth = playerHealth;
Game.defaultPlayerHealth = defaultPlayerHealth;
Game.difficultyMultiplier = difficultyMultiplier;

function keyPressEvent(e) {
	var keycode;
	if (window.event) keycode = window.event.keyCode;
	else if (e) keycode = e.which;
	var e = e || window.event;
	if (keycode == 38 || 40) {
		e.preventDefault();
	}
	if (keycode == 65 && e.ctrlKey && e.shiftKey) {
		PlayerShip.boost();
	}
}
document.onkeydown = keyPressEvent;



var sprites = {
	ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
	missile: { sx: 0, sy: 30, w: 4, h: 10, frames: 1 },
	enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
	enemy_bee: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
	enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
	enemy_circle: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
	explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
	enemy_missile: { sx: 8, sy: 42, w: 4, h: 20, frame: 1, },
	enemy_bee_final: { sx: 215, sy: 0, w: 73, h: 50, frames: 1 },
	enemy_straight_final: { sx: 287, sy: 0, w: 73, h: 65, frames: 1 },
	enemy_circle_final: { sx: 360, sy: 0, w: 70, h: 60, frames: 1 }
};

var enemies = {
	straight: {
		x: 0, y: -50, sprite: 'enemy_ship', health: 20 * difficultyMultiplier,
		E: 100
	},
	ltr: {
		x: 0, y: -100, sprite: 'enemy_purple', health: 10 * difficultyMultiplier,
		B: 75, C: 1, E: 100, missiles: 2
	},
	circle: {
		x: 250, y: -50, sprite: 'enemy_circle', health: 10 * difficultyMultiplier,
		A: 0, B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI / 2
	},
	wiggle: {
		x: 100, y: -50, sprite: 'enemy_bee', health: 20 * difficultyMultiplier,
		B: 50, C: 4, E: 100, firePercentage: 0.001, missiles: 2
	},
	step: {
		x: 0, y: -50, sprite: 'enemy_circle', health: 10 * difficultyMultiplier,
		B: 150, C: 1.2, E: 75
	},
	wiggleFinal: {
		x: 100, y: -50, sprite: 'enemy_bee_final', health: 100 * difficultyMultiplier,
		B: 50, C: 4, E: 100, firePercentage: 4, missiles: 4
	},
	straightFinal: {
		x: 0, y: -50, sprite: 'enemy_straight_final', health: 100 * difficultyMultiplier,
		E: 100, missiles: 3
	},
	circleFinal: {
		x: 0, y: -50, sprite: 'enemy_circle_final', health: 100 * difficultyMultiplier,
		A: 0, B: -100, C: 1, E: 20, F: 100, G: 1, H: Math.PI / 2, missiles: 2
	}
};



var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;

var startGame = function () {

	// Only 1 row of stars
	if (ua.match(/android/)) {
		Game.setBoard(0, new Starfield(50, 0.6, 100, true));
	} else {
		Game.setBoard(0, new Starfield(20, 0.4, 100, true));
		Game.setBoard(1, new Starfield(50, 0.6, 100));
		Game.setBoard(2, new Starfield(100, 1.0, 50));
	}
	//console.log($(window).width());
	if ($(window).width() <= 576) {
		Game.setBoard(3, new SplashScreen('images/splash-mobile.svg',
									"",
									"",
								playGame));
	}
	else
	{
		Game.setBoard(3, new SplashScreen('images/splash.svg',
									"",
									"",
								playGame));
	}
};



var movementVariantArray = ['ltr', 'circle', 'step', 'straight', 'wiggle'];
var finalMovementVariantArray = ['wiggleFinal', 'straightFinal', 'circleFinal'];
var level1 = [];
var wavesAdded = 0;
var lastLevelStartVariant = 0;
var lastLevelEndVariant = 0;
waves = waves + Math.round(waves * (difficultyMultiplier/10));
do {
	var levelStartVariant;
	if (wavesAdded === 0)
	{
		levelStartVariant = 0;
	}
	else
	{
		var levelStartVariantBase = Math.floor(Math.random() * (3000-1000+1)+1000);
		//console.log(levelStartVariantBase);
		levelStartVariant = lastLevelEndVariant + (levelStartVariantBase * (Math.floor(Math.random() * 2) == 1 ? 1 : -1));
		if (levelStartVariant <= 0)
		{
			levelStartVariant = lastLevelStartVariant;
		}
	}
	lastLevelStartVariant = levelStartVariant;
	//console.log("Start: " + levelStartVariant);


	var levelEndVariant = levelStartVariant + (Math.floor(Math.random() * (5000 - 3000 + 1) + 3000));
	lastLevelEndVariant = levelEndVariant;
	//console.log("End: " + levelEndVariant);

	var levelGapVariant;
	var levelMovementVariant;
	if (wavesAdded > waves - 4) {
		levelGapVariant = 900;
		levelMovementVariant = finalMovementVariantArray[Math.floor(Math.random() * finalMovementVariantArray.length)];
	}
	else
	{
		levelGapVariant = Math.floor(Math.random() * (800 - 400 + 1) + 400);
		levelMovementVariant = movementVariantArray[Math.floor(Math.random() * movementVariantArray.length)];
	}
	//console.log("Gap: " + levelGapVariant);
	//console.log("Movement: " + levelMovementVariant);

	var levelXPositionVariant = Math.floor(Math.random() * (400 - 10 + 1) + 10);
	//console.log("Position: " + levelXPositionVariant.toString());

	level1.push([levelStartVariant, levelEndVariant, levelGapVariant, levelMovementVariant, {x: levelXPositionVariant}]);
	wavesAdded++;
}
while (wavesAdded < waves);
//console.log(JSON.stringify(level1));


var playGame = function () {
	setTimeout(function(){
		var board = new GameBoard();
		board.add(new PlayerShip());
		board.add(new Level(level1, winGame));
		Game.playerHealth = defaultPlayerHealth;
		Game.setBoard(3, board);
		Game.setBoard(5, new GamePoints(0));
		Game.setBoard(6, new GameHealth(0));
	}, 1500);
};

var winGame = function () {
	audio.win.play();
	Game.setBoard(3, new SplashScreen('images/win.svg', "", "", playGame));
	$(document).keydown(function (e) {
		if (e.which == 32) {
			return false;
		}
	});
	difficultyMultiplier = difficultyMultiplier * 1.5;
	console.info('WIN: ' + Game.points);
};

var loseGame = function () {
	playerHealth = defaultPlayerHealth;
	audio.lose.play();
	Game.setBoard(3, new SplashScreen('images/loss.svg', "", "", playGame));
	console.info('LOSS: ' + Game.points);
};




var Starfield = function (speed, opacity, numStars, clear, color) {
	// Set up the offscreen canvas
	var stars = document.createElement("canvas");
	stars.width = Game.width;
	stars.height = Game.height;
	var starCtx = stars.getContext("2d");
	var offset = 0;

	// If the clear option is set, 
	// make the background black instead of transparent
	if (clear) {
		starCtx.fillStyle = "#000";
		starCtx.fillRect(0, 0, stars.width, stars.height);
	}

	// Now draw a bunch of random 2 pixel
	// rectangles onto the offscreen canvas
	if (color) {
		starCtx.fillStyle = color;
	}
	else
	{
		starCtx.fillStyle = "#FFF";
	}
	starCtx.globalAlpha = opacity;
	for (var i = 0; i < numStars; i++) {
		starCtx.fillRect(Math.floor(Math.random() * stars.width),
						 Math.floor(Math.random() * stars.height),
						 2,
						 2);
	}

	// This method is called every frame
	// to draw the starfield onto the canvas
	this.draw = function (ctx) {
		var intOffset = Math.floor(offset);
		var remaining = stars.height - intOffset;

		// Draw the top half of the starfield
		if (intOffset > 0) {
			ctx.drawImage(stars,
					  0, remaining,
					  stars.width, intOffset,
					  0, 0,
					  stars.width, intOffset);
		}

		// Draw the bottom half of the starfield
		if (remaining > 0) {
			ctx.drawImage(stars,
					0, 0,
					stars.width, remaining,
					0, intOffset,
					stars.width, remaining);
		}
	};

	// This method is called to update
	// the starfield
	this.step = function (dt) {
		offset += dt * speed;
		offset = offset % stars.height;
	};
};

var PlayerShip = function () {
	this.setup('ship', { vx: 0, reloadTime: 0.25, maxVel: 200 });

	this.reload = this.reloadTime;
	this.x = Game.width / 2 - this.w / 2;
	this.y = Game.height - Game.playerOffset - this.h;

	this.step = function (dt) {
		if (Game.keys['left']) { this.vx = -this.maxVel; }
		else if (Game.keys['right']) { this.vx = this.maxVel; }
		else { this.vx = 0; }

		this.x += this.vx * dt;

		if (this.x < 0) { this.x = 0; }
		else if (this.x > Game.width - this.w) {
			this.x = Game.width - this.w;
		}

		this.reload -= dt;
		if (Game.keys['fire'] && this.reload < 0) {
			Game.keys['fire'] = false;
			this.reload = this.reloadTime;
			audio.fire.play();
			this.board.add(new PlayerMissile(this.x, this.y + this.h / 2));
			this.board.add(new PlayerMissile(this.x + this.w, this.y + this.h / 2));
		}
	};
};

PlayerShip.boost = function () {
	//console.log("Boost!");
	if (healthAlreadyBoosted == false) {
		audio.power.play();
		playerHealth = boostedPlayerHealth;
		healthAlreadyBoosted = true;
		Game.playerHealth = playerHealth;
		//console.log("I feel better already!");
		if (ua.match(/android/)) {
			Game.setBoard(0, new Starfield(100, 0.6, 100, true, "#00A9E0"));
		} else {
			Game.setBoard(0, new Starfield(60, 0.4, 100, true));
			Game.setBoard(1, new Starfield(150, 0.6, 100));
			Game.setBoard(2, new Starfield(300, 0.8, 50, false, "#00A9E0"));
			var checkHealth = setInterval(function () {
				//console.log("Checking vitals...");
				if (playerHealth < defaultPlayerHealth)
				{
					Game.setBoard(0, new Starfield(20, 0.4, 100, true));
					Game.setBoard(1, new Starfield(50, 0.6, 100));
					Game.setBoard(2, new Starfield(150, 0.8, 50, false, "#FFFFFF"));
					clearInterval(checkHealth);
				}
			}, 3000);
		}
	}
	
}

PlayerShip.prototype = new Sprite();
PlayerShip.prototype.type = OBJECT_PLAYER;

PlayerShip.prototype.hit = function (damage) {
	if (isNaN(damage) == false) {
		playerHealth = playerHealth - damage;
		//console.log("OUCH!  {Health: " + playerHealth + ", Score " + $('#Score').val() + "}");
		audio.hit.play();
		Game.playerHealth = playerHealth;
	}
	if (playerHealth <= 0) {
		//console.log("I CAN'T TAKE ANYMORE... {Health: " + playerHealth + ", Score " + $('#Score').val() + "}");
		loseGame();
	}
};



var PlayerMissile = function (x, y) {
	this.setup('missile', { vy: -700, damage: 10 });
	this.x = x - this.w / 2;
	this.y = y - this.h;
};

PlayerMissile.prototype = new Sprite();
PlayerMissile.prototype.type = OBJECT_PLAYER_PROJECTILE;

PlayerMissile.prototype.step = function (dt) {
	this.y += this.vy * dt;
	var collision = this.board.collide(this, OBJECT_ENEMY);
	if (collision) {
		collision.hit(this.damage);
		this.board.remove(this);
	} else if (this.y < -this.h) {
		this.board.remove(this);
	}
};


var Enemy = function (blueprint, override) {
	this.merge(this.baseParameters);
	this.setup(blueprint.sprite, blueprint);
	this.merge(override);
};

Enemy.prototype = new Sprite();
Enemy.prototype.type = OBJECT_ENEMY;

Enemy.prototype.baseParameters = {
	A: 0, B: 0, C: 0, D: 0,
	E: 0, F: 0, G: 0, H: 0,
	t: 0, reloadTime: 0.75,
	reload: 0
};

Enemy.prototype.step = function (dt) {
	this.t += dt;

	this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
	this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);

	this.x += this.vx * dt;
	this.y += this.vy * dt;

	var collision = this.board.collide(this, OBJECT_PLAYER);

	if (this.misssles == 4) {
		audio.boss.play();
	}

	if (collision) {
		collision.hit(this.damage);
		this.board.remove(this);
	}

	if (Math.random() < 0.01 && this.reload <= 0) {
		this.reload = this.reloadTime;
		if (this.missiles == 2) {
			this.board.add(new EnemyMissile(this.x + this.w - 2, this.y + this.h));
			this.board.add(new EnemyMissile(this.x + 2, this.y + this.h));
		} else {
			this.board.add(new EnemyMissile(this.x + this.w / 2, this.y + this.h));
		}

	}
	this.reload -= dt;

	if (this.y > Game.height ||
	   this.x < -this.w ||
	   this.x > Game.width) {
		this.board.remove(this);
	}
};

Enemy.prototype.hit = function (damage) {
	this.health -= damage;
	if (this.health <= 0) {
		if (this.board.remove(this)) {
			Game.points += this.points || 100;
			this.board.add(new Explosion(this.x + this.w / 2, this.y + this.h / 2));
			audio.boom.play();
		}
	}
};

var EnemyMissile = function (x, y) {
	this.setup('enemy_missile', { vy: 200, damage: 10 });
	this.x = x - this.w / 2;
	this.y = y;
};

EnemyMissile.prototype = new Sprite();
EnemyMissile.prototype.type = OBJECT_ENEMY_PROJECTILE;

EnemyMissile.prototype.step = function (dt) {
	this.y += this.vy * dt;
	var collision = this.board.collide(this, OBJECT_PLAYER)
	if (collision) {
		collision.hit(this.damage);
		this.board.remove(this);
	} else if (this.y > Game.height) {
		this.board.remove(this);
	}
};



var Explosion = function (centerX, centerY) {
	this.setup('explosion', { frame: 0 });
	this.x = centerX - this.w / 2;
	this.y = centerY - this.h / 2;
};

Explosion.prototype = new Sprite();

Explosion.prototype.step = function (dt) {
	this.frame++;
	if (this.frame >= 12) {
		this.board.remove(this);
	}
};


$(document).ready(function() {
	$('#game').click(function() {
		if (gameStarted == false) 
		{
			gameStarted = true;
			audio.start.play();
		}
	});
});

document.addEventListener('touchstart', function(e) {
	if (gameStarted == false) 
	{
		gameStarted = true;
		audio.start.play();
	}
}, false);

window.addEventListener("load", function () {
	Game.initialize("game", sprites, startGame);
});


