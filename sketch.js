const lineLength = 570;
//const fov = 180;
const fov = 70;

const sceneW = 400;
const sceneH = 400;

const speed = 2;

let walls = [];
let dir = 0;
let x3 = 0;
let y3 = 0;
let rayInc = 0;

function setup() {
    createCanvas(800, 400);
    background(0);

    x3 = sceneW/2;
    y3 = sceneH/2;

    rayInc = fov/sceneW;

    for (let i = 0; i < 3; ++i)
    {
        let x1 = random(sceneW);
        let y1 = random(sceneH);
        let x2 = random(sceneW);
        let y2 = random(sceneH);
        walls.push(new Wall(x1, y1, x2, y2));
    }

    // Build Borders
    walls.push(new Wall(0, 0, sceneW, 0));
    walls.push(new Wall(0, 0, 0, sceneH));
    walls.push(new Wall(sceneW, 0, sceneW, sceneH));
    walls.push(new Wall(0, sceneH, sceneW, sceneH));
}

function draw() {
    background(0);

    fill(100);

    // Control Position
    if (keyIsDown(65)) // A
        x3 = (x3 - speed) < 1 ? 1 : x3 - speed;
    if (keyIsDown(68)) // D
        x3 = (x3 + speed) > (sceneW-1) ? sceneW-1 : x3 + speed;
    if (keyIsDown(87)) // W
        y3 = (y3 - speed) < 1 ? 1 : y3 - speed;
    if (keyIsDown(83)) // S
        y3 = (y3 + speed) > (sceneH-1) ? sceneW-1 : y3 + speed;

    // Control Direction
    if (keyIsDown(LEFT_ARROW)) // W
        dir -= 1;
    if (keyIsDown(RIGHT_ARROW)) // S
        dir += 1;

    stroke(255);
    for (let i = 0; i < walls.length; ++i)
    {
        walls[i].draw();
    }

    const halfFOV = fov/2;
    //for (let i = dir-halfFOV; i < dir+halfFOV; i+=rayInc)
    for (let i = 0; i < sceneW; ++i)
    {
        const angle = (dir-halfFOV) + (i * rayInc);
        //let shortLength = 800;
        let shortLength = lineLength;
        let x4 = x3+(cos(radians(angle)) * shortLength);
        let y4 = y3+(sin(radians(angle)) * shortLength);

        for (let j = 0; j < walls.length; ++j)
        {
            const x1 = walls[j].x1;
            const y1 = walls[j].y1;
            const x2 = walls[j].x2;
            const y2 = walls[j].y2;
            const d = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));

            if (d == 0)
                continue;

            const t = ( ((x1 - x3) * (y3 - y4)) - ((y1 - y3) * (x3 - x4)) ) / d;
            const u = ( ((x1 - x3) * (y1 - y2)) - ((y1 - y3) * (x1 - x2)) ) / d;

            if (t >= 0  && t <= 1)
            {
                if (u >= 0 && u <= 1)
                {
                    const tempX = x3 + (u * (x4 - x3));
                    const tempY = y3 + (u * (y4 - y3));
                    const newLength = sqrt(pow (tempX - x3, 2) + pow (tempY - y3, 2));

                    if (newLength < shortLength)
                    {
                        shortLength = newLength;
                        x4 = tempX;
                        y4 = tempY;
                    }
                }
            }
        }

        stroke(255,50);
        line(x3, y3, x4, y4);
        push();
        // Translates position to the right side of the scene, to get a side by side view
        translate(sceneW, 0);
        let vert = map(shortLength, 0, lineLength, sceneH, 0);
        let yStart = (sceneH - vert) / 2;
        noStroke();
        rect(i, yStart, 1, vert)
        //line(x3, y3, x4, y4);

        pop();
    }

    fill(255);
    noStroke();
    circle(x3, y3, 20);
}

class Wall
{
    constructor(x1, y1, x2, y2)
    {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    draw()
    {
        //stroke(255);
        line(this.x1, this.y1, this.x2, this.y2);
    }
}
