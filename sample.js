// sample runner
"use strict";
var canvas;
var ctx;

var image;

function init(img)
{
	console.log("sampler initialized");
	canvas = document.getElementById('gameCanvas');
	ctx = canvas.getContext('2d');
	ctx.fillStyle = "white";
	ctx.fillRect(0,0,300,300);
	
	//drawOnce();
}

function drawOnce(imgg)
{
	console.log("Drawing once");
	var width = 1; 
	var height = 1;
	

	
	var img = new Image(); img.src = "assets/sampleanimation.png";
	//console.log("worked: " + img.src);
	ctx.drawImage(img,
	/* startclip x*/0,
	/* startclip y*/100,
	/* widthclip */100,
	/* heightclip */100,
	/*x*/0,
	/*y*/0,
	/*width*/ 500,
	/*height*/ 500);
	requestAnimationFrame(drawOnce);
		
	
}

