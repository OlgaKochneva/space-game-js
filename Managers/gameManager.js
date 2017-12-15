class gameManager {
    constructor() {
        this.factory = {};
        this.entities = [];
        this.player = null;
        this.laterKill = [];
        this.playing=0;
        this.name="Unknown";
        this.enemieskilled=0;
        this.asteroidsbroke=0;
    }

    initPlayer(obj) {
        this.player = obj;
    }

    kill(obj) {
        this.laterKill.push(obj);
    }

    killEverything(){
        this.entities = [];
        gm.player = null;
    }

    draw(ctx) {
        for (let e = 0; e < this.entities.length; e++)
            this.entities[e].draw(ctx);
    }

    update() {
       if (this.player === null)
            return;
        this.player.move_y = 0;
        this.player.move_x = 0;
        if (em.action["up"]) this.player.move_y = -1;
        if (em.action["left"]) this.player.move_x = -1;
        if (em.action["right"]) this.player.move_x = 1;
        if (em.action["fire"]) this.player.fire();
        for(let entity of this.entities) {
            try {
                entity.update();
            }
            catch (ex) {
                console.log("error updating " + entity.name +" error is: " + ex);
            }
        }

        for (let i = 0; i < this.laterKill.length; i++) {
            let idx = this.entities.indexOf(this.laterKill[i]);
            if (idx > -1)
                this.entities.splice(idx, 1);
        }
        if (this.laterKill.length > 0)
            this.laterKill.length = 0;
        mm.draw(ctx);
        if(gm.player!==null)
          mm.centerAt(this.player.pos_x, this.player.pos_y);

        this.draw(ctx);
    }

    loadAll(levelToLoad) {

        mm = null;
        gm = null;
        sm = null;
        em = null;
        pm = null;

        mm = new mapManager();
        gm = new gameManager();
        sm = new spriteManager();
        em = new eventManager();
        pm = new physicsManager();

        gm.factory['Player'] = Player;
        gm.factory['Enemies'] = Enemies;
        gm.factory['Bubble'] = Bubble;
        gm.factory['Asteroids'] = Asteroids;

        sm.loadAtlas("obj.json", "./objects/obj.png");
        em.setup(canvas);
        let mapToLoad = lm.chooseMap(levelToLoad);
        gm.playing = null;
        mm.loadMap(mapToLoad);
        mm.parseEntities();
        mm.draw(ctx);
        gm.play();
    }
    play(){
        gm.playing=setInterval(gm.updateWorld, 100);
    }
    updateWorld(){
        gm.update();
    }
}