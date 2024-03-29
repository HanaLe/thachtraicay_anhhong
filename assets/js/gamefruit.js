var w = window.innerWidth,
    h = window.innerHeight;
var timer = 30;



var game = new Phaser.Game(w, h, Phaser.AUTO, 'game-fruit',
        {   preload: preload, 
            create: create,
            update: update, 
            render: render ,
            parent: 'slice-fruit'
        });

function preload() {

    this.load.image('bg', 'assets/image/game/bg.jpg');
    this.load.image('button', 'assets/image/game/button.png');
    this.load.image('logo', 'assets/image/logo.png');
    this.load.image('arrow', 'assets/image/game/game-arrow.png');

    this.load.audio('sfx', 'assets/sound/splatter.mp3');

    this.load.image('thachcam', 'assets/image/game/thachcam.png');
    this.load.image('thachvang', 'assets/image/game/thachvang.png');
    this.load.image('thachxanh', 'assets/image/game/thachxanh.png');

    this.load.image('thom-status', 'assets/image/game/ngondai.png');
    this.load.image('chanh-status', 'assets/image/game/mixtraicay.png');
    this.load.image('chanhday-status', 'assets/image/game/traicay.png');

    this.load.image('part-thom', 'assets/image/game/thom.png');
    this.load.image('part-chanh', 'assets/image/game/chanh.png');
    this.load.image('part-chanhday', 'assets/image/game/chanhday.png');
   
}

var
    thachxanh_objects,
    thachcam_objects,
    thachvang_objects,
    button,
    slashes,
    line,
    bg,
    style,
    logo,
    timeLabel,
    arrow,
    button,
    points = [];	

var fireRate = 1000;
var nextFire = 0;

function create() {
    bg = game.add.image(w / 2, h / 2, 'bg');
    bg.anchor.setTo(.5, .5);
    bg.width= w;
    bg.height= h;

    if(w<768){
        logo = game.add.image(w / 2,30, 'logo');
    }else{
        logo = game.add.image(w / 2,30, 'logo');
        logo.width= 270;
        logo.height= 124;
    }
    logo.anchor.setTo(.5, 0);

    if(w<768){
        button = game.add.button(w / 2,h-50, 'button', actionOnClick);
        button.width= 100;
        button.height= 36;
    }else{
        button = game.add.button(w / 2,h-100, 'button', actionOnClick);
    }
    button.anchor.setTo(.5, .5);

    
	game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 200;
    thachxanh_objects = createGroup(6,'thachxanh');
    thachvang_objects = createGroup(6,'thachvang');
    thachcam_objects = createGroup(6,'thachcam');

    arrow = game.add.image(w-50, h-50, 'arrow');
    
    slashes = game.add.graphics(0, 0);

    if(w<768){
        style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" }
        timeLabel = game.add.text(w-80,0+10,'0:30',style)
    }else{
        style = { font: "bold 64px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" }
        timeLabel = game.add.text(w-160,0+10,'0:30',style)
    }

	emitter_thom = game.add.emitter(0, 0, 300);
	emitter_thom.makeParticles('part-thom');
	emitter_thom.gravity = 300;
    emitter_thom.setYSpeed(-400,400);
    
    emitter_chanh = game.add.emitter(0, 0, 300);
	emitter_chanh.makeParticles('part-chanh');
	emitter_chanh.gravity = 300;
    emitter_chanh.setYSpeed(-400,400);

    emitter_chanhday = game.add.emitter(0, 0, 300);
	emitter_chanhday.makeParticles('part-chanhday');
	emitter_chanhday.gravity = 300;
    emitter_chanhday.setYSpeed(-400,400);

    game.time.events.loop(Phaser.Timer.SECOND, updateTimer, this);
}

function createGroup (numItems, sprite) {
	var group = game.add.group();
	group.enableBody = true;
	group.physicsBodyType = Phaser.Physics.ARCADE;
	group.createMultiple(numItems, sprite);
	group.setAll('checkWorldBounds', true);
	group.setAll('outOfBoundsKill', true);
	return group;
}

function throwObject() {
    if (
        game.time.now > nextFire && 
        thachxanh_objects.countDead()>0 && 
        thachvang_objects.countDead()>0 && 
        thachcam_objects.countDead()>0 
        ) {
        setTimeout(function(){
            if(fireRate>200){
                fireRate = fireRate - 100
            }
        },1000)
		nextFire = game.time.now + fireRate;
        var random = Math.floor(Math.random() * Math.floor(30));
		if (random>20 && random<30) {
            throw_obj(thachxanh_objects);
            
        }else if(random>10 && random<20){
            throw_obj(thachvang_objects);
        }else{
            throw_obj(thachcam_objects);
        }
        
	}
}

var health;

function updateTimer() {
    var time = --timer;
    (time>=10)?
        timeLabel.text = '0:'+ time:
    (time<10&&time>0)?
        timeLabel.text = '0:0'+ time : timeLabel.text = '0:00'

    if( time == 0){
        gameOver()
    }
}

function throw_obj(item){
    var obj = item.getFirstDead();
	obj.reset(game.world.centerX + Math.random()*100-Math.random()*10,h);
	obj.anchor.setTo(1, 1);
	obj.body.angularAcceleration = 100;
	game.physics.arcade.moveToXY(obj, game.world.centerX + Math.random()*100-Math.random()*10, game.world.centerY + Math.random()*100-Math.random()*10, 700);
}
function update() {
    if(timer>0){
        throwObject();
    }
	points.push({
		x: game.input.x,
		y: game.input.y
    });
    
	points = points.splice(points.length-10, points.length);
	// game.add.sprite(game.input.x, game.input.y, 'hit');

	if (points.length<1 || points[0].x==0) {
		return;
	}

	slashes.clear();
	slashes.beginFill(0xFFFFFF);
	slashes.alpha = .5;
	slashes.moveTo(points[0].x, points[0].y);
	for (var i=1; i<points.length; i++) {
		slashes.lineTo(points[i].x, points[i].y);
	} 
	slashes.endFill();

	for(var i = 1; i< points.length; i++) {
		line = new Phaser.Line(points[i].x, points[i].y, points[i-1].x, points[i-1].y);
		game.debug.geom(line);

        thachxanh_objects.forEachExists(checkIntersects);
        thachcam_objects.forEachExists(checkIntersects);
        thachvang_objects.forEachExists(checkIntersects);
	}
}

var contactPoint = new Phaser.Point(0,0);

var x,y;

function checkIntersects(fruit, callback) {
	var l1 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom);
	var l2 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom, fruit.body.right, fruit.body.bottom-fruit.height);
	l2.angle = 90;

	if(Phaser.Line.intersects(line, l1, true) ||
		 Phaser.Line.intersects(line, l2, true)) {

		contactPoint.x = game.input.x;
		contactPoint.y = game.input.y;
		var distance = Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y));
		if (Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y)) > 110) {
			return;
        }
        x = contactPoint.x;
        y = contactPoint.y;

        game.add.audio('sfx').play();
        switch(fruit.parent){
            case thachxanh_objects:
                killFruit(fruit,'chanh',x,y); break;
            case thachvang_objects:
                killFruit(fruit,'thom',x,y); break;
            case thachcam_objects:
                killFruit(fruit,'chanhday',x,y); break;
            default: break;
        }
	}
}

function render() {
    
}

function killFruit(fruit,type,x,y) {
    var status = ["thom","chanh","chanhday"];
    var value =  status[Math.floor(Math.random()*status.length)];
    switch(type){
        case 'thom':
            Emitter(emitter_thom,fruit);
            Emitter(emitter_thom,fruit);
            Tween(x,y,value);
            break;

        case 'chanh':
            Emitter(emitter_chanh,fruit);
            Emitter(emitter_chanh,fruit);
            Tween(x,y,value);
            break;

        case 'chanhday':
            Emitter(emitter_chanhday,fruit);
            Emitter(emitter_chanhday,fruit);
            Tween(x,y,value);
            break;

        default: break;
    }
	fruit.kill();
    points = [];
}

function Tween(x,y,image){
    var game_arrow = game.add.image(x-100,y-63,'arrow');
    game.add.tween(game_arrow).to( { alpha: 0 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);

    var game_status;
    var image_status = image+'-status'
    game_status = game.add.image(x-80,y-80,image_status);
    game.add.tween(game_status).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
}

function Emitter(item,fruit){
    item.x = fruit.x;
    item.y = fruit.y;
    item.start(true, 2000, null, 1);
}

function gameOver(){
    alert('game over')
}
function actionOnClick(){
    alert('skip game')
}