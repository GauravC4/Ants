var scrW ;
var scrH ;
var maxfit = 0;
var life = 350;
var population = 15;
var count = 0;
var target ;
var obstacle;
var obW = 120;
var targetr = 35;
var ant_size = 15;
var mutation = 0.015;
var maxForce = 1;
var ants = [];
var matingPool = [];


function setup(){
	createCanvas(600,400);
	scrW = width;
	scrH = height;
	target = createVector(width/2,50);
	obstacle = createVector(width/2,height/2);
	for(var i=0;i<population;i++){
			ants[i] = new Ant();
		}
}

function draw(){
	background(0);
	fill(255,200);
	ellipse(target.x,target.y,targetr,targetr);
	rectMode(CENTER);
	rect(obstacle.x,obstacle.y,obW,10);
	fill(255,150);
	noStroke();
	mainLoop();
}

function mainLoop(){
	for(var i=0;i<population;i++){
			ants[i].checkBound();
		if(!ants[i].success && !ants[i].destroyed)
			ants[i].move();
		ants[i].show();
	}
	count++;
	if(count>=life){
		matingPool = [];
		for(i=0;i<population;i++)
				ants[i].calcFitness();
		normFit();
		fillPool();
		for(i=0;i<population;i++)
		 		ants[i] = new Ant(breed());
		for(i=0;i<population;i++)
		 		ants[i].mutate();
				
		count = 0;
	}
}

function normFit(){
	maxfit = 0;
	var sum=0;
	for(var i=0;i<population;i++){
		 	if(ants[i].fit>maxfit)
				maxfit = ants[i].fit;
		sum += ants[i].fit;
	}
	for(i=0;i<population;i++){
		 	ants[i].prob = ants[i].fit/sum;
	}
}

function fillPool(){
	for(var i=0;i<population;i++){
		var n = floor(ants[i].prob*100);
		for(var j=0;j<n;j++)
			matingPool.push(ants[i].genes);
	}
}

function mousePressed(){
	obstacle.x = mouseX;
	obstacle.y = mouseY;
}

function breed(){
	var child = [];
	var p1 = matingPool[floor(random(matingPool.length))];
	var p2 = matingPool[floor(random(matingPool.length))];
	var n = floor(random(life));
	for(var i=0;i<life;i++){
			 if(i<n)
			 	child[i] = p1[i];
			 else
			 	child[i] = p2[i];
		}
	return(child);
}

function Ant(genes){
	this.vel = createVector();
	this.acc = createVector();
	this.fit = 0;
	this.prob = 0;
	this.success = false;
	this.destroyed = false;
	this.genes = [];
	this.pos = createVector(scrW/2,scrH-50);

	if(!genes){
		for(var i=0;i<life;i++)
			this.genes[i] =p5.Vector.random2D().limit(maxForce);
	}
	else
		this.genes = genes;

	this.move = function(){
		this.acc.add(this.genes[count])
		this.vel.add(this.acc).limit(4);
    this.pos.add(this.vel);
		this.acc.mult(0);
	}
	
	this.show = function(){
		ellipse(this.pos.x,this.pos.y,ant_size,ant_size);
	};
	
	this.checkBound = function(){
		
		if(this.pos.x<0 || this.pos.x>scrW || this.pos.y<0 || this.pos.y>scrH ||
			 this.pos.y<obstacle.y+5 && this.pos.y>obstacle.y-5 && this.pos.x>obstacle.x-floor(obW/2)&&this.pos.x<obstacle.x+floor(obW/2)){
			this.destroyed = true;
		}
		if(dist(this.pos.x,this.pos.y,target.x,target.y)<20){
			this.success = true;
		}
				
	};
	
	
this.calcFitness = function(){
	var d = dist(this.pos.x,this.pos.y,target.x,target.y);
	this.fit = pow(1/d,2);
	
 	if(this.success)
 		this.fit *= 10;
	
 	if(this.destroyed)
 		this.fit /= 10;
	};

this.mutate = function(){
	for(var i=0;i<life;i++){
		if(random(1)<mutation)
		{
			this.genes[i] = p5.Vector.random2D();
		}
	}	
};

}
