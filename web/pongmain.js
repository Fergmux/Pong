
$(function() {
    window.keydown = {};
  
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

    var canvasElement = $("<canvas class='box' width='" + CANVAS_WIDTH + 
        "' height='" + CANVAS_HEIGHT + "'></canvas>");
    var canvas = canvasElement.get(0).getContext("2d");
    canvasElement.appendTo('#canvascont');
    
    var FPS = 300;
  
    var scorx
  
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
    //console.log(this.x);
        
    };
  
    var digit = function () {
        var segments = [];
        var offx;
        var offy;
        var wi;
        var hi;
        var value = 0;
        for (var i = 0;i < 7; i++) {
            segments.push(new rect());
        }
        this.off = function(newx, newy, newwi, newhi) {
            offx = newx;
            offy = newy;
            wi = newwi
            hi = newhi
        
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
  
    score = function (doff) {
        this.score = 0,
        this.inc = function () {
            this.score +=1;
            
            this.digit1.setVal(this.score % 10);
            var highDigit = Math.floor(this.score / 10);
            this.digit2.setVal(highDigit);
            
        }
        this.draw = function() {
            this.digit1.draw();
            if (this.score > 9) {
                this.digit2.draw();
            }
            
        // console.log(this.score);
        }
        
        this.digit1 = new digit ();
        this.digit2 = new digit ();
        
        this.digit1.off(92 + doff, 112, 32, 8);
        this.digit2.off(doff, 112, 32, 8);
        
    }
    
    var score1 = new score(509);
    var score2 = new score(125);

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
        newMotion: function (angle, speed) {
            if (angle>180) {
                angle=angle-360;
            }
            this.angle=angle;
            var rads = angle*(Math.PI/180);
            this.speed=speed;
            this.vx=Math.sin(rads)*this.speed;
            this.vy=Math.cos(rads)*this.speed;
        },
        revx: function () {
            this.vx=0-this.vx;
            this.angle = 0-this.angle;
            console.log(this.angle);
        },
        revy: function () {
            this.vy=0-this.vy;
            if (this.angle>=0) {
                this.angle=180-this.angle;
            }
            else {
                this.angle = 0-180-this.angle;
            }
            console.log("after bounce angle --- "+this.angle);
        }
    };
    
    //ball.newMotion((Math.floor(Math.random()*(12))*10)+30, ballSpeed);
    ball.newMotion(30, ballSpeed);


    

    
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
    
    
    var lastTime = new Date().getTime();
    
    function update() {
        
        var  thisTime = new Date().getTime();
        var timeDelta = (thisTime-lastTime)/1000;
        var padOffset = padSpeed*timeDelta;
        lastTime = thisTime;
        
        //       if (keydown.left) {
        //         player.x -= 5;
        //   }

        //        if (keydown.right) {
        //          player.x += 5;
        //    }
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
        if (keydown.s) {
            player2.y += padOffset;
        }

        if (keydown.w) {
            player2.y -= padOffset;
        }
        
        /*      if ((player.orient == "v") && (keydown.h)) {
            player.width = player.vheight;
            player.height = player.vwidth;
            player.x -= (player.vheight/5)*2;
            player.y += (player.vheight/5)*2;
            player.orient="h";
    }
      
        
        if ((player.orient == "h") && (keydown.j)) {
            player.width = player.vwidth;
            player.height = player.vheight; 
            player.x += (player.vheight/5)*2;
            player.y -= (player.vheight/5)*2;
            player.orient="v"
        }
    */  
    
        
        player.x = player.x.clamp(0, CANVAS_WIDTH - player.width);
        player.y = player.y.clamp(topoff, CANVAS_HEIGHT- player.height-bottomoff);
            
        player2.x = player2.x.clamp(0, CANVAS_WIDTH - player2.width);
        player2.y = player2.y.clamp(topoff, CANVAS_HEIGHT- player2.height-bottomoff);
           
           
        ball.update(timeDelta);
        
        if (collide(ball,player)) {
            ball.x = player.x-ball.width;
            Sound.play("paddle_hit");
            spin (player);
        }
        
           
        if (collide(ball,player2)) {
            ball.x = player2.x+player2.width;
            Sound.play("paddle_hit");
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
            Sound.play("wall_hit");
            
        }
        else if (ball.y<topoff) {
            ball.revy();
            ball.y=topoff;
            Sound.play("wall_hit");
            
            
        }
        
        if(ball.x>CANVAS_WIDTH-ball.width) {
            ball.vx=0; 
            ball.vy=0;
            ball.x=CANVAS_WIDTH/2-(ball.width/2)
            Sound.play("score");
            score2.inc();
            setTimeout(function(){
                ball.newMotion((Math.floor(Math.random()*(12))*10)+30, ballSpeed);
            }, 1000);
            console.log(score2.score + "--- " + score1.score);
        }
        else if (ball.x<0) {
            ball.vx=0; 
            ball.vy=0;
            ball.x=CANVAS_WIDTH/2-(ball.width/2)
            Sound.play("score");
            score1.inc();
            setTimeout(function(){
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
    
    function draw() {
        var n;
        var linewidth = 4
        var lineheight = 8
        canvas.fillStyle = "#000";
        canvas.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        for (n=0;n<31; n++) {
            canvas.fillStyle = "#fff";
            canvas.fillRect((CANVAS_WIDTH/2)-(linewidth/2), topoff+lineheight+(n*2*lineheight), linewidth, lineheight);
        }
            
        player2.draw();
        player.draw();
        ball.draw();                                                                                                                                                                                                                 
        score1.draw();
        score2.draw();
        
    //  console.log(keydown);
    }
    setInterval(function() {
        update();
        draw();
    }, 1000/FPS);
  
}
