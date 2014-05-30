/// <reference path="collision.ts" />


class Entity implements IEntity {
    private _location: Vector;
    private _name: string;
    private _id: number;

    constructor(id: number, name: string) {
        this._id = id;
        this._name = name;
        this._location = null;
    }

    get name(): string {
        return this._name;
    }

    get id(): number {
        return this._id;
    }

    get location(): Vector {
        return this._location;
    }

    //Moves this entity to the given location.  Use 'null' to clear the location.
    Place(location: Vector) {
        this._location = location;
    }

    //Draws this entity at the given location.
    Draw(cxt: CanvasRenderingContext2D, location?: Vector): void {
        //TODO draw this entity at the given location.  Note: We're not using our this._location because we might be getting drawn on an overlay or in a list.
    }

}