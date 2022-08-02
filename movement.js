let playerPosition = [1, 1]; // 0 indexed
let playerDirection = 0;
let BOARD_WIDTH = 3;
let BOARD_HEIGHT = 3;
let cannonBalls = [];

generateMap = (height, width, startPosition = [2, 1]) => {
    BOARD_HEIGHT = height;
    BOARD_WIDTH = width;
    playerPosition = startPosition;
    let gameBoard = document.querySelector('.game-board');
    gameBoard.innerHTML = "";
    for (let i = 0; i < height; i++) {
        // Create game row
        let gameRow = document.createElement('div');
        gameRow.classList.add('game-row')

        // Add squares to row
        for (let j = 0; j < width; j++) {
            let gameSquare = document.createElement('div');
            gameSquare.classList.add('game-square');
            gameRow.appendChild(gameSquare);
        }

        // Add row to board
        gameBoard.appendChild(gameRow);
    }

}

generateMap(7, 7)

let gameRows = document.querySelectorAll('.game-board > div');

let player = document.createElement('div');
player.classList.add('player')

const getSpecifiedSquare = (position) => {
    // Take position[y, x]
    const row = gameRows[position[0]]
    const squares = row.querySelectorAll(':scope > .game-square'
    );
    const selectedSquare = squares[position[1]];

    return selectedSquare

}

function drawPlayer(playerPosition, playerDirection) {
    // TODO: empty all squares

    // Hämta rutan som spelaren sitter i
    // let playerRow = gameRows[playerPosition[0]];
    // let squares = playerRow.querySelectorAll(':scope > .game-square'
    // );
    player.style.transform = `rotate(${playerDirection}deg)`
    let selectedSquare = getSpecifiedSquare(playerPosition);
    selectedSquare.appendChild(player)

}

drawPlayer(playerPosition, playerDirection)

const isLegalPosition = (position) => {
    // take 2 position list [y, x]
    if (position[0] >= 0 && position[0] < BOARD_HEIGHT && position[1] >= 0 && position[1] < BOARD_WIDTH) {
        return true;
    }
    return false;
}

const turnPlayer = (direction) => {
    // Takes directions "right, left"
    degrees = direction == 'left' ? -90 : 90;
    playerDirection = playerDirection + degrees;
    // drawPlayer(playerPosition, playerDirection)
}

const getNextSquare = (startPosition, rotation, direction) => {
    // rotation: degrees
    // startPosition: [y, x]
    // direction: "forward" | "back"
    let nextSquare;
    switch ((rotation) % 360) {
        case 0:
            adder = direction == "forward" ? -1 : 1;
            nextSquare = [startPosition[0] + adder, startPosition[1]];
            break;
        case 90:
        case -270:
            adder = direction == "forward" ? 1 : -1;
            nextSquare = [startPosition[0], startPosition[1] + adder];
            break;
        case 180:
        case -180:
            adder = direction == "forward" ? 1 : -1;
            nextSquare = [startPosition[0] + adder, startPosition[1]];
            break;
        case 270:
        case -90:
            adder = direction == "forward" ? -1 : 1;
            nextSquare = [startPosition[0], startPosition[1] + adder];
            break;
        default:
            nextSquare = startPosition;
            break;
    }
    return nextSquare;
}

const movePlayer = (direction) => {
    // takes directions "forward" or "back"
    let nextSquare = getNextSquare(playerPosition, playerDirection, direction)
    // Check if next is legal
    if (isLegalPosition(nextSquare)) {
        playerPosition = nextSquare
    }
    // drawPlayer(playerPosition, playerDirection)
}

const drawCannonBalls = () => {
    console.log(cannonBalls)
    cannonBalls.forEach(ball => {
        ball.htmlElement.style.trasform = `rotate(${ball.direction})`;
        let selectedSquare = getSpecifiedSquare(ball.position)
        selectedSquare.appendChild(ball.htmlElement)

    })
}

const drawGame = () => {
    drawPlayer(playerPosition, playerDirection);
    drawCannonBalls();
}

const moveCannonBalls = () => {
    // Set movement
    cannonBalls.forEach(ball => {
        const nextSquare = getNextSquare(ball.position, ball.direction, "forward");
        console.log("nextSquare", nextSquare)

        if (isLegalPosition(nextSquare)) {
            ball.position = nextSquare;
        } else {
            deleteCannonBall(ball.id);
        }
    })
}

const playerShoot = () => {
    // Where is front?
}

const createCannonBall = (position, direction) => {
    // position: [y, x], 
    // direction: int, 360 based
    // Last id should be greatest id
    // probably better to have a central counter for id.
    maxId = cannonBalls[cannonBalls.length - 1] ? cannonBalls[cannonBalls.length - 1].id : 0;
    const cannonBallHtml = document.createElement('div');
    cannonBallHtml.classList.add("cannon-ball");
    cannonBallHtml.style.transform = `rotate(${direction})`
    cannonBallHtml.style.zIndex = 100
    const cannonBall = {
        position,
        direction,
        id: maxId + 1,
        htmlElement: cannonBallHtml
    }
    cannonBalls.push(cannonBall);
    // player.appendChild(cannonBallHtml)
    console.log("New Cannonball:", cannonBall)
}

const deleteCannonBall = (id) => {
    // remove html element
    const ball = cannonBalls.find(ball => ball.id = id)
    ball.htmlElement.remove();
    cannonBalls = cannonBalls.filter(ball => ball.id != id);
} 