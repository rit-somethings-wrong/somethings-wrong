/// <reference path="inventory.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
//-- movement states
var AnimationType;
(function (AnimationType) {
    AnimationType[AnimationType["IDLE"] = 0] = "IDLE";
    AnimationType[AnimationType["WALKLEFT"] = 1] = "WALKLEFT";
    AnimationType[AnimationType["WALKRIGHT"] = 2] = "WALKRIGHT";
})(AnimationType || (AnimationType = {}));
;

var Player = (function (_super) {
    __extends(Player, _super);
    function Player(id, name, imgUrl) {
        _super.call(this, id, name, imgUrl);
        this.animationFrame = 0;
        this.animationCounter = 0;
        this.animationCounterMax = 10;
        this.animationType = 0 /* IDLE */;
        this.spriteWidth = 32;
        this.spriteHeight = 44;

        this.spriteImg = GetImage(imgUrl);

        this.imgWidth = this.spriteWidth * 3; // for testing
        this.imgHeight = this.spriteHeight * 3; // for testing

        this._inventory = new Inventory();
    }
    //Gets the inventory of this player
    Player.prototype.GetInventory = function () {
        return this._inventory;
    };

    Player.prototype.Pickup = function (id, fromInv) {
        if (fromInv === null || id === null) {
            return false;
        } else if (!fromInv.Has(id)) {
            return false;
        }

        //attempt to add the item to the player
        var entity = fromInv.GetItem(id);
        var added = this._inventory.AddItem(entity);
        if (!added) {
            return false;
        }

        //don't forget the other store no longer has the item
        fromInv.RemoveItem(id);
        return true;
    };



    Object.defineProperty(Player.prototype, "imageWidth", {
        get: function () {
            return this.imgWidth;
        },
        set: function (newWidth) {
            this.imgWidth = newWidth;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Player.prototype, "imageHeight", {
        get: function () {
            return this.imgHeight;
        },
        set: function (newHeight) {
            this.imgHeight = newHeight;
        },
        enumerable: true,
        configurable: true
    });

    Player.prototype.UseAnyItem = function () {
        var playerInventory = this.GetInventory();
    };

    //Draws this player at the given screen location
    Player.prototype.Draw = function (context, location) {
        if (!this.spriteImg) {
            //console.log("Player has no sprintImg, so can't draw it.", this);
            return;
        }

        if (!location) {
            location = this.location || new Vector(0, 0);
        }

        //console.log(this.spriteImg, this, "sprintImg");
        if (this.animationType === 0 /* IDLE */) {
            //Draw the idling animation in the appropriate direction http://www.w3schools.com/tags/canvas_drawimage.asp
            context.drawImage(this.spriteImg, 0 + (this.animationFrame * this.spriteWidth), 0, this.spriteWidth, this.spriteHeight, location.getX() - (.5 * this.imgWidth), location.getY() - (.8 * this.imgHeight), this.imgWidth, this.imgHeight);
        } else if (this.animationType === 1 /* WALKLEFT */) {
            context.drawImage(this.spriteImg, 0 + (this.animationFrame * this.spriteWidth), 0 + (this.spriteWidth * 1), this.spriteWidth, this.spriteHeight, location.getX() - (.5 * this.imgWidth), location.getY() - (.8 * this.imgHeight), this.imgWidth, this.imgHeight);
        } else if (this.animationType === 2 /* WALKRIGHT */) {
            context.drawImage(this.spriteImg, 0 + (this.animationFrame * this.spriteWidth), 0 + (this.spriteWidth * 2), this.spriteWidth, this.spriteHeight, location.getX() - (.5 * this.imgWidth), location.getY() - (.8 * this.imgHeight), this.imgWidth, this.imgHeight);
            //TODO
        } else {
            //TODO handle error
            console.log("Error with character animation states");
        }

        /* Increment animationCounter, which will trigger a change of animationFrame upon reaching animationCounterMax */
        this.animationCounter++;
        if (this.animationCounter > this.animationCounterMax) {
            // Increment animation frame and reset counter
            this.animationFrame++;
            if (this.animationFrame >= 3) {
                this.animationFrame = 0;
            }
            this.animationCounter = 0;
        }
    };
    return Player;
})(Entity);
//# sourceMappingURL=player.js.map
