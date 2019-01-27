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
var current_word = ''; // word string
var word_list = ['strawberry', 'skateboard', 'shooter', 'computer', 'dog', 'cat', 'keyboard'];

// keypress handling
function key_down_handler(event) {
    key_pressed = true;
    if (event.keyCode == 8) {
        chr = 'backspace';
    } else {
        chr = (String.fromCharCode(event.keyCode)).toLowerCase();
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

/*
TODO
- create number of correct function for coloring 
- multiple words at the same time
*/

// word variables
var random_word; 
var random_word_x;
var random_word_y;
var destroyed = true;
var placeholder_x; // placeholder for x location
var chrs_correct = 0; // number of correct characters

function draw_word() {
    if (destroyed != true) { // draws word with typed characters colored
        placeholder_x = random_word_x; // set placeholder
        for (var i = 0; i < random_word.length; i++) {
            var ch = random_word.charAt(i);
            if (i < chrs_correct) {
                ctx.fillStyle = 'green';
            } else {
                ctx.fillStyle = 'white';
            }
            ctx.font = '20px Arial';
            ctx.fillText(ch, random_word_x, random_word_y);
            random_word_x += ctx.measureText(ch).width;
        }
        random_word_x = placeholder_x; // reset x location
    } else {
        random_word = word_list[Math.floor(Math.random() * word_list.length)];
        random_word_x = 0;
        random_word_y = 200;
        destroyed = false;
    }
}

var word_index = 0;
var word_x;
var word_y;

function draw() {
    // clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw stuff
    draw_word();
    random_word_x++;

    // calculate stuff
    word_x = 10; // reset x
    word_y = 50; // reset y

    if (key_pressed) {
        if (chr == ' ') {
            word_index = 0; // reset word index
            chrs_correct = 0; // reset chrs correct
            if (current_word == random_word) {
                destroyed = true; // random_word is destroyed
            }
            current_word = ''; // word is reset
        } else if (chr == 'backspace') {
            current_word = current_word.slice(0, -1); // removes last character
            if (word_index != 0) { word_index--; } // decrease word index
        } else {
            if (chr == random_word.charAt(word_index)) {
                chrs_correct++;
            }
            word_index++;
            current_word += chr; // adds character to word
        }
        key_pressed = false; // not accepting keypress
    }
    
    for (var i = 0; i < current_word.length; i++) {
        var ch = current_word.charAt(i);
        if (i < chrs_correct) {
            ctx.fillStyle = 'white';
        } else {
            ctx.fillStyle = 'red';
        }
        ctx.font = '50px Arial';
        ctx.fillText(ch, word_x, word_y);
        word_x += ctx.measureText(ch).width;
    }

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
