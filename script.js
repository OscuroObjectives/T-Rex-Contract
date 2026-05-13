const contractAddress =
"0x15FEA1A3958fD447951b8CB46756a4150EbDfea6";

const contractABI = [
	{
		"inputs": [],
		"name": "depositFunds",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "enterGame",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundsDeposited",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FundsWithdrawn",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "GameEntered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "RewardPaid",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			}
		],
		"name": "ScoreSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "score",
				"type": "uint256"
			}
		],
		"name": "submitScore",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdrawFunds",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ENTRY_FEE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "hasPaid",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "highScores",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "REWARD_AMOUNT",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "rewardClaimed",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "WINNING_SCORE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let provider;
let signer;
let contract;
let userAddress;

const connectButton =
document.getElementById("connectButton");

const playButton =
document.getElementById("playButton");

const jumpButton =
document.getElementById("jumpButton");

const walletAddressText =
document.getElementById("walletAddress");

const statusText =
document.getElementById("status");

const scoreDisplay =
document.getElementById("scoreDisplay");

connectButton.addEventListener(
    "click",
    connectWallet
);

playButton.addEventListener(
    "click",
    enterGame
);

async function connectWallet() {

    if (!window.ethereum) {

        alert("MetaMask not detected");

        return;
    }

    await window.ethereum.request({
        method: "eth_requestAccounts"
    });

    provider =
    new ethers.providers.Web3Provider(
        window.ethereum
    );

    signer = provider.getSigner();

    userAddress =
    await signer.getAddress();

    contract =
    new ethers.Contract(
        contractAddress,
        contractABI,
        signer
    );

    walletAddressText.innerText =
    `Wallet: ${userAddress}`;

    playButton.disabled = false;

    statusText.innerText =
    "Status: Wallet Connected";
}

async function enterGame() {

    try {

        statusText.innerText =
        "Status: Waiting for payment...";

        const tx =
        await contract.enterGame({

            value:
            ethers.utils.parseEther("0.001")
        });

        await tx.wait();

        statusText.innerText =
        "Status: Payment confirmed";

        startGame();

    } catch (error) {

        console.error(error);

        statusText.innerText =
        "Status: Payment failed";
    }
}

// ======================
// REAL TREX GAME
// ======================

const canvas =
document.getElementById("gameCanvas");

const ctx =
canvas.getContext("2d");

// PLAYER

const player = {

    x: 100,
    y: 200,
    width: 40,
    height: 40,

    velocityY: 0,

    jumping: false
};

// GAME VARIABLES

let obstacles = [];

let score = 0;

let gameRunning = false;

let gravity = 0.8;

// START GAME

function startGame() {

    score = 0;

    obstacles = [];

    gameRunning = true;

    player.y = 200;

    player.velocityY = 0;

    player.jumping = false;

    statusText.innerText =
    "Status: Game Running";

    spawnObstacle();

    requestAnimationFrame(gameLoop);
}

// MAIN LOOP

function gameLoop() {

    if (!gameRunning) return;

    update();

    draw();

    requestAnimationFrame(gameLoop);
}

// UPDATE GAME

function update() {

    // SCORE

    score++;

    scoreDisplay.innerText =
    `Score: ${score}`;

    // GRAVITY

    player.velocityY += gravity;

    player.y += player.velocityY;

    // FLOOR COLLISION

    if (player.y > 200) {

        player.y = 200;

        player.velocityY = 0;

        player.jumping = false;
    }

    // MOVE OBSTACLES

    for (let obstacle of obstacles) {

        obstacle.x -= 6;
    }

    // REMOVE OLD OBSTACLES

    obstacles =
    obstacles.filter(
        obstacle => obstacle.x > -50
    );

    // COLLISION

    for (let obstacle of obstacles) {

        if (

            player.x <
            obstacle.x + obstacle.width &&

            player.x + player.width >
            obstacle.x &&

            player.y <
            obstacle.y + obstacle.height &&

            player.y + player.height >
            obstacle.y

        ) {

            endGame();
        }
    }
}

// DRAW GAME

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // GROUND

    ctx.fillStyle = "gray";

    ctx.fillRect(
        0,
        240,
        canvas.width,
        5
    );

    // PLAYER

    ctx.fillStyle = "black";

    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );

    // OBSTACLES

    ctx.fillStyle = "green";

    for (let obstacle of obstacles) {

        ctx.fillRect(
            obstacle.x,
            obstacle.y,
            obstacle.width,
            obstacle.height
        );
    }

    // SCORE

    ctx.fillStyle = "black";

    ctx.font = "24px Arial";

    ctx.fillText(
        `Score: ${score}`,
        20,
        40
    );
}

// SPAWN OBSTACLES

function spawnObstacle() {

    if (!gameRunning) return;

    obstacles.push({

        x: canvas.width,

        y: 200,

        width: 30,

        height: 40
    });

    const randomTime =
    Math.random() * 2000 + 1000;

    setTimeout(
        spawnObstacle,
        randomTime
    );
}

// JUMP

function jump() {

    if (!player.jumping) {

        player.velocityY = -15;

        player.jumping = true;
    }
}

document.addEventListener(
    "keydown",
    (event) => {

        if (event.code === "Space") {

            jump();
        }
    }
);

jumpButton.addEventListener(
    "click",
    jump
);

// END GAME

async function endGame() {

    gameRunning = false;

    statusText.innerText =
    "Status: Submitting score...";

    try {

        const tx =
        await contract.submitScore(score);

        await tx.wait();

        statusText.innerText =
        `Status: Score Submitted (${score})`;

    } catch (error) {

        console.error(error);

        statusText.innerText =
        "Status: Score submission failed";
    }
}