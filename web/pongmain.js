
$(function() {
    window.keydown = {};
    window.keyup = {};
  
    function keyName(event) {
        return jQuery.hotkeys.specialKeys[event.which] ||
        String.fromCharCode(event.which).toLowerCase();
    }
  
    $(document).bind("keydown", function(event) {
        keydown[keyName(event)] = true;
    });
  
    $(document).bind("keyup", function(event) {
        keydown[keyName(event)] = false;
    });
});




function main() {

    Number.prototype.clamp = function(min, max) {
        return Math.min(Math.max(this, min), max);
    };
    
    
    var topoff = 72;
    var bottomoff = 32;
    var CANVAS_WIDTH = 800;
    var CANVAS_HEIGHT = 600;
    var padSpeed = 400;
    var ballSpeed = 400
    var reset = 0;
    var aiSpeed = 2.2; // 1 = fast, 5 = slow, 0 = break
    var randOffset = 0;

    var canvasThing = $("<canvas class='box' width='" + CANVAS_WIDTH + 
        "' height='" + CANVAS_HEIGHT + "'></canvas>");
    
    var canvasElement = canvasThing.get(0);
    
    canvasThing.appendTo('#canvascont');
    
    var canvas = canvasElement.getContext("2d");
    
    var FPS = 300;

    var scorx;
    var imgWi = 32
    
    var imgStore = {
        loadImages: function(){
            var iconx = 20
            var icony = 550
            this.loadImage('img/i.png','i',iconx,icony);
            this.loadImage('img/menu.png','menu',iconx,icony);
            this.loadImage('img/menu.png','inMenu',3*iconx + 2*imgWi,icony);
            this.loadImage('img/pause.png','pause',iconx,icony);
            this.loadImage('img/play.png','play',iconx,icony);
            this.loadImage('img/unmuted.png','unmuted',2*iconx + imgWi,icony);
            this.loadImage('img/muted.png','muted',2*iconx + imgWi,icony);
            this.loadImage('img/settings.png','settings',3*iconx + 2*imgWi,icony);
            this.loadImage('img/reset.png','reset',4*iconx + 3*imgWi,icony);
            this.loadImage('img/instructions.png','instructions', 50, 50);
            this.loadImage('img/1player.png','1player', CANVAS_WIDTH/2-115, CANVAS_HEIGHT/2-130);
            this.loadImage('img/2player.png','2player', CANVAS_WIDTH/2-115, CANVAS_HEIGHT/2+70);
            
           
        },
        loadImage: function(src, name, x, y){
            var img = new Image();
            img.src = src;
            img.x = x;
            img.y = y;
            img.clicked = false;
            img.onload = function(){
                imgStore[name] = img;
            };
        },
        drawImage: function(name){
            var imge = imgStore[name];
            canvas.drawImage(imge, imge.x, imge.y) ;
        },
        checkClick: function (x, y){
            console.log("x: "+x);
            console.log("y: "+y);
            this.checkImageClick("i", x, y);
            this.checkImageClick("menu", x, y);
            this.checkImageClick("inMenu", x, y);
            this.checkImageClick("pause", x, y);
            this.checkImageClick("muted", x, y);
            this.checkImageClick("settings", x, y);
            this.checkImageClick("reset", x, y);
            this.checkImageClick("instructions", x, y);
        },
        checkImageClick: function(name, x, y){
            var imge = imgStore[name];
            if ((x >= imge.x && x <= imge.x + imgWi) && (y >= imge.y && y <= imge.y + imgWi)){
                imge.clicked = true;
                console.log("clicked =");
            }
        }   
    };
    imgStore.loadImages();
        
    
    canvasElement.addEventListener("click",function(e){
        imgStore.checkClick(e.offsetX, e.offsetY);
    });
    
    function playSound(name){
        if (!isMute){
            Sound.play(name);
        }
    }
    
    
    // a rect is one of the blocks that makes up a digit
    // each digit has an array called segments - which is just the list of these
    // rect's that make up that digit
    var rect = function() {
        this.color = "#fff";
        this.x = 217;
        this.y = 112;
        this.wi = 32;
        this.hi = 8;

        this.draw = function() {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.wi, this.hi);
        }
    };
  
    // a single digit - containing 8 rects
    // and a list of which of the 8 rects to draw per value 0-9
    var digit = function() {
        var segments = [];
        var offx;
        var offy;
        var value = 0;
       
        for (var i = 0;i < 7; i++) {
            segments.push(new rect());
        }
        
        this.off = function(newx, newy, newwi, newhi) {
            offx = newx;
            offy = newy;
            
            // set up the position of each segment
            segments[0].x = offx;
            segments[0].y = offy;
            segments[0].wi = newwi;
            segments[0].hi = newhi;
            segments[1].x = offx;
            segments[1].y = offy;
            segments[1].wi = newhi;
            segments[1].hi = newwi;
            segments[2].x = offx+24;
            segments[2].y = offy;
            segments[2].wi = newhi;
            segments[2].hi = newwi;
            segments[3].x = offx;
            segments[3].y = offy+28;
            segments[3].wi = newwi;
            segments[3].hi = newhi;
            segments[4].x = offx;
            segments[4].y = offy+32;
            segments[4].wi = newhi;
            segments[4].hi = newwi;
            segments[5].x = offx+24;
            segments[5].y = offy+32;
            segments[5].wi = newhi;
            segments[5].hi = newwi;
            segments[6].x = offx;
            segments[6].y = offy+56;
            segments[6].wi = newwi;
            segments[6].hi = newhi;
        }
  
        // the array of arrays of each segment to display for each digit
        var segLookups = [
        //0,1,2,3,4,5,6
        [1,1,1,0,1,1,1],   //0
        [0,0,1,0,0,1,0],   //1
        [1,0,1,1,1,0,1],   //2
        [1,0,1,1,0,1,1],   //3
        [0,1,1,1,0,1,0],   //4
        [1,1,0,1,0,1,1],   //5
        [1,1,0,1,1,1,1],   //6
        [1,0,1,0,0,1,0],   //7
        [1,1,1,1,1,1,1],   //8
        [1,1,1,1,0,1,1]    //9
        ];
        
        this.draw = function () {
            
            var curlookup = segLookups[value];
            for (var i = 0;i <7 ; i++) {
                if(curlookup[i] == 1) {
                    segments[i].draw();
                }
            }
        }; 
        
        this.setVal = function(what) {
            value = what;
        };
    };
  
  
  
  
  
    // the score object contains a score variable that gets incremented on a point
    // a single score contains 2 digits
    score = function (doff) {
        this.score = 0;
        
        this.reset = function() {
            this.score = 0;
            this.digit1.setVal(0);
            this.digit2.setVal(0);
        };
        
        this.inc = function () {
            this.score +=1;
            
            this.digit1.setVal(this.score % 10);
            var highDigit = Math.floor(this.score / 10);
            this.digit2.setVal(highDigit);
            
        };
        
        this.draw = function() {
            this.digit1.draw();
            if (this.score > 9) {
                this.digit2.draw();
            }
        };
        
        this.digit1 = new digit ();
        this.digit2 = new digit ();
        
        this.digit1.off(92 + doff, 112, 32, 8);
        this.digit2.off(doff, 112, 32, 8);        
    }
    
    // make the two score objects
    var score1 = new score(509);
    var score2 = new score(125);

// now the 2 player object literals 
    var hi=64;
    var wi=8;
    var player = {
        color: "#fff",
        x: CANVAS_WIDTH-30-wi,
        y: CANVAS_HEIGHT/2-(hi/2),
        width: wi,
        height: hi,
        name: "one",
        draw: function() {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
            
        //console.log(this.x);
        }
    };
    
    var player2 = {
        color: "#fff",
        x: 30,
        y: CANVAS_HEIGHT/2-(hi/2),
        width: wi,
        height: hi,
        name: "two",
        draw: function() {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
        }
    //console.log(this.x);
        
    };


    // the single ball object literal 
    var ball = {
        color: "#fff",
        x: CANVAS_WIDTH/2-(4),
        y: 200,
        vx: 0,
        vy: 0,
        width: 8,
        height: 8,
        angle: 0,
        speed: 0,
        draw: function() {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x, this.y, this.width, this.height);
        //console.log(this.x);
        },
        update: function (tDelta) {
            this.x+=this.vx*tDelta;
            this.y+=this.vy*tDelta;
        },
        
        getBallIntercept: function () {
            ballIntercept = (this.y - (this.x - player2.x)/Math.tan((this.angle/180)*Math.PI))+(Math.floor((Math.random()*64)-32));
        },
        
        newMotion: function (angle, speed) {
            if (angle>180) {
                angle=angle-360;
            }
            this.angle=angle;
            var rads = angle*(Math.PI/180);
            this.speed=speed;
            this.vx=Math.sin(rads)*this.speed;
            this.vy=Math.cos(rads)*this.speed;
            this.getBallIntercept();
        },
        
        revx: function () {
            this.vx=0-this.vx;
            this.angle = 0-this.angle;
            console.log(this.angle);
            this.getBallIntercept();
            randOffset = (Math.floor((Math.random()*64)-32));
        },
        
        revy: function () {
            this.vy=0-this.vy;
            if (this.angle>=0) {
                this.angle=180-this.angle;
            }
            else {
                this.angle = 0-180-this.angle;
            }
            this.getBallIntercept();
        }
    };
    
    //ball.newMotion((Math.floor(Math.random()*(12))*10)+30, ballSpeed);
    ball.newMotion(30, ballSpeed);
    
    
    
    
    // this is used to time each pass through the loop
    var lastTime = new Date().getTime();
    
    // Pause
    var pauseGame = false;
    var mDown = false;
    var pDown = false;
    var iDown = false;
    var backDown = false;
    var rDown = false;
    
    var ballIntercept = 0;
    
    function pExemptUpdate(){
        if (!keydown.p) {
            pDown = false;
        }
        if ((keydown.p && !pDown) || imgStore["pause"].clicked) {
            pauseGame = false;
            pDown = true;
            lastTime = new Date().getTime();
            imgStore["pause"].clicked = false;
            console.log("unpaused");
        }
        checkMute();
    }
    // the main position update, reacting to keypresses and detecting collissions
    
    function update() {
        
        var  thisTime = new Date().getTime();
        var timeDelta = (thisTime-lastTime)/1000;
        var padOffset = padSpeed*timeDelta;
        lastTime = thisTime;
        checkMute();
        
        
        if (!keydown.p) {
            pDown = false;
        }
            
        if ((keydown.p && !pDown) || imgStore["pause"].clicked) {
            imgStore["pause"].clicked = false;
            pDown = true;
            pauseGame = true;
            pauseTime = thisTime;
            console.log("paused");
        }
        
        if (!keydown.r) {
            rDown = false;
        }  
            
        if ((keydown.r && !rDown) || imgStore["reset"].clicked) {
            imgStore["reset"].clicked = false;
            rDown = true;
            ball.vx=0; 
            ball.vy=0;
            ball.x=CANVAS_WIDTH/2 - (ball.width/2)
            ball.y = 200
            score2.reset();
            score1.reset();
            setTimeout(function(){
                ball.newMotion((Math.floor(Math.random()*(12))*10)+30, ballSpeed);
                reset = 0;
            }, 1000);
            
            
        }
        
        if (keydown.down) {
            player.y += padOffset;
        }

        if (keydown.up) {
            player.y -= padOffset;
        }
        
        
        //if (keydown.a) {
        //  player2.x -= 5;
        //}

        //if (keydown.d) {
        //  player2.x += 5;
        //}
        
        // if 2 player
        
        if (menuSelection == 2) {
        
            if (keydown.s) {
                player2.y += padOffset;
            }

            if (keydown.w) {
                player2.y -= padOffset;
            }
        }
        else {  // 1 player
            // player 2 AI        
            var aiOffset = padOffset/aiSpeed;
            
            // when core, reset AI to middle
            if (reset == 1) {
                if (player2.y+player2.height/2 > CANVAS_HEIGHT/2) {
                    player2.y -= aiOffset;
                }
            
                if (player2.y+player2.height/2 < CANVAS_HEIGHT/2) {
                    player2.y += aiOffset;
                }
            }
            else if (ball.angle == -90) {  // if ball is flat goto ball
                if (ball.y + randOffset > player2.y+player2.height/2) {
                    player2.y += aiOffset;
                }
                
                if (ball.y - randOffset < player2.y+player2.height/2) {
                    player2.y -= aiOffset;
                }
            } 
            else {
                if (ball.angle < 0) {
                    
                    if ((player2.y + player2.height/2) >= ballIntercept) {
                        player2.y -= aiOffset;
                    }
                    if ((player2.y + player2.height/2) < ballIntercept) {
                        player2.y += aiOffset;
                    }
                
                }
                else {   // go back to middle
                    if (player2.y+player2.height/2 > CANVAS_HEIGHT/2) {
                        player2.y -= aiOffset;
                    }
            
                    if (player2.y+player2.height/2 < CANVAS_HEIGHT/2) {
                        player2.y += aiOffset;
                    }
                }
            }
        }  // end of 1 player AI
        
            
        player.x = player.x.clamp(0, CANVAS_WIDTH - player.width);
        player.y = player.y.clamp(topoff, CANVAS_HEIGHT- player.height-bottomoff);
            
        player2.x = player2.x.clamp(0, CANVAS_WIDTH - player2.width);
        player2.y = player2.y.clamp(topoff, CANVAS_HEIGHT- player2.height-bottomoff);
           
           
        ball.update(timeDelta);
        
        if (collide(ball,player)) {
            ball.x = player.x-ball.width;
            playSound("paddle_hit");
            spin (player);
        }
        
           
        if (collide(ball,player2)) {
            ball.x = player2.x+player2.width;
            playSound("paddle_hit");
            spin (player2);   
        }
        
        function spin (paddle) {
            var bpOff = ball.y-paddle.y;
            var chunk = Math.floor(bpOff/(hi/8)); //8 Chunks
            chunk=chunk.clamp(0, 7);
            console.log("chunk - "+chunk);
            var angleDelta;
            var newAngle ;
            switch (chunk) {          
                case 0:
                    newAngle = 150;
                    break;
                case 1:
                    newAngle = 130;
                    break;
                case 2:
                    newAngle = 110;
                case 3:
                case 4:
                    var sChunk = Math.floor(bpOff/(hi/16));
                    newAngle = 90;
                    if (sChunk == 6) {
                        newAngle = 100;
                    }
                    if (sChunk == 9) {
                        newAngle = 80;
                    }
                    break;
                case 5:
                    newAngle = 70;
                case 6:
                    newAngle = 50;
                    break;
                case 7:
                    newAngle = 30;
                    break;
            }
            
            if (paddle.name == "two") {
                newAngle=0-newAngle;
            }
            
            /*  if (paddle.name == "one") {
                if (chunk==0 || chunk==7){
                    
                }
                else {
                    newAngle = ball.angle + angleDelta;
                    newAngle = newAngle.clamp(30, 150)
                    console.log("newAngle - "+newAngle);
                }
            }
            else {
                if (chunk==0 || chunk==7){
                    newAngle=0-newAngle;
                }
                else {
                    newAngle = ball.angle - angleDelta;
                    newAngle = newAngle.clamp(-150, -30)
                }
            }
            */
            ball.newMotion(newAngle, ballSpeed);
            console.log("Angle - "+ball.angle);
            ball.revx();
            console.log("bounce Angle - "+ball.angle);
        }   
        
        if(ball.y>CANVAS_HEIGHT-bottomoff-ball.height) {
            ball.revy();
            ball.y=CANVAS_HEIGHT-bottomoff-ball.height;
            playSound("wall_hit");
            
        }
        else if (ball.y<topoff) {
            ball.revy();
            ball.y=topoff;
            playSound("wall_hit");
            
            
        }
        
        if(ball.x > CANVAS_WIDTH-ball.width) {
            ball.vx=0; 
            ball.vy=0;
            ball.x=CANVAS_WIDTH/2 - (ball.width/2)
            playSound("score");
            score2.inc();
            reset = 1;
            setTimeout(function(){
                
                ball.newMotion((Math.floor(Math.random()*(12))*10)+30, ballSpeed);
                reset = 0;
            }, 1000);
            
            console.log(score2.score + "--- " + score1.score);
        }
        else if (ball.x < 0) {
            ball.vx=0; 
            ball.vy=0;
            ball.x=CANVAS_WIDTH/2 - (ball.width/2)
            playSound("score");
            score1.inc();
            reset = 1;
            setTimeout(function(){
                reset = 0;
                ball.newMotion((Math.floor(Math.random()*(-12))*10)-30, ballSpeed);
            }, 1000);
            console.log(score2.score + "--- " + score1.score);
        }
    }
    
    // a --> paddle, b ---> Ball
    
    function collide (a,b){
        function pointCollide(x,y) {
            
            if (x>=b.x && x<=(b.x+b.width) && y>=b.y && y<=(b.y+b.height)) { 
                return true;
            }
        }
        return pointCollide(a.x,a.y) || pointCollide(a.x+a.width,a.y) || pointCollide(a.x,a.y+a.height) || pointCollide(a.x+a.width,a.y+a.height);
        
        
    }
    
    
    
    function checkMute(){
        if (!keydown.m) {
            mDown = false;
        }
        if ((keydown.m && !mDown) || imgStore["muted"].clicked) {
            isMute = !isMute;
            mDown = true;
            imgStore["muted"].clicked = false;
        }
    }
    
    function checkI(){
        if (!keydown.i) {
            iDown = false;
        }
        if ((keydown.i && !iDown) || imgStore["i"].clicked) {
            iDown = true;
            changeGameState(4);
            imgStore["i"].clicked = false;
            imgStore["menu"].clicked = false;
        }
    }
    
    function checkMenu(){
        if (!keydown["backspace"]) {
            backDown = false;
        }
        if ((keydown["backspace"] && !backDown) || imgStore["menu"].clicked) {
            backDown = true;
            changeGameState(1);
            imgStore["menu"].clicked = false;
            imgStore["i"].clicked = false;
        }
    }
    
    var menuSelection = 1;
    
    function updateMenu() {
        if ((keydown.down) && menuSelection == 1) {
            menuSelection = 2;
        }
        
        if ((keydown.up) && menuSelection == 2) {
            menuSelection = 1;
        }
        checkMute();
        checkI();
    }
    
    function updateI() {
        checkMute();
        checkMenu()
    }
    
    
    function drawI(){
        
        canvas.fillStyle = "#000";
        canvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        

        imgStore.drawImage("menu");
        drawMute();
        imgStore.drawImage("settings");
        imgStore.drawImage("instructions");

        canvas.fillStyle = "#fff";
        canvas.textAlign = "center";
        canvas.font = "20px sans-serif";

    }
    
    function drawPause() {
        if (pauseGame){
            imgStore.drawImage("play");
        }
        else {
            imgStore.drawImage("pause");
        }
    };
    
    var isMute = false;
    
    function drawMute() {
        if (isMute){
            imgStore.drawImage("muted");
        }
        else {
            imgStore.drawImage("unmuted");
        }
    };
    
    function drawmenu() {
        canvas.fillStyle = "#000";
        canvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        

        imgStore.drawImage("i");
        drawMute();
        imgStore.drawImage("settings");


        canvas.fillStyle = "#fff";
        canvas.textAlign = "center";
        canvas.font = "bold 30px sans-serif";
        imgStore.drawImage("1player");
        imgStore.drawImage("2player");
        
        canvas.fillText(">", CANVAS_WIDTH/2-140, CANVAS_HEIGHT/2+menuSelection*200-300);
        
    }
    
    function drawWin() {
        draw();
        
        var winMessage = "YOU WIN";
        if (score1.score < score2.score) {
            winMessage = "YOU LOSE";
        }
        
        canvas.fillStyle = "#fff";
        canvas.textAlign = "center";
        canvas.font = "bold 100px sans-serif";
        canvas.fillText(winMessage, CANVAS_WIDTH/2, CANVAS_HEIGHT/2-50);
        canvas.font = "20px sans-serif";
        canvas.fillText("(Press space to continue)", CANVAS_WIDTH/2, CANVAS_HEIGHT/2+100);
        
    }


    function draw() {
        var n;
        var linewidth = 4
        var lineheight = 8
        canvas.fillStyle = "#000";
        canvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        for (n=0; n<31; n++) {
            canvas.fillStyle = "#fff";
            canvas.fillRect((CANVAS_WIDTH/2)-(linewidth/2), topoff+lineheight+(n*2*lineheight), linewidth, lineheight);
        }
        imgStore.drawImage("reset");
        imgStore.drawImage("inMenu");
        drawPause();
        drawMute();    
        player2.draw();
        player.draw();
        ball.draw();                                                                                                                                                                                                                 
        score1.draw();
        score2.draw();
        
    //  console.log(keydown);
    }
    
    var gameState = 1;
    
    function changeGameState(newState){
        gameState = newState;
        
        console.log("Change State " + newState);
        //pauseGame = false;
    }
    
    var spaceDown = false;

    
    setInterval( function() {
        
        if (gameState == 1) {
                 
            updateMenu();         
            drawmenu();
            
            if (!keydown.space && !keydown["return"]) {
                spaceDown = false;
            }
            if ((keydown.space || keydown["return"]) && !spaceDown) {
                changeGameState(2);
                score1.reset();
                score2.reset();
                ball.vx=0; 
                ball.vy=0;
                ball.x = CANVAS_WIDTH/2-(4);
                ball.y = 200;
                setTimeout(function(){
                    ball.newMotion((Math.floor(Math.random()*(12))*10)+30, ballSpeed);
                }, 1000);
                //ball.newMotion(30, ballSpeed);
                lastTime = new Date().getTime();
            }            
        }
        
        if (gameState == 4) {
            drawI();
            updateI();

        }
        
        if (gameState == 2) {
            if (!pauseGame){
                update();
            } else {
            
                pExemptUpdate();
            }
            
            draw();
            
            if (keydown["backspace"] || imgStore["inMenu"].clicked) {
                changeGameState(1);
                imgStore["inMenu"].clicked = false;
                
            }
            
            if (score1.score >= 5 || score2.score >= 5) {
                changeGameState(3);
            }
        }
        
        if (gameState == 3) {
            if (keydown.space) {
                changeGameState(1);
                spaceDown = true;
                
            }
            drawWin();
            
        }
        
        
    }, 1000/FPS);
    
}

