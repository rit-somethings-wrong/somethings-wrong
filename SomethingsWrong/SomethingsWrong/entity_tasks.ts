/// <reference path="interfaces.ts" />
// entity_tasks.ts - Task classes that manage entity actity.

class MoveToTask implements IEntityTask {
    private moveTarget: BoundingSphere;

    constructor(targetLocation: Vector) {
        this.moveTarget = new BoundingSphere(targetLocation, 5);
    }

    // frameTime: time in seconds that has passed since last frame.
    // theEntity: the entity to apply this task on.
    update(theEntity: IEntity, frameTime: number): void {
        if (theEntity.location == null) {
            // Wait until the player is placed somewhere.
            console.log(" move task is waiting for player to join world...");
            return;
        }

        console.log("moving entity");

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
        theEntity.Place( nextLocation );
    }

    isFinished(theEntity : Entity): boolean {
        return this.moveTarget.intersectWithPoint(theEntity.location);
    }

    dispose(): void {
        // nothing to do really.
    }
}

class EntityTaskManager {
    private activeTasks: IEntityTask[];

    constructor() {
        this.activeTasks = [];
    }

    // Method to queue tasks.
    QueueTask(theTask: IEntityTask) : void {
        this.activeTasks.push(theTask);
    }

    // Processes a task in the queue.
    Process( theEntity : IEntity, frameTime : number ): void {
        if (this.activeTasks.length == 0) {
            return;
        }

        // Get the task that has been waiting the longest and update it (if not already finished).
        var activeTask = this.activeTasks[0];

        // Has the task finished execution?
        if (!activeTask.isFinished(theEntity)) { 
            // If not, update it, so it will hopefully finish.
            activeTask.update(theEntity, frameTime);
        }
        else {
            console.log("removed task from shedule");

            // Remove the task from the queue and dispose it.
            this.activeTasks.splice(0, 1);

            activeTask.dispose();
        }
    }
};