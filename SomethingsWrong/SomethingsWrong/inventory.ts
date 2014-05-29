/// <reference path="item.ts" />


// Inventory


//Helper function
//Returns true if the given list contains the given object, else false
function contains(list, obj): boolean {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] == obj) {
            return true;
        }
    }
    return false;
}


interface IInventory {
    GetAllItems(): IStorable[];
    Has(item: IStorable): boolean;
    AddItem(item: IStorable): boolean;
    RemoveItem(item: IStorable): boolean;
}

//Manages a weight limited collection of IItems
class Inventory implements IInventory {
    private static MaxWeight: number = 100;
    private weight: number = 0;  //current weight of the items in our store
    private items: IStorable[] = [];  //list of items in our store

    //Gets all the items stores in this inventory.  If empty, an empty array is returned.
    GetAllItems(): IStorable[] {
        return this.items;
    }

    //Returns true if the given item is being stored in this inventory, else returns false.
    Has(item: IStorable): boolean {
        return contains(this.items, item);
    }

    //Adds the given item to this inventory is there's enough free space (weight) for it.  Returns true if it was added, else false.
    AddItem(item: IStorable): boolean {
        if (item.weight + this.weight > Inventory.MaxWeight) {
            return false;
        }

        this.items.push(item);
        this.weight += item.weight;
        return true;
    }

    //Removes all instances of the given item from this inventory.  Returns true if anything was removed, else returns false.
    RemoveItem(item: IStorable): boolean {
        var len = this.items.length;

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i] == item) {
                this.weight -= this.items[i].weight;
                this.items.slice(i, 1);
            }
        }

        return len < this.items.length;
    }
}