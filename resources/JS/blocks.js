const colors = ['#fcba03','#fc3103','#f8fc03','#adfc03',
                '#03fc03','#03ebfc','#0367fc','#6203fc',
                '#ce03fc','#fc039d','#800040'];

export class Block {
    constructor (params,position,color){
        this.color = color;
        this.gameWidht = params.gameWidht;
        this.gameHeigth = params.gameHeigth;
        this.gameUnit = params.gameUnit;
        this.speed = params.gameSpeed;
        this.defaultSpeed = params.gameSpeed;
        this.maxSpeed = params.maxSpeed;
        this.xSpeed = this.gameUnit;
        this.position = position;
        this.enableRight = true;
        this.enableLeft = true;
        this.type = 'block';
        this.body = [position,
                     {x:this.position.x + this.gameUnit, y:this.position.y},
                     {x:this.position.x, y:this.position.y  + this.gameUnit},
                     {x:this.position.x  + this.gameUnit, y:this.position.y  + this.gameUnit}]

        this.bodyCoor = [{x:0,y:0},{x:0,y:0},{x:0,y:0},{x:0,y:0}]; 
        this.orientation = 'None'   
    }

    drawUnit(unit,context){
        context.fillStyle = this.color;
        context.fillRect(
            unit.x,
            unit.y,
            this.gameUnit,
            this.gameUnit
            );
    }
    draw (context){
        

        for(let i = 0; i<4;i++){
            this.drawUnit(this.body[i],context);
        }

    }
    
    update(){
     
        for (let i= 0;i<4;i++){
            this.body[i].y+=this.speed;
        }

        for (let i = 0; i<4; i++){
            this.bodyCoor[i].x = Math.floor(this.body[i].x / this.gameUnit);
            this.bodyCoor[i].y = Math.floor(this.body[i].y / this.gameUnit);
        }


    }

    moveLeft(){

        if (this.enableLeft){
            for (let i= 0;i<4;i++){
                if (this.body[i].x - this.gameUnit< 0){
                    this.lockLeft();
                    break;
                }else{
                    this.unlockLeft();
                }
            }
        }

        if (this.enableLeft){
            for (let i= 0;i<4;i++){
                this.body[i].x-=this.gameUnit;
            }
        }

    }

    moveRight(){
        this.unlockLeft();
        if(this.enableRight){
            for (let i= 0;i<4;i++){
                if ((this.body[i].x + 2*this.gameUnit) > this.gameWidht){
                    this.lockRight();
                    break;

                }
                else{
                    this.unlockRight();
                }
            }
        }

        if (this.enableRight){
            for (let i= 0;i<4;i++){
                this.body[i].x+=this.gameUnit;
            }
        }
    }

    increaseSpeed(){
        this.speed = 15;
    }

    restoreSpeed(){
        this.speed = this.defaultSpeed;
    }

    collisionDetection = (game)=>{
        for(let i=0; i<4;i++){
            if(this.bodyCoor[i].y < 1){
                if (game.gameMatrix[this.bodyCoor[i].x][this.bodyCoor[i].y] !== game.bgColor){
                    game.state.gameOver(game);
                    break;
                }
            }
        }

        for(let i=0; i<4;i++){
            if(this.bodyCoor[i].y + 1 === (this.gameHeigth / this.gameUnit)){
                game.state.updateMatrix(this,game);
                break;
            }
        }

        
        for(let i=0; i<4;i++){
            if(game.gameMatrix[this.bodyCoor[i].x][this.bodyCoor[i].y + 1] !== game.bgColor){
                game.state.updateMatrix(this,game);
                break;
            }
        }
    
    }

    lockRight(){
        this.enableRight = false;
    }

    lockLeft(){
        this.enableLeft =  false;
    }

    unlockRight(){
        this.enableRight = true;
    }

    unlockLeft(){
        this.enableLeft =  true;
    }

}

export class Stick extends Block{
    constructor(params,position,color){
        super(params,position,color);
        this.type = 'stick';
        this.body = [position,
            {x:this.position.x , y:this.position.y + this.gameUnit},
            {x:this.position.x, y:this.position.y  + 2*this.gameUnit},
            {x:this.position.x, y:this.position.y  + 3*this.gameUnit}]
        
        this.orientation = 'down';

    }

    rotate(){
        
        let pivot = this.body[1];

        if (pivot.x === 0){

            pivot.x += this.gameUnit;
        }

        if (pivot.x === (this.gameWidht-this.gameUnit)){

            pivot.x -= 2*this.gameUnit;
        }

        if (pivot.x === (this.gameWidht-2*this.gameUnit)){

            pivot.x -= this.gameUnit;
        }

        switch(this.orientation){
            case('down'):
                this.body = [{x:pivot.x - this.gameUnit , y:pivot.y},
                             pivot,{x:pivot.x + this.gameUnit, y:pivot.y},
                             {x:pivot.x +2*this.gameUnit ,y:pivot.y}];
                this.orientation = 'right';
                break;
            case('right'):
                this.body = [{x:pivot.x ,y:pivot.y - this.gameUnit},pivot,
                                {x:pivot.x ,y:pivot.y + this.gameUnit},
                                {x:pivot.x ,y:pivot.y + this.gameUnit*2}];
                this.orientation = 'down';
                this.unlockLeft()
                break;
        }

    }
}   

export class Lstick extends Block{
    constructor(params,position,color){
        super(params,position,color);
        this.type = 'L_stick';
        this.body = [position,
            {x:this.position.x , y:this.position.y + this.gameUnit},
            {x:this.position.x + this.gameUnit, y:this.position.y  + this.gameUnit},
            {x:this.position.x + 2*this.gameUnit, y:this.position.y  + this.gameUnit}]
        
        this.orientation = 'right';

    }

    rotate(){

        let pivot = this.body[1];

        switch(this.orientation){
            case('right'):
                this.body = [{x:pivot.x + this.gameUnit ,y:pivot.y},
                             pivot,{x:pivot.x,y:pivot.y+this.gameUnit},
                             {x:pivot.x,y:pivot.y+2*this.gameUnit}];
                this.orientation = 'down';
                break;
            case('down'):
                if (pivot.x === this.gameUnit){
                    pivot.x += this.gameUnit;
                }
                if (pivot.x === 0){
                    pivot.x += 2*this.gameUnit;
                }
                this.body = [{x:pivot.x,y:pivot.y + this.gameUnit},pivot,
                                {x:pivot.x-this.gameUnit,y:pivot.y},
                                {x:pivot.x-this.gameUnit*2,y:pivot.y}];
                this.orientation = 'left';
               
                break;
            case('left'):
                this.body = [{x:pivot.x - this.gameUnit,y:pivot.y + 2*this.gameUnit},pivot,
                                {x:pivot.x,y:pivot.y + this.gameUnit},
                                {x:pivot.x,y:pivot.y + 2*this.gameUnit}];
                this.orientation = 'up';
                break;
            case('up'):
                    pivot = this.body[2]; 
                    if (pivot.x === (this.gameWidht - this.gameUnit)){
                        pivot.x -= 2*this.gameUnit;
                    }
                    if (pivot.x === (this.gameWidht - 2*this.gameUnit)){
                        pivot.x -= this.gameUnit;
                    }

                    this.body = [pivot,
                        {x:pivot.x , y:pivot.y + this.gameUnit},
                        {x:pivot.x + this.gameUnit, y:pivot.y  + this.gameUnit},
                        {x:pivot.x + 2*this.gameUnit, y:pivot.y  + this.gameUnit}]
                this.unlockLeft();
                this.orientation = 'right';
                break;
        }

    }
    
}

export class Tstick extends Block{
    constructor(params,position,color){
        super(params,position,color);
        this.type = 'T_stick';
        this.body = [position,
            {x:this.position.x + this.gameUnit, y:this.position.y},
            {x:this.position.x + 2*this.gameUnit, y:this.position.y  },
            {x:this.position.x + this.gameUnit, y:this.position.y  + this.gameUnit}]
        
            this.orientation = 'down';

    }

    rotate(){

        let pivot = this.body[1];
    
        switch(this.orientation){
            case('right'):
                pivot.x+=this.gameUnit;
                this.body = [{x:pivot.x  + this.gameUnit, y:pivot.y},
                    pivot,
                    {x:pivot.x - this.gameUnit, y:pivot.y },
                    {x:pivot.x , y:pivot.y + this.gameUnit}];
                this.orientation = 'down';
                break;
            case('down'):
                pivot.y+= this.gameUnit;

                this.body = [{x:pivot.x - this.gameUnit, y:pivot.y},
                    {x:pivot.x, y:pivot.y - this.gameUnit},
                    pivot,
                    {x:pivot.x, y:pivot.y + this.gameUnit}];
                this.orientation = 'left';
                break;
            case('left'):
                pivot.y+= 2*this.gameUnit;    
                if(pivot.x === this.gameWidht - this.gameUnit){
                    pivot.x-= this.gameUnit;
                }
                this.body = [{x:pivot.x  + this.gameUnit, y:pivot.y},
                    pivot,
                    {x:pivot.x - this.gameUnit, y:pivot.y },
                    {x:pivot.x , y:pivot.y - this.gameUnit}];
                this.orientation = 'up';
            
                break;
            case('up'):
                
                pivot.x-= this.gameUnit;
                this.body = [{x:pivot.x + this.gameUnit, y:pivot.y},
                    {x:pivot.x, y:pivot.y - this.gameUnit},
                    pivot,
                    {x:pivot.x, y:pivot.y + this.gameUnit}];

                this.orientation = 'right';
                break;
                
        }

    }
    
}

export class Rstick extends Block{
    constructor(params,position,color){
        super(params,position,color);
        this.type = 'r_stick';
        this.body = [position,
            {x:this.position.x , y:this.position.y + this.gameUnit},
            {x:this.position.x + this.gameUnit, y:this.position.y },
            {x:this.position.x + 2*this.gameUnit, y:this.position.y}]
        
        this.orientation = 'right';

    }

    rotate(){

        let pivot = this.body[1];
    
        switch(this.orientation){
            case('right'):
                pivot.x+=this.gameUnit;
                this.body = [{x:pivot.x -this.gameUnit  ,y:pivot.y},
                             pivot,{x:pivot.x,y:pivot.y+this.gameUnit},
                             {x:pivot.x,y:pivot.y+2*this.gameUnit}];
                this.orientation = 'down';
                break;
            case('down'):
                pivot.y+= this.gameUnit;
                if (pivot.x === this.gameUnit){
                    pivot.x += this.gameUnit;
                }
                this.body = [{x:pivot.x,y:pivot.y - this.gameUnit},pivot,
                                {x:pivot.x-this.gameUnit,y:pivot.y},
                                {x:pivot.x-2*this.gameUnit,y:pivot.y}];
                this.orientation = 'left';
                this.unlockLeft();
                break;
            case('left'):
                pivot = this.body[2];
                this.body = [{x:pivot.x + this.gameUnit, y:pivot.y + this.gameUnit},
                            {x:pivot.x, y:pivot.y + this.gameUnit},
                            pivot,
                            {x:pivot.x, y:pivot.y - this.gameUnit}];
                this.orientation = 'up';
                this.unlockLeft();
                break;
            case('up'):
                
                if (pivot.x === this.gameWidht - this.gameUnit*2){
                    pivot.x -= this.gameUnit;
                }
                
                this.body = [{x:pivot.x,y:pivot.y + this.gameUnit},
                            pivot,{x:pivot.x +this.gameUnit,y:pivot.y},
                            {x:pivot.x +2*this.gameUnit,y:pivot.y}];

                this.orientation = 'right';
                break;
                
        }

    }
    
}

export const blockFactory = (params)=>{
    let choice = Math.floor(Math.random()*5);
    let color = colors[Math.floor(Math.random()*colors.length)];
    let position;

    //choice = 4;

    switch(choice){
        case 0:
            position =  {
                x:Math.floor(Math.random()*(params.gameWidht/params.gameUnit-1))*params.gameUnit,
                y:0
            };
            return new Block(params,position,color);
        case 1:
            position =  {
                x:Math.floor(Math.random()*(params.gameWidht/params.gameUnit-1))*params.gameUnit,
                y:0
            };
            return new Stick(params,position,color);
        case 2:
            position =  {
                x:Math.floor(Math.random()*(params.gameWidht/params.gameUnit-2))*params.gameUnit,
                y:0
            };
            return new Lstick(params,position,color);
        case 3:
            position =  {
                x:Math.floor(Math.random()*(params.gameWidht/params.gameUnit-2))*params.gameUnit,
                y:0
            };
            return new Rstick(params,position,color);
        case 4:
            position =  {
                x:Math.floor(Math.random()*(params.gameWidht/params.gameUnit-2))*params.gameUnit,
                y:0
            };
            return new Tstick(params,position,color);
    }
    
}