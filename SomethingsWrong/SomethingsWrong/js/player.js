"use strict";

game = game || {};

game.player = {

//-- movement states

this.ANIMATION_WALKLEFT = 0,
this.ANIMATION_WALK_RIGHT = 1,
this.ANIMATION_IDLE = 2,


this._inventory: 0,

this.animationFrame:  0,
this.animationCounter:  0,
this.animationCounterMax: 10, // so that animation doesn't move too fast

this.animationType: 0,

this.spriteWidth : 32, // for testchar
this.spriteHeight :  44, // for testchar 

this.imgWidth : 0,
this.imgHeight : 0, // these should scale off of the canvas/scene (actual drawing size in pixels)

this.spriteImg : 0;

this._id: "",
this._name: "",
this._moveSpeed: 2, // how many level coordinates this unit can move per second.
this._imgName: string,
this._location: {x: 0, y: 0},
this._weight : 0,

	this.init : function(id /*string*/, name /*string*/, imgUrl /*string*/) 
	{
			super(id, name, imgUrl);
			
			this._id = id;
			this._name = name;
			this._imgName = imgName;
    
			this.spriteImg = GetImage(imgUrl);
			
			this.imgWidth = this.spriteWidth * 3; // for testing
			this.imgHeight = this.spriteHeight * 3; // for testing
			
			this._inventory = new Inventory();
	},

    //Gets the inventory of this player
    this.GetInventory : function(){
        return this._inventory;
    },

    this.Pickup : function(id /*string*/, fromInv /*bool*/) 
	{
        if (fromInv === null || id === null) {
            return false;
        } else if (!fromInv.Has(id)) {
            return false;
        }
		
        //attempt to add the item to the player
        var entity = fromInv.GetItem(id);
        var added: boolean = this._inventory.AddItem(entity);
        if (!added) {
            return false;
        }
        //don't forget the other store no longer has the item
        fromInv.RemoveItem(id);
        return true;
    },

    this.SetImageWidth : function(newWidth /*number*/) 
	{
        this.imgWidth = newWidth;
    },

    this.SetImageHeight :function(newHeight/*number*/) 
	{
        this.imgHeight = newHeight;
    },

    this.GetImageWidth : function()
	{
        return this.imgWidth;
    },

    this.GetImageHeight : function()
	{
        return this.imgHeight;
    },
    
    
    //Draws this player at the given screen location
    this.Draw : function(context /* of the canvas*/, location /*vector obj*/)
	{
        if (!this.spriteImg) {
            //console.log("Player has no sprintImg, so can't draw it.", this);
            return;
        }

        if (!location) {
            location = this.location || {x:0,y:0};
        }

        //console.log(this.spriteImg, this, "sprintImg");
        if (this.animationType === this.ANIMATION_IDLE) 
		{
        
            //Draw the idling animation in the appropriate direction http://www.w3schools.com/tags/canvas_drawimage.asp
            
            context.drawImage(
			this.spriteImg, 
            0 + (this.animationFrame * this.spriteWidth), /* width to start clipping for current idling frame */
            0 , /* height to start clipping for idle */
            this.spriteWidth,
            this.spriteHeight,
            location.getX() - (.5 * this.imgWidth),
            location.getY() - (.8 * this.imgHeight),
            this.imgWidth, /* stretch or reduce */
            this.imgHeight /* stretch or reduce */
            );
            
        } 
		else if (this.animationType === this.ANIMATION_WALKLEFT) {
            context.drawImage(this.spriteImg, 
            0 + (this.animationFrame * this.spriteWidth), /* width to start clipping for current idling frame */
            0 + (this.spriteWidth *1) , /* height to start clipping for walkleft */
            this.spriteWidth,
            this.spriteHeight,
            location.getX() - (.5 * this.imgWidth),
            location.getY() - (.8 * this.imgHeight),
            this.imgWidth, /* stretch or reduce */
            this.imgHeight /* stretch or reduce */
            );
        } 
		else if (this.animationType === this.ANIMATION_WALKRIGHT) {
        
            context.drawImage(
			this.spriteImg, 
            0 + (this.animationFrame * this.spriteWidth), /* width to start clipping for current idling frame */
            0 + (this.spriteWidth *2) , /* height to start clipping for walkleft */
            this.spriteWidth,
            this.spriteHeight,
            location.getX() - (.5 * this.imgWidth),
            location.getY() - (.8 * this.imgHeight),
            this.imgWidth, /* stretch or reduce */
            this.imgHeight /* stretch or reduce */
            );

        } 
		else {
            //TODO handle error
            console.log("Error with character animation states");	}
        
        /* Increment animationCounter, which will trigger a change of animationFrame upon reaching animationCounterMax */
        this.animationCounter++;
        if(this.animationCounter > this.animationCounterMax)
		{
            // Increment animation frame and reset counter
            this.animationFrame++; if(this.animationFrame >= 3){ this.animationFrame = 0; } // assumes everything has 4 frames of animation
            this.animationCounter = 0;
        }
    }


};