var config = {
	type:Phaser.AUTO,
	width:1280,
	height:720,
	physics: {
		default:'arcade',
		arcade: {
			gravity: {y : 0}
		}
	},
	scene: [ FlappyPlane ]
};

var game = new Phaser.Game(config);