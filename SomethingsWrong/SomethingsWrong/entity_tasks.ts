/// <reference path="interfaces.ts" />
// entity_tasks.ts - Task classes that manage entity actity.

class MoveToTask implements IEntityTask {
    private lastMoveTime: any;

    update(theEntity: Entity, frameTime) : void {
        // TODO: move the entity

        // Update the time the entity was last moved.
        this.lastMoveTime = 0;
    }

    isFinished(): boolean {
        return true;
    }

    dispose(): void {

    }
}