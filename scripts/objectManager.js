class Entity {
    constructor() {
        this.pos_x = 0;//расположение(координаты)
        this.pos_y = 0;
        this.size_x = 0;//размеры
        this.size_y = 0;
    }

}

class Player extends Entity {
    constructor() {
        super();
        this.name = "Player";
        this.move_x = 0;//направление движения
        this.move_y = 0;
        this.hp = 100;//жизни
        this.speed = 15;//скорость
        this.count = 10;
        this.bubble = false;
        this.bubble_h = 100;
        this.SpotRadius = 300;
    }

    kill() {//уничтожение объекта
        gm.kill(this);
    }

    draw(ctx) {//прорисовка объекта
        if (this.bubble) sm.drawSprite(ctx, "Spaceship_field.png", this.pos_x, this.pos_y);
        else sm.drawSprite(ctx, "Spaceship.png", this.pos_x, this.pos_y);
    }

    update() {//обновление в цикле
        if (this.hp <= 0) {
            lm.deadScreen();
            sM.play('sounds/mix3.mp3', {volume: 0.3, looping: false});
            gm.killEverything();
        }
        else
            pm.update(this);
    }

    fire() {//выстрел
        if (this.count !== 0) {
            sM.play('sounds/miss1.mp3', {volume: 0.3, looping: false});

            let r = new ping1();
            r.size_x = 32;
            r.size_y = 32;
            r.name = "ping1";
            r.pos_x = this.pos_x;
            r.pos_y = this.pos_y - this.size_y;
            gm.entities.push(r);
            this.count--;//перезарядка
        }
        else {
            setTimeout(() => {
                this.count = 10;
            }, 1000);
        }
    }

    onTouchEnity(obj) {
        if (obj.name == 'Bubble') {
            if(this.bubble==true)this.bubble_h=100;
            this.bubble = true;
            this.draw(ctx);
            sM.play('sounds/boomer5.mp3', {volume: 1, looping: false});
            obj.kill();
        }
    }

    onTouchMap(idx) {
        if (idx === 13 || idx === 10) {
            lm.completeLevel();
        }
        else {
            if (this.bubble) this.bubble = false;
            else this.hp = 0;
        }
    }
}

class Enemies extends Entity {
    constructor() {
        super();
        this.name = "Enemies";
        this.move_x = 0;//направление движения
        this.move_y = 0;
        this.hp = 50;//жизни
        this.speed = 10;//скорость
        this.count = 1;
        this.attack = false;
        this.spotted = false;
        this.minSpotRadius = 300;
        this.SpotRadius = 400;
    }

    kill() {//уничтожение объекта
        gm.kill(this);
    }

    draw(ctx) {//прорисовка объекта
        sm.drawSprite(ctx, "enemyShip.png", this.pos_x, this.pos_y);
    }
    update() {//обновление в цикле
        let distanceToPlayer = gm.player.pos_y - this.pos_y;
        if (((distanceToPlayer < this.minSpotRadius) && distanceToPlayer > 0) || this.spotted === true) {
            if (gm.player.pos_x - this.pos_x > 0) {
                this.move_x = 1;
            }
            else {
                if (gm.player.pos_x == this.pos_x) this.move_x = 0;
                else this.move_x = -1;
            }
            if (distanceToPlayer < this.SpotRadius) this.fire();
        }
        pm.update(this);
    }

    fire() {//выстрел
        if (this.count !== 0) {
            sM.play('sounds/miss2.mp3', {volume: 0.2, looping: false});
            let p = new ping2();
            p.size_x = 32;
            p.size_y = 32;
            p.name = "ping2";
            p.pos_x = this.pos_x;
            p.pos_y = this.pos_y + this.size_y;
            gm.entities.push(p);
            this.draw(ctx);
            this.count--;//перезарядка
        }
        else {
            this.move_y = 0;
            setTimeout(() => {
                this.count = 1;
            }, 300);
        }
    }

    onTouchEnity(obj) {
        if (obj.name == 'Player') {
            if(!obj.bubble)
            obj.hp=0;
            else obj.bubble=false;
            this.kill();
        }
   }
    onTouchMap(idx) {}
}

class Asteroids extends Entity {

    constructor() {
        super();
        this.name = "Asteroids";
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 0;
        this.hp = 30;
        this.minSpotRadius = 300;
        this.SpotRadius = 400;
    }

    kill() {
        gm.kill(this);
    }

    draw(ctx) {
        sm.drawSprite(ctx, "asteroid.png", this.pos_x, this.pos_y);
    }

    update() {
        let distanceToPlayer = gm.player.pos_y - this.pos_y;
        if ((distanceToPlayer < this.minSpotRadius) && distanceToPlayer > 0) {
            this.move_y = 1;
            this.speed = 10 * lm.currentLevel;
        }
        pm.update(this);
    }

    onTouchEnity(obj) {
        if (obj.name == 'Player') {

            if (obj.bubble)obj.bubble = false;
            else obj.hp = 0;
        }
        this.kill();
    }

    onTouchMap(idx) {
        this.kill()
    }

}

class ping1 extends Entity {

    constructor() {
        super();
        this.name = "ping1";
        this.move_x = 0;
        this.move_y = -1;
        this.speed = 30;
    }

    kill() {
        gm.kill(this);
    }

    draw(ctx) {
        sm.drawSprite(ctx, "ping1.png", this.pos_x, this.pos_y);
    }

    update() {
        pm.update(this);
    }

    onTouchEnity(obj) {
        if (obj.name == 'Enemies') {
            let distanceToPlayer = gm.player.pos_y - this.pos_y;
            if (distanceToPlayer < obj.SpotRadius) {
                obj.hp -= 10;
                obj.spotted = true;
                console.log(obj.hp);
                if (obj.hp == 0) {
                    gm.enemieskilled += 1;
                    sM.play('sounds/mix3.mp3', {volume: 0.2, looping: false});
                    obj.kill();
                }
            }
            this.kill();
    }

        if (obj.name == 'Asteroids') {
            let distanceToPlayer = gm.player.pos_y - this.pos_y;
            if (distanceToPlayer < obj.SpotRadius) {
                obj.hp -= 10;
                console.log(obj.hp);
                if (obj.hp == 0) {
                    gm.asteroidsbroke += 1;
                    sM.play('sounds/mix3.mp3', {volume: 0.2, looping: false});
                    obj.kill();
                }
            }
            this.kill();
        }
   }

    onTouchMap(idx) {
        this.kill();
    }
}

class ping2 extends Entity {

    constructor() {
        super();
        this.name = "ping2";
        this.move_x = 0;
        this.move_y = 1;
        this.speed = 5 * lm.currentLevel;
    }

    kill() {
        gm.kill(this);
    }

    draw(ctx) {
        sm.drawSprite(ctx, "ping2.png", this.pos_x, this.pos_y);
    }

    update() {
        pm.update(this);
    }

    onTouchEnity(obj) {
        if (obj.name == 'Player') {

            let distanceToPlayer = gm.player.pos_y - this.pos_y;
            if (distanceToPlayer < obj.SpotRadius) {
                if (!obj.bubble)obj.hp -= 5;
                else {
                    obj.bubble_h -= 5;
                    if (obj.bubble_h == 0)
                        obj.bubble = false;
                }
            }
            this.kill();
        }
    }

    onTouchMap(idx) {
        this.kill();
    }
}

class Bubble extends Entity {
    constructor() {
        super();
        this.name = "Bubble";
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 0;
    }

    kill() {
        gm.kill(this);
    }

    draw(ctx) {
        sm.drawSprite(ctx, "bubble.png", this.pos_x, this.pos_y);
    }

    update() {
        pm.update(this);
    }

    onTouchEnity(obj) { }
}