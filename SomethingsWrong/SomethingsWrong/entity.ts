﻿/// <reference path="collision.ts" />


class Entity implements IEntity {
    private _id: string;
    private _name: string;
    private _imgName: string;
    private _location: Vector;
    private _weight: number;

    constructor(id: string, name: string, imgName: string, location?: Vector, weight?: number) {
        this._id = id;
        this._name = name;
        this._imgName = imgName;
        this._location = location;
        this._weight = weight;
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

    get weight(): number {
        return this._weight;
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