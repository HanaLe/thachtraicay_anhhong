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
    this.load.image('arrow', 'assets/image/game/game-arrow.png');

    this.load.audio('sfx', 'assets/sound/splatter.mp3');

    this.load.image('thom', 'assets/image/game/thom.png');
    this.load.image('chanh', 'assets/image/game/chanh.png');
    this.load.image('chanhday', 'assets/image/game/chanhday.png');
    this.load.image('thachcam', 'assets/image/game/thachcam.png');
    this.load.image('thachvang', 'assets/image/game/thachvang.png');
    this.load.image('thachxanh', 'assets/image/game/thachxanh.png');

    this.load.image('thom-status', 'assets/image/game/traicay.png');
    this.load.image('chanh-status', 'assets/image/game/traicay.png');
    this.load.image('chanhday-status', 'assets/image/game/traicay.png');
    this.load.image('thachcam-status', 'assets/image/game/ngondai.png');
    this.load.image('thachvang-status', 'assets/image/game/mixtraicay.png');
    this.load.image('thachxanh-status', 'assets/image/game/ngondai.png');

    this.load.image('part-thom1', 'assets/image/game/thom1.png');
    this.load.image('part-thom2', 'assets/image/game/thom2.png');
    this.load.image('part-chanh1', 'assets/image/game/chanh1.png');
    this.load.image('part-chanh2', 'assets/image/game/chanh2.png');
    this.load.image('part-chanhday1', 'assets/image/game/chanhday1.png');
    this.load.image('part-chanhday2', 'assets/image/game/chanhday2.png');

    this.load.image('part-thachxanh1', 'assets/image/game/thachxanh1.png');
    this.load.image('part-thachxanh2', 'assets/image/game/thachxanh2.png');
    this.load.image('part-thachvang1', 'assets/image/game/thachvang1.png');
    this.load.image('part-thachvang2', 'assets/image/game/thachvang2.png');
    this.load.image('part-thachcam1', 'assets/image/game/thachcam1.png');
    this.load.image('part-thachcam2', 'assets/image/game/thachcam2.png');
   
}

var thom_objects,
    chanh_objects,
    chanhday_objects,
    thachxanh_objects,
    thachcam_objects,
    thachvang_objects,
    slashes,
    line,
    bg,
    timeLabel,
    arrow,
    points = [];	

var fireRate = 1000;
var nextFire = 0;
var counter = 0;

function create() {
    bg = game.add.image(w / 2, h / 2, 'bg');
    bg.anchor.setTo(.5, .5);
    bg.width= w;
    bg.height= h;
    
	game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 200;
	thom_objects = createGroup(12,'thom');
    chanh_objects = createGroup(12,'chanh');
    chanhday_objects = createGroup(12,'chanhday');
    thachxanh_objects = createGroup(12,'thachxanh');
    thachvang_objects = createGroup(12,'thachvang');
    thachcam_objects = createGroup(12,'thachcam');

    arrow = game.add.image(w-50, h-50, 'arrow');
    
    slashes = game.add.graphics(0, 0);

    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    timeLabel = game.add.text(w-100,0+10,'0:30',style);
    
	emitter_thom1 = game.add.emitter(0, 0, 300);
	emitter_thom1.makeParticles('part-thom1');
	emitter_thom1.gravity = 300;
    emitter_thom1.setYSpeed(-400,400);

    emitter_thom2 = game.add.emitter(0, 0, 300);
	emitter_thom2.makeParticles('part-thom2');
	emitter_thom2.gravity = 300;
    emitter_thom2.setYSpeed(-400,400);
    
    emitter_chanh1 = game.add.emitter(0, 0, 300);
	emitter_chanh1.makeParticles('part-chanh1');
	emitter_chanh1.gravity = 300;
    emitter_chanh1.setYSpeed(-400,400);

    emitter_chanh2 = game.add.emitter(0, 0, 300);
	emitter_chanh2.makeParticles('part-chanh2');
	emitter_chanh2.gravity = 300;
    emitter_chanh2.setYSpeed(-400,400);
    
    emitter_chanhday1 = game.add.emitter(0, 0, 300);
	emitter_chanhday1.makeParticles('part-chanhday1');
	emitter_chanhday1.gravity = 300;
    emitter_chanhday1.setYSpeed(-400,400);

    emitter_chanhday2 = game.add.emitter(0, 0, 300);
	emitter_chanhday2.makeParticles('part-chanhday2');
	emitter_chanhday2.gravity = 300;
    emitter_chanhday2.setYSpeed(-400,400);
    
    emitter_thachxanh1 = game.add.emitter(0, 0, 300);
	emitter_thachxanh1.makeParticles('part-thachxanh1');
	emitter_thachxanh1.gravity = 300;
    emitter_thachxanh1.setYSpeed(-400,400);
    
    emitter_thachxanh2 = game.add.emitter(0, 0, 300);
	emitter_thachxanh2.makeParticles('part-thachxanh2');
	emitter_thachxanh2.gravity = 300;
    emitter_thachxanh2.setYSpeed(-400,400);

    emitter_thachvang1 = game.add.emitter(0, 0, 300);
	emitter_thachvang1.makeParticles('part-thachvang1');
	emitter_thachvang1.gravity = 300;
    emitter_thachvang1.setYSpeed(-400,400);
    
    emitter_thachvang2 = game.add.emitter(0, 0, 300);
	emitter_thachvang2.makeParticles('part-thachvang2');
	emitter_thachvang2.gravity = 300;
    emitter_thachvang2.setYSpeed(-400,400);

    emitter_thachcam1 = game.add.emitter(0, 0, 300);
	emitter_thachcam1.makeParticles('part-thachcam1');
	emitter_thachcam1.gravity = 300;
    emitter_thachcam1.setYSpeed(-400,400);
    
    emitter_thachcam2 = game.add.emitter(0, 0, 300);
	emitter_thachcam2.makeParticles('part-thachcam2');
	emitter_thachcam2.gravity = 300;
    emitter_thachcam2.setYSpeed(-400,400);

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
        thom_objects.countDead()>0 && 
        chanh_objects.countDead()>0 &&
        chanhday_objects.countDead()>0 && 
        thachxanh_objects.countDead()>0 && 
        thachvang_objects.countDead()>0 && 
        thachcam_objects.countDead()>0 
        ) {

		nextFire = game.time.now + fireRate;
        var random = Math.floor(Math.random() * Math.floor(70));
		if (random>60 && random<70) {
			throw_obj(thom_objects);
        }else if(random>50 && random<60){
            throw_obj(chanh_objects);
        }else if(random>40 && random<50){
            throw_obj(chanhday_objects);
        }else if(random>30 && random<40){
            throw_obj(thachxanh_objects);
        }else if(random>20 && random<30){
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

        thom_objects.forEachExists(checkIntersects);
        chanh_objects.forEachExists(checkIntersects);
        chanhday_objects.forEachExists(checkIntersects);
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
            case thom_objects:
                killFruit(fruit,'thom',x,y); break;
            case chanhday_objects:
                killFruit(fruit,'chanhday',x,y); break;
            case chanh_objects:
                killFruit(fruit,'chanh',x,y); break;
            case thachxanh_objects:
                killFruit(fruit,'thachxanh',x,y); break;
            case thachvang_objects:
                killFruit(fruit,'thachvang',x,y); break;
            case thachcam_objects:
                killFruit(fruit,'thachcam',x,y); break;
            default: break;
        }
	}
}

function render() {
    
}

function killFruit(fruit,type,x,y) {
    switch(type){
        case 'thom':
            Emitter(emitter_thom1,fruit);
            Emitter(emitter_thom2,fruit);
            Tween(x,y,'thom');

        case 'chanh':
            Emitter(emitter_chanh1,fruit);
            Emitter(emitter_chanh2,fruit);
            Tween(x,y,'chanh');

            break;
        case 'chanhday':
            Emitter(emitter_chanhday1,fruit);
            Emitter(emitter_chanhday2,fruit);
            Tween(x,y,'chanhday');
            
            break;
        case 'thachxanh':
            Emitter(emitter_thachxanh1,fruit);
            Emitter(emitter_thachxanh2,fruit);
            Tween(x,y,'thachxanh');
            break;
        case 'thachvang':
            Emitter(emitter_thachvang1,fruit);
            Emitter(emitter_thachvang2,fruit);
            Tween(x,y,'thachvang');
            break;
        case 'thachcam':
            Emitter(emitter_thachcam1,fruit);
            Emitter(emitter_thachcam2,fruit);
            Tween(x,y,'thachcam');
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