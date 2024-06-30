class physicsManager{
    constructor(){}
    update(obj){
        if(obj.move_x===0&&obj.move_y===0)
            return "stop";
        let newX=obj.pos_x+Math.floor(obj.move_x*obj.speed);
        let newY=obj.pos_y+Math.floor(obj.move_y*obj.speed);
        if(newY<mm.view.y+32||newY>mm.view.y-mm.size_y)//удаляем объекты за пределами карты
           obj.kill();
        let ts =mm.getTilesetIdx(newX+obj.size_x/2, newY+obj.size_y/2)
        if(newX<0||(newX+obj.size_x)>mm.mapSize.x||newY<0)
            return "break"
        let e = this.entityAtXY(obj, newX, newY);
        if(e!==null&&obj.onTouchEnity)
           obj.onTouchEnity(e);

       if((ts===1||ts===10||ts===13)&&obj.onTouchMap)
            obj.onTouchMap(ts);
            obj.pos_x=newX;
            obj.pos_y=newY;
        return "move";
    }

    entityAtXY(obj, x, y){
        for(let i=0;i < gm.entities.length;i++){
            let e = gm.entities[i];
            if(e.name!==obj.name){
                if(x+obj.size_x<e.pos_x||y+obj.size_y<e.pos_y||x>e.pos_x+e.size_x||y>e.pos_y+e.size_y)
                    continue;
                return e;//найден объект
            }
        }
        return null;
    }
}