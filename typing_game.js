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
- more words
- settings menu with difficulty
- easter egg
- highscores
- game over screen with stats
- prevent enemies spawning on top of eachother 
*/

// GLOBAL VARIABLES
var chr;                // charactre pressed
var key_pressed = false;// key_pressed bool
var current_word = '';  // current input string
var word_index = 0;     // 
var word_x;             // input x-position
var word_y;             // input y-position
var started = false;    // bool to check if user has typed "start"
var word_list = ['angry', 'skateboard', 'wifi', 'computer', 'dogs', 'lemons', 'keyboard'];
var focus = 0; // which enemy is in focus
var word_speed = 0; // speed word is moving by
var start_time = new Date().getTime() / 1000; // start-time in seconds
var delta_time = 0.0;
var c = 0; // used to start time, fix later
var word_counter = 0; // number of enemies destroyed 
var spawnrate = 0; // number of words at the screen at the same time

function start_clock() {
	if (started === true && c === 0) {
		start_time = new Date().getTime() / 1000;
		c++;
	}
}

function get_wpm() {
	/* calculates wpm */
	var minutes = delta_time / 60;
	var wpm = Math.floor(word_counter / minutes);
	ctx.fillStyle = "orange";
	ctx.font = "10px Arial";
	ctx.fillText(wpm.toString(), 900, 50);
}

class Enemy {
    constructor(text, x_pos, y_pos, dead, placeholder_x, chrs_correct) {
        this.text = text;
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.dead = dead;
        this.placeholder_x = placeholder_x;
        this.chrs_correct = chrs_correct;
    }
   
    draw() {
        if (this.dead == false) {
            this.placeholder_x = this.x_pos; // set placeholder
            for (var i = 0; i < this.text.length; i++) {
                var ch = this.text.charAt(i);
                if (i < this.chrs_correct && this == enemies[focus]) {
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
            if (started) { this.x_pos = 0; } 
            else { this.x_pos = -200; } // sets position off-screen if not started
            this.y_pos = Math.floor(Math.random() * canvas.height);
            this.dead = false;
        }
    }

    get_chrs_correct() {
        /* 
            this function updates the chrs_correct variable to the correct
            number of correct characters 
        */
        this.chrs_correct = 0;
        for (var i = 0; i < this.text.length; i++) {
            if (this.text.charAt(i) == current_word.charAt(i)) {
                this.chrs_correct++;
            } else {
                break;
            }
        }
    }
}

// generate enemies
var enemies = [];
for (var i = 0; i < 6; i++) {
    enemies[i] = new Enemy('', -50, 200, true, '');    
    spawnrate++;
}

function start_or_lose() {
    /* 
        start and lose "menues" 
    */
    if (started != true) {
        enemies[0].text = "start";
        enemies[0].x_pos = 450;
        enemies[0].y_pos = 200;
    }
    // check if enemy is off screen
    for (enemy of enemies) {
        if (enemy.x_pos > canvas.width) {
            started = false; // stop game
            word_speed = 0;  // stop movement
            for (e of enemies) {
                e.x_pos = -200;
            }
        }
    }
}

function draw_input() {
    /* 
        loops through current word and colors 
        characters accordingly 
    */
    for (var i = 0; i < current_word.length; i++) {
        var ch = current_word.charAt(i);
        if (i < enemies[focus].chrs_correct) {
            ctx.fillStyle = 'white';
        } else {
            ctx.fillStyle = 'red';
        }
        ctx.font = '50px Arial';
        ctx.fillText(ch, word_x, word_y);
        word_x += ctx.measureText(ch).width;
    }
}

function find_focus() {
    /* finds focus based on first character of word
       and how far it is from the end of the screen */
    if (started === false) {
        focus = 0; // default
    } else {
        var highest = -10000;
        for (enemy of enemies) {
            if (current_word.charAt(0) === enemy.text.charAt(0)) {
                if (enemy.x_pos > highest) {
                    highest = enemy.x_pos;
                    focus = enemies.indexOf(enemy);
                }
            } 
        }
    }
}

var placeholder_time = 0.0;

function dynamic_difficulty() {
	/* increases numbers of words on screen every 5 seconds */
	if (started === true && placeholder_time === 0.0) {
		placeholder_time = delta_time;
	}
	if (delta_time - placeholder_time > 5) {
		spawnrate++;
		placeholder_time = 0.0;
	}
    if (enemies.length < spawnrate) {
	    enemies[enemies.length] = new Enemy('', -50, 200, true, '');
    }
}

function draw() { // the game-loop
    // clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    start_clock(); // starts clock once game starts

    delta_time = (new Date().getTime() / 1000) - start_time; // seconds after start

    dynamic_difficulty(); // enables harder and harder
    start_or_lose(); // handles start and lose of game
    get_wpm(); // displays wpm

    find_focus(); // finds which enemy to focus

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw(); // draws enemy
        enemies[i].x_pos += word_speed;// moves enemy
    }

    // calculate stuff
    word_x = 800; // reset x
    word_y = 350; // reset y

    if (key_pressed) {
        if (chr == ' ') {
            word_index = 0; // reset word index
            chrs_correct = 0; // reset chrs correct
            if (current_word == enemies[focus].text) {
                word_speed = 1;   // words start moving (after start)
                started = true;   // starts game
                enemies[focus].dead = true; // random_word is destroyed
                word_counter++; // increase eniemies destroyed
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

    enemies[focus].get_chrs_correct(); // updates chrs_correct
    
    draw_input(); // display the current guess
    
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
