class mapManager {
    constructor() {
        this.mapData = null;//для хранения карты
        this.tLayer = null;//ссылки на блоки карты
        this.xCount = 0;//кол-во блоков по горизонтали
        this.yCount = 0;//кол-во блоков по вертикали
        this.tSize = {x: 32, y: 32};//размер блока
        this.mapSize = {x: 32, y: 32};//размер карты-вычислется
        this.tilesets = new Array();//описания блоков карты
        this.imgLoadCount = 0;//кол-во загруженных изображений
        this.imgLoaded = false;//все изображения загружены
        this.jsonLoaded = false;//json описание загружено
        this.view={x:0, y:0,w:480, h:650}//видимая область с координатами верхнего левого угла
    }

    loadMap(path) {

        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                mm.parseMap(request.responseText);//загружаем карту
            }

        };
        request.open("GET", path, true);
        request.send();
    }

    parseMap(tilesJSON) {

        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;//ширина карты
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;//ширина одного тайла
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;

        for (let i = 0; i < this.mapData.tilesets.length; i++) {
            let img = new Image();//переменная для хранения изображений
            img.onload = function () {
                mm.imgLoadCount++;//чтобы не грузить карту пока все изображения не загружены
                if (mm.imgLoadCount === mm.mapData.tilesets.length) {
                    mm.imgLoaded = true;
                }
            };
            img.src = this.mapData.tilesets[i].image;//путь к изображению
            let t = this.mapData.tilesets[i];
            let ts = {
                firstgid: t.firstgid, image: img, name: t.name, xCount: Math.floor(t.imagewidth / this.tSize.x),
                yCount: Math.floor(t.imageheight / this.tSize.y)
            };
            this.tilesets.push(ts);//массив описаний блоков карты
        }
        mm.jsonLoaded = true;
    }

    draw(ctx) {//отображение карты на холсте
        if (!mm.imgLoaded || !mm.jsonLoaded) {//проверка все ли успело подгрузиться
            setTimeout(() => {mm.draw(ctx);}, 100);
        }
        else {
            if (this.tLayer === null)
                for (let id = 0; id < this.mapData.layers.length; id++) {//цикл по массиву слоев mapdata
                    let layer = this.mapData.layers[id];//получаем объект блока
                    if (layer.type === "tilelayer") {//если данный слой является слоем блоков карты
                        this.tLayer = layer;//указатель на слой
                        break;
                    }
                }
            for (let i = 0; i < this.tLayer.data.length; i++) {//по всем данным отображаемым на карте
                if (this.tLayer.data[i] !== 0) {
                    let tile = this.getTile(this.tLayer.data[i]);
                    let pX = (i % this.xCount) * this.tSize.x;//координаты блока в пикселях
                    let pY = Math.floor(i / this.xCount) * this.tSize.y;
                    if(!this.isVisible(pX,pY,this.tSize.x,this.tSize.y))//не рисуем за пределами видимой зоны
                        continue;
                    pX -= this.view.x;//сдвигаем видимую зону
                    pY -= this.view.y;//сдвигаем видимую зону
                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX,pY,this.tSize.x, this.tSize.y);//отображение блока
                }
            }
        }
    }

    getTile(tileIndex) {
        let tile = {
            img: null, px: 0, py: 0//координаты блока
        };
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;//изображение искомого tile
        let id = tileIndex - tileset.firstgid;//индекс блока
        let x = id % tileset.xCount;
        let y = Math.floor(id / tileset.xCount);
        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;
        return tile;
    }

    getTileset(tileIndex) {//получение блока по индексу
        for (let i = this.tilesets.length - 1; i >= 0; i--)
            if (this.tilesets[i].firstgid <= tileIndex) {
                return this.tilesets[i];
            }
        return null;
    }

    isVisible(x, y, width, height){//проверка видимости
        if(x+width<this.view.x||y+height<this.view.y||x>this.view.x+this.view.w||y>this.view.y+this.view.h)
            return false;
        return true;
    }

    parseEntities(){
        if(!mm.imgLoaded||!mm.jsonLoaded){
            setTimeout(function (){mm.parseEntities();},100);
            }else
                for(let j=0;j<this.mapData.layers.length;j++)//просмотр всех слоев
                    if(this.mapData.layers[j].type==='objectgroup'){//разбираем именно слой с объектами
            let entities = this.mapData.layers[j];
            for(let i=0;i<entities.objects.length;i++){
                let e=entities.objects[i];
                if(e.name==="Player")
                {
                    let obj = null;
                    obj = new Player();
                    console.log(e.name);
                    obj.pos_x = e.x;
                    obj.pos_y = e.y;
                    obj.size_x = e.width;
                    obj.size_y = e.height;
                    gm.entities.push(obj);
                    gm.initPlayer(obj);//кем управлять будем
                }
                if(e.name==="Bubble"){
                    let obj = null;
                    obj = new Bubble();
                    console.log(e.name);
                    obj.pos_x = e.x;
                    obj.pos_y = e.y;
                    obj.size_x = e.width;
                    obj.size_y = e.height;
                    gm.entities.push(obj);
                }

                if(e.name==="Asteroids"){
                    let obj = null;
                    obj = new Asteroids();
                    console.log(e.name);
                    obj.pos_x = e.x;
                    obj.pos_y = e.y;
                    obj.size_x = e.width;
                    obj.size_y = e.height;
                    gm.entities.push(obj);
                }

                if(e.name==="Enemies"){
                    let obj = null;
                    obj = new Enemies();
                    console.log(e.name);
                    obj.pos_x = e.x;
                    obj.pos_y = e.y;
                    obj.size_x = e.width;
                    obj.size_y = e.height;
                    gm.entities.push(obj);
                }
           }
        }
    }

    getTilesetIdx(x,y){//получить индекс блока в массиве data по координатам блока
        let wX = x;
        let wY = y;
        let idx = Math.floor(wY/this.tSize.y) * this.xCount + Math.floor(wX/this.tSize.x);
        return this.tLayer.data[idx];
    }

    centerAt(x, y){//центрирование области менеджера
        if(x<this.view.w/2)
            this.view.x=0;
        else
            if(x>this.mapSize.x-this.view.w/2)
                this.view.x=this.mapSize.x-this.view.w;
        else
            this.view.x=x-(this.view.w/2);
        if(y<this.view.h/1.1)
            this.view.y=0;
        else
            if(y>this.mapSize.y-this.view.h/10)
                this.view.y=this.mapSize.y-this.view.h;
        else
            this.view.y=y-(this.view.h/1.1)
    }


}