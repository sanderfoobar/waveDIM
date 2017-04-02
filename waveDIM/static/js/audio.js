// Sander Ferdinand 2017

class AudioHelper {
    constructor(){
        this.audio_context = null;
        this.context = null;
        this.source = null;
        this.sourceJs = null;
        this.analyser = null;
        this.buffer = null;
        this.gainNode = null;
        this.audio_analyzer = null;
        this.audio_rangeSmoothing = null;
        this.audio_rangeWaveformHeight = null;
        this.audio_rangeWaveformWidth = null;
        this.audio_liveFreqData = null;
        this.audio_liveWaveformData = null;
        this.audio_isPlaying = null;
        this.audio_source = null;
        this.audioTag = null;

        var boost = 0;
        var array = [];
        var audio_autoplay = true;

        this.init();
    }

    init(){
        // Test Audio compatibility
        this.audio_context = window.AudioContext || window.webkitAudioContext;
        if (!this.audio_context) { alert("Your browser does not support the HTML5 Web Audio API.\nTry Google Chrome or a newer Firefox"); }

        this.audio_context = new AudioContext();
        this.audio_context.crossOrigin = "anonymous";
        this.audioTag = null;

        this.audio_rangeSmoothing = 0.025;
        this.audio_rangeWaveformHeight = 0;
        this.audio_rangeWaveformWidth = 10;

        this.gainNode = this.audio_context.createGain();
        this.gainNode.connect(this.audio_context.destination);

        this.audio_analyzer = this.audio_context.createAnalyser();
        this.audio_analyzer.connect(this.gainNode);
        this.audio_analyzer.smoothingTimeConstant = 0.6;
        this.audio_analyzer.fftSize = 512;
        //this.audio_rangeSmoothing.value = this.audio_analyzer.smoothingTimeConstant;

        this.audio_liveNumSamples = this.audio_analyzer.frequencyBinCount;
        this.audio_liveFreqData = new Float32Array(this.audio_analyzer.frequencyBinCount);
        this.audio_liveWaveformData = new Uint8Array(this.audio_analyzer.frequencyBinCount);
        this.audio_isPlaying = false;
    }

    start_stream(stream_url, stream_id) {
        this.stop();

        this.audioTag = new Audio();
        this.audioTag.addEventListener('error', this.handleStreamEnded.bind(this), false);
        this.audioTag.addEventListener('ended', this.handleStreamEnded.bind(this), false);
        this.audioTag.src = stream_url;
        this.audioTag.id = stream_id;
        this.audioTag.play();

        this.audio_isPlaying = true;

        setTimeout(function() {
            this.audio_source = this.audio_context.createMediaElementSource(this.audioTag);
            this.audio_source.connect(this.audio_analyzer);
        }.bind(this), 0);
    }

    stop() {
        if (this.audio_source) {
            this.audio_source.disconnect(0);
            this.audio_source = null;
        }
        if (this.audioTag && this.audioTag !== true) {
            this.audioTag.removeEventListener('error', this.handleStreamEnded);
            this.audioTag.removeEventListener('ended', this.handleStreamEnded);
            this.audioTag.pause();

            this.audioTag.src = '';
            this.audioTag.load();
            this.audioTag = null;
        }

        this.audio_isPlaying = false;
    }

    handleStreamEnded(event) {
        // setTimeout(function () {
        //     if (this.audio_isPlaying) {
        //         this.start();
        //     }
        // }, 1000);
    }
}

class WaveDIMAudio extends AudioHelper {
    constructor(){
        super();
        this.metadata = {};
        this.stream_id = null;
        this.stream_url = null;
        this._meta_loop();
    }

    _meta_loop(){
        api("metadata", "GET").then(function (data) {
            if(this.audioTag) {
                this.stream_id = this.audioTag.id;
                this.stream_url = this.audioTag.url;
            }

            this.metadata = data;
        }.bind(this));

        setTimeout(this._meta_loop.bind(this), 2000);
    }

    meta_nowplaying(stream_id){
        if(!this.metadata) return;

        try {
            let np = this.metadata[stream_id].metadata.info.np;
            return wohlolxss(np);
        } catch(err){}
    }

    meta_album(stream_id){
        if(!this.metadata) return;

        try {
            let album = this.metadata[stream_id].metadata.info.info.album;
            return wohlolxss(album);
        } catch(err){}
    }

    meta_duration(stream_id){
        if(!this.metadata) return;

        try {
            let duration = this.metadata[stream_id].metadata.info.info.duration;
            duration = parseInt(duration);
            let min = (duration/1000/60) << 0;
            if(min < 10) min = `0${min}`;
            let sec = parseInt((duration/1000) % 60);
            if(sec < 10) sec = `0${sec}`;
            return `${min}:${sec}`;
        } catch(err){}
    }

    meta_server_url(stream_id){
        if(!this.metadata) return;

        try {
            let album = this.metadata[stream_id].metadata.server["icy-url"];
            return wohlolxss(album);
        } catch(err){}
    }

    meta_server_bitrate(stream_id){
        if(!this.metadata) return;

        try {
            let album = this.metadata[stream_id].metadata.server["icy-br"];
            return wohlolxss(album);
        } catch(err){}
    }

    current_stream_id(){
        if(!this.audioTag) return;
        return this.audioTag.id;
    }

    get_streams(by_genre=false){
        return this.metadata;
    }

    err(inp){
        console.log(`Error: ${inp}`);
    }
}