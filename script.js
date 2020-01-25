const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = window.innerWidth - 30;
canvas.height = window.innerHeight - 50;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth - 30;
    canvas.height = window.innerHeight - 50;
});

function randomIntFromRange(min, max){
    let d = Math.floor(Math.random() * 2);
    if(d == 0)
        return -Math.floor(Math.random() * (max - min + 1) + min);
    else
        return Math.floor(Math.random() * (max - min + 1) + min);
}

function movement(event){
    if(event.keyCode === 87)
        paddle1.position.y -= paddle1.speed;
    if(event.keyCode === 83)
        paddle1.position.y += paddle1.speed;
    if(event.keyCode === 38)
        paddle2.position.y -= paddle2.speed;
    if(event.keyCode === 40)
        paddle2.position.y += paddle2.speed;
}
function Paddle(x, color){
    this.size = {
        width: 20,
        height: 150
    };
    this.position = {
        x: x,
        y: canvas.height/2 - this.size.height/2
    };
    this.speed = 30;
    this.score = 0;
    this.color = color;
    this.draw = function(){
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
    this.update = function(){
        if(this.position.y <= 0)
            this.position.y = 0;
        if(this.position.y + this.size.height >= canvas.height)
            this.position.y = canvas.height - this.size.height;
        document.addEventListener('keydown', movement);
        this.draw();
    }
}

function Ball(x, y, radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = randomIntFromRange(5, 10);
    this.dy = randomIntFromRange(5, 10);
    this.draw = function(){
        c.fillStyle = 'yellow';
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        c.closePath();
        c.fill();
    };
    this.update = function(paddle1, paddle2){
        if((this.x-this.radius-paddle1.size.width-10 <= 0 && this.y<paddle1.position.y+paddle1.size.height && this.y>paddle1.position.y) || (this.x+this.radius+paddle2.size.width+10 >= canvas.width && this.y<paddle2.position.y+paddle2.size.height && this.y>paddle2.position.y)){
            this.dx = -this.dx;
        }
        else if((this.x-this.radius-10 <= 0 && (this.y>paddle1.position.y+paddle1.size.height || this.y<paddle1.position.y))){
            this.dx = this.dy = 0;
            init();
            paddle2.score++;
        }
        else if((this.x+this.radius+10 >= canvas.width && (this.y>paddle2.position.y+paddle2.size.height || this.y<paddle2.position.y))){
            this.dx = this.dy = 0;
            init();
            paddle1.score++;
        }
        if(this.y-this.radius <= 0 || this.y+this.radius >= canvas.height)
            this.dy = -this.dy;
        
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    };
}

function drawCenterLine(){
    c.beginPath();
    c.lineWidth = 5;
    c.strokeStyle = 'blue';
    c.moveTo(canvas.width/2, 0);
    c.lineTo(canvas.width/2, canvas.height);
    c.stroke();
    c.closePath();
}

function drawScores(paddle1, paddle2){
    c.font = "50px arial";
    c.textAlign = "center";
    c.fillText(paddle1.score, canvas.width/4, canvas.height/10, 500)
    c.fillText(paddle2.score, 3*canvas.width/4, canvas.height/10, 500);
}

let paddle1, paddle2, ball;
paddle1 = new Paddle(10, 'black');
paddle2 = new Paddle(canvas.width - 30, 'red');
function init(){
    ball = new Ball(canvas.width/2, canvas.height/2, 20);
}
function animate(){
    c.fillStyle = '#9af';
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'black';
    drawCenterLine();
    drawScores(paddle1, paddle2);
    paddle1.update();
    paddle2.update();
    ball.update(paddle1, paddle2);
    requestAnimationFrame(animate);
}
init();
animate();