function confirmInput(){
    document.getElementById("selector").style.display = "none";
    document.getElementById("canvasid").style.display = "block";
    gm.player.nickname = document.getElementById("nickname").value;
}

function restart(){
    clearInterval(gm.playing);
    document.getElementById("deadScreen").style.display = "none";
    document.getElementById("selector").style.display = "block";
    gm.loadAll(lm.currentLevel);
}