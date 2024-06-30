class soundManager{
    constructor(){
        this.clips = {};//звуковые эффекты
        this.context = null;//аудиоконтекст
        this.gainNode = null;//главный узел
        this.loaded = false;//все звуки загружены

    }

    init(){
        this.context = new AudioContext();
        this.gainNode = this.context.createGain ?
            this.context.createGain() : this.context.createGainNode();
        this.gainNode.connect(this.context.destination);//подключение к динамикам
    }

    load(path,callback){
        if(this.clips[path]){
            callback(this.clips[path]);
            return;
        }
        let clip ={
            path : path,
            buffer : null,
            loaded : false
        };
        clip.play = function(volume,loop){
            sM.play(this.path, {looping: loop ? loop : false, volume : volume? volume : 1});
        };
        this.clips[path] = clip;
        let request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            sM.context.decodeAudioData(request.response,
                function(buffer) {
                    clip.buffer = buffer;
                    clip.loaded = true;
                    callback(clip);
                });
        };
        request.send();
    }

    loadArray(array){
        for(let i = 0; i< array.length; i++){
            sM.load(array[i], function(){
                if(array.length ===
                    Object.keys(sM.clips).length){
                    for(let sd in sM.clips)
                        if(!sM.clips[sd].loaded) return;
                    sM.loaded = true;
                }
            });
        }

    }

    play(path,settings){
        if(!sM.loaded){
            setTimeout(function(){sM.play(path,settings);},1000);
            return;
        }
        let looping = false;
        let volume = 1;
        if(settings){
            if(settings.looping)
                looping = settings.looping;
            if(settings.volume)
                volume = settings.volume;
        }
        let sd = this.clips[path];
        if(sd===null)
            return false;
        let sound = sM.context.createBufferSource();
        sound.buffer = sd.buffer;
        sound.connect(sM.gainNode);
        sound.loop = looping;
        sM.gainNode.gain.value = volume;
        sound.start(0);
        return true;
    }
}