// GLOBAL VARIABLES
// create ctx canvas and put in body
var canvas = document.createElement('canvas');
canvas.id = 'canvas';
canvas.width = '1000';
canvas.height = '400';
var body = document.getElementsByTagName('body')[0];
body.appendChild(canvas);
var ctx = canvas.getContext('2d');

var chr; // charactre pressed
var key_pressed = false;
var word = ''; // word string

// keypress handling
function key_down_handler(event) {
    key_pressed = true;
    if (event.keyCode == 8) {
        chr = 'backspace';
    } else {
        chr = String.fromCharCode(event.keyCode);
    }
}

document.addEventListener('keydown', key_down_handler);

function draw_box() {
    ctx.beginPath();
    ctx.rect(100,100,100,100);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

// word variables
var random_word = 'SKATEBOARD';
var random_word_x = 0;
var random_word_y = 200;
var destroyed = false;

function draw_word() {
    if (destroyed != true) {
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(random_word, random_word_x, random_word_y);
    }
}

function draw() {
    // clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw stuff
    draw_word();
    random_word_x++;

    // calculate stuff
    if (key_pressed) {
        if (chr == ' ') {
            if (word == random_word) {
                destroyed = true; // random_word is destroyed
            }
            word = ''; // word is reset
        } else if (chr == 'backspace') {
            word = word.slice(0, -1); // removes last character
        } else {
            word += chr; // adds character to word
        }
        key_pressed = false; // not accepting keypress
    }

    ctx.fillStyle = 'white';
    ctx.font = '50px Arial';
    ctx.fillText(word, 10, 50);

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
