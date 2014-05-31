/// <reference path="collision.ts" />


class Entity implements IEntity {
    private _id: string;
    private _name: string;
    private _moveSpeed: number; // how many level coordinates this unit can move per second.
    private _imgName: string;
    private _location: Vector;
    private _weight: number;
    private _drawingScale: number;

    constructor(id: string, name: string, imgName: string, location?: Vector, weight?: number) {
        this._id = id;
        this._name = name;
        this._moveSpeed = 125.0;
        this._imgName = imgName;
        this._location = location;
        this._weight = weight;
        this._drawingScale = 1.0;
    }

    set drawingScale(theScale: number) {
        this._drawingScale = theScale;
    }

    get drawingScale(): number {
        return this._drawingScale;
    }

    get name(): string {
        return this._name;
    }

    get id(): string {
        return this._id;
    }

    get location(): Vector {
        return this._location;
    }

    get moveSpeed(): number {
        return this._moveSpeed;
    }

    get weight(): number {
        return this._weight;
    }

    getEntityImage(): HTMLImageElement {
        return GetImage(this._imgName);
    }

    getDrawingDimensions(): Vector {
        var entityImage = this.getEntityImage();

        if (entityImage != null) {
            return new Vector(entityImage.width * this._drawingScale, entityImage.height * this._drawingScale);
        }

        return null;
    }

    //Moves this entity to the given location.  Use 'null' to clear the location.
    Place(location: Vector) {
        this._location = location;
    }

    //Draws this entity at the given location.
    Draw(cxt: CanvasRenderingContext2D, location?: Vector): void {
        if (!location) {
            location = this._location || new Vector(0, 0);
        }

        var drawDimm = this.getDrawingDimensions();

        if (drawDimm != null) {
            var bgImg = this.getEntityImage();

            if (bgImg != null)
            {
                cxt.drawImage(bgImg, location.getX(), location.getY(), drawDimm.getX(), drawDimm.getY());
            }
        }
    }

}