let socket;
let images = [];

let blu, rd;

let started;
let para;
let w;

let chess = undefined;

let team;
let otherHasLeft = false;

function preload() {
	images.push(loadImage("PNG/board.png"));
	const troopNames = ['rook', 'knight', 'bishop', 'queen', 'king', 'pawn'];
	for (let name of troopNames) images.push(loadImage("PNG/w_" + name + ".png"));
	for (let name of troopNames) images.push(loadImage("PNG/b_" + name + ".png"));
	selector = loadImage("PNG/selector.png");
	blu = loadImage("PNG/blue.png");
	rd = loadImage("PNG/red.png");
}

function setup() {
	socket = io();

	para = createP('Wait for opponent');

	socket.on('started', data => {
			started = true;
			chess = data.chess;
			team = data.role;
			const smaller = windowWidth < windowHeight ? windowWidth : windowHeight;
			let canvas = createCanvas(smaller, smaller);
			canvas.position(0, 0);
			w = width / 8;
			para.html('');
			});

	socket.on('update', chess_ => chess = chess_);

	socket.on('left', () => otherHasLeft = true);
	
	textAlign(CENTER, CENTER);
}

function draw() {
	if (started) {
		background(images[0]);

		if (chess.wCheckState >= 0) {
			let king = getKing('white');
			let x = p(king.j) * w;
			let y = p(king.i) * w;
			image(rd, x, y, w, w);
		}

		if (chess.bCheckState >= 0) {
			let king = getKing('black');
			let x = p(king.j) * w;
			let y = p(king.i) * w;
			image(rd, x, y, w, w);
		}

		if (chess.selected != null) {
			let x = p(chess.selected.j) * w;
			let y = p(chess.selected.i) * w;
			image(selector, x, y, w, w);

			for (let move of chess.selected.possibleMoves) {
				let mx = p(move[1]) * w;
				let my = p(move[0]) * w;

				if (getPiece(move[0], move[1]) == null) image(blu, mx, my, w, w);
				else image(rd, mx, my, w, w);
			}
		}

		for (let whiteTroop of chess.whites) {
			let img = images[whiteTroop.imageIndex];
			// let x = team == 'white' ? whiteTroop.j * w : (7 - whiteTroop.j) * w;
			// let y = team == 'white' ? whiteTroop.i * w : (7 - whiteTroop.i) * w;
			let x = p(whiteTroop.j) * w;
			let y = p(whiteTroop.i) * w;
			image(img, x, y, w, w);
		}

		for (let blackTroop of chess.blacks) {
			let img = images[blackTroop.imageIndex];
			// let x = team == 'white' ? blackTroop.j * w : (7 - blackTroop.j) * w;
			// let y = team == 'white' ? blackTroop.i * w : (7 - blackTroop.i) * w;
			let x = p(blackTroop.j) * w;
			let y = p(blackTroop.i) * w;
			image(img, x, y, w, w);
		}

		if (chess.wCheckState == 1 || chess.bCheckState == 1) {
			let winner = chess.wCheckState == 1? 'Black' : 'White';
			let col = winner == 'White'? color(255) : color(0);
			fill(col);
			
			let txt = winner + ' Won!';
			textSize(15);
			let a = textWidth(txt);
			let desiredRatio = width / (2 * a);
			let desiredTextSize = 15 * desiredRatio;
			textSize(desiredTextSize);

			//console.log(desiredTextSize);
			textAlign(CENTER, CENTER);

			text(txt, width / 2, height / 2);
		}

		else if (otherHasLeft) {
			let txt = team == 'white'? 'Black' : 'White';
			txt += ' has left!'
			textSize(15);
			let a = textWidth(txt);
			let desiredRatio = width / (2 * a);
			let desiredTextSize = 15 * desiredRatio;
			textSize(desiredTextSize);

			textAlign(CENTER, CENTER);
			text(txt, width / 2, height / 2);
		}
	}

}


function mousePressed() {
	if (started && !otherHasLeft && team == chess.turn && mouseX < width && mouseY < height) {
		let i = p(floor(mouseY / w));
		let j = p(floor(mouseX / w));
		socket.emit('mouseEvent', {
			i: i,
			j: j
		});
	}
}

function p(i) {
	if (team == 'white') return i;
	else return (7 - i);
}

function getPiece(i, j) {
	let whites = chess.whites,
		blacks = chess.blacks;
	for (let whiteTroop of whites) {
		if (whiteTroop.i == i && whiteTroop.j == j) {
			return whiteTroop;
		}
	}
	for (let blackTroop of blacks) {
		if (blackTroop.i == i && blackTroop.j == j) {
			return blackTroop;
		}
	}

	return null;
}


function getKing(team) {
	let whites = chess.whites,
		blacks = chess.blacks;
	let troops = team == 'white' ? whites : blacks;
	for (let troop of troops) {
		if (troop.type == 'king') return troop;
	}
}
