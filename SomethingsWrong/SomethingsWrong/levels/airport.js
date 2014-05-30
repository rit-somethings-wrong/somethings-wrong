// Sample level based on our starting scenario idea.

var level_airport =
{
    name = "airport",
    rectSize = [ 640, 480 ],
    img = new Image(),
    concurrentLine = [
        [ 0, 200 ],
        [ 200, 200 ],
        [ 200, 400 ],
        [ 640, 400 ]
    ],
    entryExits = [
        {
            entryX = 640, entryY = 400,
            entryRange = 25,
            exitId = "terminal",
            exitX = 100, exitY = 100
        },
        {
            entryX = 250, entryY = 300,
            entryRange = 10,
            exitId = "secret",
            exitX = 255, exitY = 127
        }
    ]
};