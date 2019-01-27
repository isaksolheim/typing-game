// CANVAS AND CTX CREATION
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = '1000';
canvas.height = '400';
document.getElementsByTagName('body')[0].appendChild(canvas);

// simple keypress handler, turns keycode into character
// thats stored in chr variable
function key_down_handler(event) {
    key_pressed = true;
    if (event.keyCode == 8) {
        chr = 'backspace';
    } else {
        chr = (String.fromCharCode(event.keyCode)).toLowerCase();
    }
}
document.addEventListener('keydown', key_down_handler);

/// /// game part /// /// 

/*
TODO
- multiple words at the same time
*/

// GLOBAL VARIABLES
var random_word;        // the word player is typing 
var random_word_x;      // x-position
var random_word_y;      // y-position
var destroyed = false;   // destroyed bool
var placeholder_x;      // placeholder for x location
var chrs_correct = 0;   // number of correct characters
var chr;                // charactre pressed
var key_pressed = false;// key_pressed bool
var current_word = '';  // current input string
var word_index = 0;     // 
var word_x;             // input x-position
var word_y;             // input y-position
var started = false;    // bool to check if user has typed "start"
var word_list = ['strawberry', 'skateboard', 'shooter', 'computer', 'dog', 'cat', 'keyboard'];

class Enemy {
    constructor(text, x_pos, y_pos, dead, placeholder_x) {
        this.text = text;
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.dead = dead;
        this.placeholder_x = placeholder_x;
    }
    
    draw() {
        if (this.dead != true) {
            this.placeholder_x = this.text; // set placeholder
            for (var i = 0; i < this.text.length; i++) {
                var ch = this.text.charAt(i);
                if (i < chrs_correct) {
                    ctx.fillStyle = 'green';
                } else {
                    ctx.fillStyle = 'white';
                }
                ctx.font = '20px Arial';
                ctx.fillText(ch, this.x_pos, this.y_pos);
                this.x_pos += ctx.measureText(ch).width;
            }
            this.x_pos = this.placeholder_x; // reset x location
        } else {
            this.text = word_list[Math.floor(Math.random() * word_list.length)];
            this.x_pos = 0;
            this.y_pos = 200;
            this.dead = false;
        }
    }
}

var enemy = new Enemy("test", 0, 200, true, '');

function start_game() {
    /* 
        "start" word in middle of screen
    */
    if (started != true) {
        random_word = "start";
        random_word_x = 450;
        random_word_y = 200;
    }
}

function get_chrs_correct() {
    /* 
        this function updates the chrs_correct variable to the correct
        number of correct characters 
    */
    chrs_correct = 0;
    for (var i = 0; i < current_word.length; i++) {
        if (random_word.charAt(i) == current_word.charAt(i)) {
            chrs_correct++;
        } else {
            break;
        }
    }
}

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

function draw_input() {
    /* 
        loops through current word and colors 
        characters accordingly 
    */
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
}

function draw() { // the game-loop
    // clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    start_game();

    draw_word(); // draws word player is guessing

    //enemy.draw();

    random_word_x++; // moves the guessing-word

    // calculate stuff
    word_x = 10; // reset x
    word_y = 50; // reset y

    if (key_pressed) {
        if (chr == ' ') {
            word_index = 0; // reset word index
            chrs_correct = 0; // reset chrs correct
            if (current_word == random_word) {
                started = true;   // starts game
                destroyed = true; // random_word is destroyed
            }
            current_word = ''; // word is reset
        } else if (chr == 'backspace') {
            current_word = current_word.slice(0, -1); // removes last character
            if (word_index != 0) { word_index--; } // decrease word index
        } else {
            word_index++;
            current_word += chr; // adds character to word
        }
        key_pressed = false; // not accepting keypress
    }

    get_chrs_correct(); // updates chrs_correct
    
    draw_input();// display the current guess
    
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
