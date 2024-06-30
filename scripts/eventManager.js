class eventManager{
    constructor(){
        this.bind=[];
        this.action=[];
    }

    setup(canvas){
        this.bind[87] = 'up';
        this.bind[65] = 'left';
        this.bind[68] = 'right';
        this.bind[32] = 'fire';

        canvas.addEventListener("mousedown", this.onMouseDown);
        canvas.addEventListener("mouseup", this.onMouseUp);
        document.body.addEventListener("keydown", this.onKeyDown);
        document.body.addEventListener("keyup", this.onKeyUp);
    }

    onMouseDown(event) {
        em.action["fire"] = true;
    }
    onMouseUp(event){
        em.action["fire"]=false;
    }
     onKeyDown(event){
        let action = em.bind[event.keyCode];
        if(action)
            em.action[action]=true;
     }
    onKeyUp(event){
         let action = em.bind[event.keyCode];
         if(action)
             em.action[action]=false;

    }
}