class levelManager{
    constructor(){
        this.currentLevel = 1;
        this.levelScore = 0;
        this.totalScore = 0;
    }

    startNextLevel(){
        this.removeScoreCounter();
        lm.currentLevel++;
        pm.levelCompleted = false;
        gm.loadAll(lm.currentLevel);
        document.getElementById("success").style.display = "none";
        document.getElementById("canvasid").style.display ="block";
    }

    chooseMap(levelToLoad){
        let mapToLoad = null;
        switch (levelToLoad){
            case 1:
                mapToLoad = "level1.json";
                break;
            case 2:
                mapToLoad = "level2.json";
                break;
            default: mapToLoad = "level1.json";
        }
        return mapToLoad;
    }

    completeLevel(){
            clearInterval(gm.playing);
            lm.levelScore += gm.enemieskilled+gm.asteroidsbroke;
            lm.totalScore +=lm.levelScore;
            lm.successScreen();
    }

    getScoreCounter(){
        document.getElementById("success").innerHTML +=  "Score for this level : " + lm.levelScore + "<br>";
        document.getElementById("success").innerHTML +=  "Enemies killed :" +  gm.enemieskilled + '<br>';
        document.getElementById("success").innerHTML +=  "Asteroids broke :" +  gm.asteroidsbroke + '<br>';
        document.getElementById("success").innerHTML +=  "Total score:" + lm.totalScore + '<br>';
    }

    removeScoreCounter(){
        document.getElementById("success").innerHTML = "";
    }

    successScreen(){
        document.getElementById("canvasid").style.display = "none";
        document.getElementById("success").style.display = "block";
        this.getScoreCounter();
        gm.killEverything();
        if(lm.currentLevel==2)
            document.getElementById("success").innerHTML += "<button onclick ='lm.startNextLevel()'>" + "Restart" + "</button>";
        else
            document.getElementById("success").innerHTML += "<button onclick ='lm.startNextLevel()'>" + "Start next level" + "</button>";
    }

    deadScreen(){
        document.getElementById("canvasid").style.display = "none";
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        document.getElementById("deadScreen").style.display = "block";
    }
}