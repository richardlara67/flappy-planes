class FlappyPlane extends Phaser.Scene {
    constructor() {
        super({key:"FlappyPlane"});
    }
    // LOADING ALL THE ASSETS 
    preload() {
        this.load.image('back', 'assets/b.png');
        this.load.image('sun', 'assets/sun.png');
        this.load.image('startButton', 'assets/startButton.png');
        this.load.image('plane', 'assets/plane2.png');
        this.load.image('grnd', 'assets/ground2.png');
        this.load.image('ring', 'assets/halfRing.png');
        this.load.image('storecoin', 'assets/storeLogoExample.png');
        this.load.image('blryCld1', 'assets/clouds/bluryCloud1.png');
        this.load.image('blryCld2', 'assets/clouds/bluryCloud2.png');
        this.load.image('blryCld3', 'assets/clouds/bluryCloud3.png');
        this.load.image('blryCld4', 'assets/clouds/bluryCloud4.png');
        this.load.image('blryCld5', 'assets/clouds/bluryCloud5.png');
        this.load.image('blryCld6', 'assets/clouds/bluryCloud6.png');
        this.load.image('cld1', 'assets/clouds/cloud1.png');
        this.load.image('cld2', 'assets/clouds/cloud2.png');
        this.load.image('cld3', 'assets/clouds/cloud3.png');
        this.load.image('cld4', 'assets/clouds/cloud4.png');
        this.load.image('cld5', 'assets/clouds/cloud5.png');
        this.load.image('cld6', 'assets/clouds/cloud6.png');
    }

    create() {
        //movement unit
        this.pixelsPerFrame = 2.5;
        
        // Backround Image
        this.bck = this.add.image(640, 360, 'back');
        this.sun = this.add.image(1200, 100, 'sun');
        //Score Setup
        this.score = 0;
        this.scoreLabel = this.add.text(640, 40, "", { font: "50px Arial", fill: "#ffffff" });
        
        //Add tiles
        this.generateArrayOfTiles();
        
    
        //Menu parameters
        this.gameOver = true;
        
        
        this.showTheStartButton();
        var veryFirstStart = true;
        //Controller Setup
        this.input.on('pointerdown', function (e) {
            if (!this.gameOver && !this.menuShown) {
                this.plane.body.velocity.y = -300;
                var tween = this.tweens.add({
                    targets: this.plane,
                    angle:  -20,
                    duration:100
                })  
            }else if (this.menuShown) {
                this.startBtn.destroy();
                this.menuShown = false;
                if (veryFirstStart) {
                    veryFirstStart = false;
                    this.generateSceneElements();
                }
                this.restartTheGame();
            }
        }, this);
    }
    
    // Called before each frame gets rendered 
    update() {
        if (!this.menuShown) {
            if (this.movementSpeed > 0.0) {
                if (!this.gameOver && this.plane.y < 25){
                    this.gameOver = true;
                    this.plane.body.velocity.y = 200;
                    this.plane.body.velocity.x = 50;
                    this.plane.setGravity(0, 0);

                }else if (!this.landing && this.plane.y > 640){
                    this.gameOver = true;
                    this.landing = true;
                    this.plane.angle = 0;
                    this.plane.body.velocity.y = 0;
                    this.plane.body.velocity.x = 0;
                    this.plane.setGravity(0, 0);

                }else if (this.landing){
                    this.movementSpeed = this.movementSpeed * 0.98;
                    if (this.movementSpeed < 0.05) {
                        // GAME OVER !!!!!!!
                        this.movementSpeed = 0.0;
                        setTimeout(this.showTheStartButton(), 1000)
                    }
                        
                    this.plane.body.velocity.x = 50 *  this.movementSpeed;
                }
                if (!this.landing && this.plane.angle < 20)
                    this.plane.angle += 0.5;
                
                // Scene elements movement
                if (this.sun.x < -30 )
                    this.sun.x = 1400
                this.sun.x -= (this.pixelsPerFrame - 2.25) * this.movementSpeed;
                
                this.tilesMovementCycle();
                this.cloudsMovementCycle();
                this.ringsMovementCycle();
            }
        }
    }
    showTheStartButton = function() {
        this.menuShown = true;
        this.startBtn = this.add.image(640, 360, 'startButton');
        this.startBtn.setOrigin(0.5, 1.0);
        this.startBtn.alpha = 0;
        let tween2 = this.tweens.add({
            targets: this.startBtn,
            alpha: {from: 0.1, to: 1.0},
            duration:5000,
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: -1,
            yoyo: true
        });
    }
    
    restartTheGame = function() {
        this.plane.setGravity(0, 650);
        this.plane.x = 250;
        this.plane.y = 300;
        //Reset game parameters
        this.gameOver = false;
        this.landing = false;
        this.movementSpeed = 1.0;
        this.scoreLabel.text = 0;
    }
    
    generateSceneElements = function() {
        //BackgroundClouds
        this.generateBackClouds();
        //firts half of rings
        this.generateFirstHalfOfRings();
        //Plane Setup
        this.generatePlane();
        //second half of rings
        this.generateSecondHalfOfRings();
        //ForegroundClouds
        this.generateForClouds();
    }
    
    generatePlane = function() {
        this.plane = this.physics.add.image(250, 300, 'plane');
    }
    
    
    // ------ Ground --------
    generateArrayOfTiles = function() {
        //Ground Setup
        let grnd1 = this.add.image(640, 699, 'grnd');
        let grnd2 = this.add.image(1920, 699, 'grnd');
        this.groundTiles = [grnd1, grnd2];
    }
    tilesMovementCycle = function () {
        for (var i = 0; i < 2; i++) {
            if (this.groundTiles[i].x < -639 )
                this.groundTiles[i].x += 2560;
            this.groundTiles[i].x -= (this.pixelsPerFrame + 1) * this.movementSpeed;
        }
    }
    
    // ------ Clouds --------
    generateForClouds = function() {
        this.foregroundCloudsArray = [];
        this.generateForegroundClouds();
    }
    generateBackClouds = function() {
        this.backgroundCloudsArray = [];
        this.generateBackgroundClouds();
    }
    generateForegroundClouds = function() {
        if (this.foregroundCloudsArray.length == 0) {
            let numberOfClouds = Phaser.Math.Between(2, 3);
            for (var i = 0; i < numberOfClouds; i++) {
                let cloud = this.add.image(1400 + (i * Phaser.Math.Between(300, 600)), Phaser.Math.Between(50, 550), 'cld'+Phaser.Math.Between(1, 6));
                cloud.alpha = 0.8;
                this.foregroundCloudsArray.push(cloud);
            }
        }
    }
    generateBackgroundClouds = function() {
        if (this.backgroundCloudsArray.length == 0) {
            let numberOfClouds = Phaser.Math.Between(2, 3);
            for (var i = 0; i < numberOfClouds; i++) {
                let cloud = this.add.image(1400 + (i * Phaser.Math.Between(500, 600)), Phaser.Math.Between(50, 550), 'blryCld'+Phaser.Math.Between(1, 6));
                cloud.alpha = 0.8;
                this.backgroundCloudsArray.push(cloud);
            }
        }
    }
    cloudsMovementCycle = function() {
        for (var i = 0; i < this.foregroundCloudsArray.length; i++) {
            let crntCloud = this.foregroundCloudsArray[i]
            if (crntCloud.x < -108) {
                crntCloud.x += 1510;
                crntCloud.y = Phaser.Math.Between(50, 550);
                crntCloud.setTexture('cld'+Phaser.Math.Between(1, 6));
            }
            crntCloud.x -= (this.pixelsPerFrame + 1) * this.movementSpeed;
        }
        for (var i = 0; i < this.backgroundCloudsArray.length; i++) {
            let crntCloud = this.backgroundCloudsArray[i]
            if (crntCloud.x < -108) {
                crntCloud.x += 1510;
                crntCloud.y = Phaser.Math.Between(50, 550);
                crntCloud.setTexture('blryCld'+Phaser.Math.Between(1, 6));
            }
            crntCloud.x -= (this.pixelsPerFrame - 1) * this.movementSpeed;
        }
    }
    
    
    
    // ------ Rings --------
    generateFirstHalfOfRings = function() {
        this.upcomingRingIndex = 0;
        this.maxNumberOfRings = 10;
        this.numberOfActiveRings = 1;
        this.halfWayRepositioned = false;
        this.firstHalfArray = [];
        this.generateRing1();
    }
    generateSecondHalfOfRings = function() {
        this.secondHalfArray = [];
        this.generateRing2();
    }
    generateRing1 = function() {
        if (this.firstHalfArray.length == 0) {
            let yPos = Phaser.Math.Between(80, 580);
            for (var i = 0; i < this.maxNumberOfRings; i++) {
                let ring = this.physics.add.image(1300 + (i * 100), yPos, 'ring');
                ring.setGravity(0, 0);
                ring.setOrigin(0.5, 0.5);
                ring.angle = 180;
                this.firstHalfArray.push(ring);
            }
        }
    }
    generateRing2 = function() {
        for (var i = 0; i < this.firstHalfArray.length; i++) {
            let crntRing = this.firstHalfArray[i];
            let ring = this.physics.add.image(crntRing.x, crntRing.y, 'ring');
            ring.setGravity(0, 0);
            this.secondHalfArray.push(ring);
        }
    }
    ringsMovementCycle = function() {
        for (var i = 0; i < this.numberOfActiveRings; i++) {
            let firstRing = this.firstHalfArray[i];
            let secondRing = this.secondHalfArray[i];
            if (firstRing.x < -20) {
                this.sendTheRingBack(firstRing, secondRing);
                i--;
            }else{
                firstRing.x -= this.pixelsPerFrame * this.movementSpeed;
                secondRing.x = firstRing.x + 13;
                if (!this.halfWayRepositioned) {
                    if (firstRing.x < 640){
                        if (this.numberOfActiveRings < this.maxNumberOfRings && Phaser.Math.Between(1, 2) == 2) {
                            this.ringRepositioning(this.numberOfActiveRings);
                            this.numberOfActiveRings = this.maxNumberOfRings;
                        }
                        this.halfWayRepositioned = true;
                    }
                }
                if (i == this.upcomingRingIndex && firstRing.x < 250){
                    // PLANE CROSSING RINGS Y COORDINATE
                    if (this.plane.y < firstRing.y + 55 && this.plane.y > firstRing.y - 55) {
                        // SCORED
                        firstRing.setGravity(0, -500);
                        secondRing.setGravity(0, -500);
                        this.score += 1;
                        this.scoreLabel.text = this.score;
                        if (this.score % 2 == 0)
                            if (this.score < 50) {
                                this.movementSpeed += 0.05;
                            }else
                                this.movementSpeed += 0.025;  
                    }else{
                        // NOT SCORED
                        firstRing.setGravity(0, 500);
                        secondRing.setGravity(0, 500);
                    }
                    if (this.upcomingRingIndex == this.maxNumberOfRings-1){
                        this.upcomingRingIndex = 0;
                    }else{
                        this.upcomingRingIndex ++;
                    }
                }
            }
        }
    }
    ringRepositioning = function(formIndex) {
        var ringsAlignemntType = 0;
        //Phaser.Math.Between(80, 580)
        if (Phaser.Math.Between(1, 2) == 2) {
            ringsAlignemntType = 1;
        }
        var yPos = Phaser.Math.Between(80, 580);
        for (var i = formIndex; i < this.maxNumberOfRings; i++){
            if (ringsAlignemntType == 1){
                if (yPos < 360)
                    yPos += 50;
                else
                    yPos -= 50;
            }
            this.firstHalfArray[i].y = yPos;
            this.firstHalfArray[i].x = 1300 + (i * 100);
            this.secondHalfArray[i].y = yPos;
        }
        this.numberOfActiveRings = Phaser.Math.Between(1, this.maxNumberOfRings);
        if (this.numberOfActiveRings == this.maxNumberOfRings){
            this.halfWayRepositioned = true;
        }
    }
    restratRingsPosition = function() {
        for (var i = 0; i < this.numberOfActiveRings; i++) {
            let firstRing = this.firstHalfArray[i];
            let secondRing = this.secondHalfArray[i];
            this.sendTheRingBack(firstRing, secondRing);
            i--;
        }        
    }
    sendTheRingBack = function (firstRing, secondRing) {
        firstRing.body.setGravity(0, 0);
        firstRing.body.velocity.y = 0;
        secondRing.body.setGravity(0, 0);
        secondRing.body.velocity.y = 0;
        if (this.numberOfActiveRings < this.firstHalfArray.length) {
            let lastRingX = this.firstHalfArray[this.firstHalfArray.length-1].x;
            firstRing.x = lastRingX + 100;
        }else{
            firstRing.x = 1300;
        }
        this.firstHalfArray.splice(this.firstHalfArray.length, 0, this.firstHalfArray[0]);
        this.firstHalfArray.shift();
        this.secondHalfArray.splice(this.secondHalfArray.length, 0, this.secondHalfArray[0]);
        this.secondHalfArray.shift();
        this.numberOfActiveRings --;
        this.upcomingRingIndex --;
        if (this.numberOfActiveRings == 0) {
            this.ringRepositioning(0);
            this.halfWayRepositioned = false;
        }
    }
    
}
/*
    4X ground
    generateArrayOfTiles = function() {
        //Ground Setup
        this.grnd1 = this.add.image(160, 670, 'grnd');
        this.grnd2 = this.add.image(480, 670, 'grnd');
        this.grnd3 = this.add.image(800, 670, 'grnd');
        this.grnd4 = this.add.image(1120, 670, 'grnd');
        this.grnd5 = this.add.image(1440, 670, 'grnd');
        this.groundTiles = [this.grnd1, this.grnd2, this.grnd3, this.grnd4, this.grnd5];
    }
    
    UPDATE
    for (var i = 0; i < 5; i++) {
                if (this.groundTiles[i].x < -158 )
                    this.groundTiles[i].x = 1438;
                else
                    this.groundTiles[i].x -= 3 * this.movementSpeed;
            }
            
            
            
            generateNewCoin = function() {
        let coin = this.physics.add.image(1400, Phaser.Math.Between(150, 550), 'storecoin');
        this.coins.push(coin);
        this.coinCount ++;
        let timedEvent = this.time.addEvent({ delay: Phaser.Math.Between(1500, 5500), callback: this.generateNewCoin, callbackScope: this, loop: false });
    }
    for (var i = 0; i < this.coinCount; i++) {
                if (this.physics.overlap(this.plane, this.coins[i])) {
                    // Call the new hit() method
                    this.coins[i].destroy();
                    this.score += 1;
                    this.scoreLabel.text = this.score;
                    //this.plane.destroy();
                    //this.restartTheGame();
                }
                else
                    this.coins[i].x -= this.pixelsPerFrame * this.movementSpeed;
                }
*/
