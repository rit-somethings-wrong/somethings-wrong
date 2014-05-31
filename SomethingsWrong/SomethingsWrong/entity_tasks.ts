/// <reference path="interfaces.ts" />
// entity_tasks.ts - Task classes that manage entity actity.

class MoveToTask implements IEntityTask {
    private moveTarget: BoundingSphere;

    constructor(targetLocation: Vector) {
        this.moveTarget = new BoundingSphere(targetLocation, 5);
    }

    // frameTime: time in seconds that has passed since last frame.
    // theEntity: the entity to apply this task on.
    update(theEntity: Entity, frameTime : number) : void {
        // TODO: move the entity
        var moveDirection = this.moveTarget.getPosition().subtract(theEntity.location);

        var moveLength = moveDirection.normalize();
        var actualEntityMoveLength = theEntity.moveSpeed * frameTime;

        if (moveLength < actualEntityMoveLength) {
            actualEntityMoveLength = moveLength;
        }

        // Move onto the target.
        var nextLocation = theEntity.location.add(moveDirection.multiply(actualEntityMoveLength));

        // Set the location to the entity.
        theEntity.location = nextLocation;
    }

    isFinished(theEntity : Entity): boolean {
        return this.moveTarget.intersectWithPoint(theEntity.location);
    }

    dispose(): void {
        // nothing to do really.
    }
}

class EntityTaskManager {
    private activeTasks: any;

    constructor() {
        this.activeTasks = [];
    }

    // Method to queue tasks.
    QueueTask(theTask: IEntityTask) : void {
        this.activeTasks.push(theTask);
    }

    // Processes a task in the queue.
    Process( theEntity : Entity ): void {
        if (this.activeTasks.length == 0) {
            return;
        }

        // Get the task that has been waiting the longest and update it (if not already finished).
        var activeTask = this.activeTasks[0];

        // Has the task finished execution?
        if (!activeTask.isFinished(theEntity)) { 
            // If not, update it, so it will hopefully finish.
            activeTask.update(theEntity);
        }
        else {
            // Remove the task from the queue and dispose it.
            this.activeTasks.slice(0, 1);

            activeTask.dispose();
        }
    }
};