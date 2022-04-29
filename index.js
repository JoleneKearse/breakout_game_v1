const canvas = document.querySelector('canvas')
// set up 2D rendering
const ctx = canvas.getContext('2d')
// variables to make the ball move
let x = canvas.width / 2
let y = canvas.height - 30
// add small value to coordinates after each frame is drawn
let dx = 2
let dy = -2
// variable used to check if ball is touching walls
const ballRadius = 10
// paddle variables
const paddleHeight = 10
const paddleWidth = 75
let paddleX = (canvas.width - paddleWidth) / 2
// variables for user controls
let leftPressed = false
let rightPressed = false
// brick variables
const brickRowCount = 3
const brickColumnCount = 5
const brickWidth = 75
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 30
const brickOffsetLeft = 30
// variable to hold 2d array of bricks
const bricks = []
let score = 0

// use loops to create bricks
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: 0, y: 0, status: 1}
    }
}


// set up key event listeners
document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)
document.addEventListener('mousemove', mouseMoveHandler, false)

function keyDownHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true
    }
}

function keyUpHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = false
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2
    }
}



// make ball bounce off bricks
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r]
            // also check each bricks' status for collision
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy
                    b.status = 0
                    score++
                    if (score == brickRowCount * brickColumnCount) {
                        alert('You Win!!!!!')
                        document.location.reload()
                        clearInterval(interval)
                    }
                }
            }
        }
    }
}

// update the score display
function drawScore() {
    ctx.font = '16px Arial'
    ctx.fillStyle = '#FFE5FF'
    ctx.fillText('Score: ' + score, 8, 20)
}

// function to draw ball
function drawBall() {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI *  2)
    ctx.fillStyle = '#AC188A'
    ctx.fill()
    ctx.closePath()
}

// draw the paddle
function drawPaddle() {
    ctx.beginPath()
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
    ctx.fillStyle = '#6EFFD4'
    ctx.fill()
    ctx.closePath()
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            // check each brick's status before drawing
            if (bricks[c][r].status == 1) {

                // find the x coordinates for each brick
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
                // find the y's
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
                bricks[c][r].x = brickX
                bricks[c][r].y = brickY
                ctx.beginPath()
                ctx.rect(brickX, brickY, brickWidth, brickHeight)
                ctx.fillStyle = '#F9F871'
                ctx.fill()
                ctx.closePath()
            }
        }
    }
}

// drawing loop
function draw() {
    // clear the canvas each time it's redrawn
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawBricks()
    drawBall()
    drawPaddle()
    drawScore()
    collisionDetection()

    // to prevent the ball from disappear out the right & left sides
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx
    }
    // ditto for the top
    if (y +dy < ballRadius) {
        dy = -dy
    } else if (y + dy > canvas.height - ballRadius) {
        // let the ball bounce off paddle
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy
        } else {
            // end game
            alert('Game Over')
            document.location.reload()
            // special for Chrome to end
            clearInterval(interval)
        }
    }

    // logic for paddle movement
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7
    } else if (leftPressed && paddleX > 0) {
        paddleX = paddleX - 7
    }

    // update x & y
    x += dx
    y += dy

}

// set it to be redrawn every 10ms & variable to end game
const interval = setInterval(draw, 10)