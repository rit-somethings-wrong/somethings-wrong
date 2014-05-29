/// <reference path="entity.ts" />


interface IStorable extends IEntity {
    weight: number;

    Pickup(): void;
}

//Represents a generic item in the game
class Item extends Entity implements IStorable {
    private _weight: number;

    constructor(id: number, name: string, weight: number) {
        super(id, name);
        this._weight = weight;
    }

    get weight(): number {
        return this._weight;
    }

    //Clear this entity's location data
    Pickup(): void {
        this.Place(null);
    }

}