// Sander Ferdinand 2017

$(document).on("click", ".change_radio", function(){
    var data_id = $(this).attr("data-stream");
    $(".sidenav .streams .change_radio").each(function(i, obj){
        $(obj).removeClass("current");
    });

    $(this).addClass("current");

    if(data_id.indexOf(".") >= 0){
        // static file
        render.audio.stop();
        render.audio.start_static(`/static/${data_id}`, data_id);
    } else {
        // stream
        render.audio.stop();
        render.audio.start_stream(`/stream/${data_id}`, data_id);
    }
});

$(document).on("click", ".change_scene", function(){
    var scene_name = $(this).attr("data-name");
    if(scene_name == "waveform"){
        render.start(new SceneWaveform());
    } else if(scene_name == "arrows") {
        render.start(new SceneArrows());
    } else if(scene_name == "space cube"){
        render.start(new SceneSpaceShaders());
    } else if(scene_name == "RGB shift"){
        render.start(new SceneRGBShift());
    } else if(scene_name == "test"){
        render.start(new SceneTest());
    }
});

// Muting and unmuting audio button.
$(document).on("click", ".change_mute", function() {
    let mute_status = $(this).attr("data-name");
    if (mute_status == "Mute") {
        render.audio.audioTag.volume = 0;
        console.log("Muted audio");
        $(this).attr("data-name", 'Unmute');
        $(this).text("Unmute");
    } else if (mute_status == "Unmute") {
        render.audio.audioTag.volume = 1;
        console.log("Unmuted audio");
        $(this).attr("data-name", "Mute");
        $(this).text("Mute");
    }
});


// populate radio streams
function radiostreams(){
    if(!window.hasOwnProperty("render")) return setTimeout(radiostreams, 200);

    var sel_streams = $(".sidenav .streams");
    let sel_html = sel_streams.html();
    let streams = render.audio.get_streams();
    let current_stream_id = render.audio.current_stream_id();

    let results = [];
    let redraw = false;
    $.each(streams, function(stream_id, i){
        let stream = streams[stream_id];
        if(stream) results.push(stream);
        if(!redraw && sel_html.indexOf(stream.title) < 0 && sel_html.indexOf(stream.id) < 0) redraw = true;

    });

    if(redraw){
        sel_streams.empty();

        $(results).each(function(i, stream){
            let current = "";
            if(stream.id == current_stream_id){
                current = " current";
            }

            $(".sidenav .streams").append(`
                <a class="change_radio${current}" data-stream="${stream.id}">[stream] ${stream.title}</a><br>
            `);
        });
    }

    setTimeout(radiostreams, 200);
}

// populate metadata
function metadata(){
    if(!window.hasOwnProperty("render")) return setTimeout(metadata, 200);
    let stream_id = render.audio.current_stream_id();
    if(!stream_id) return setTimeout(metadata, 200);

    var sel_metadata = $(".sidenav .metadata");
    let sel_html = sel_metadata.html();

    var _metadata = {
        "Song": render.audio.meta_nowplaying,
        "Album": render.audio.meta_album,
        "Duration": render.audio.meta_duration,
        "Bitrate <small>(kbps)</small>": render.audio.meta_server_bitrate,
        "Stream URL": render.audio.meta_server_url
    };

    let results = [];
    let redraw = false;
    for(var key in _metadata) {
        if(_metadata.hasOwnProperty(key)){
            let result = _metadata[key].bind(render.audio)(stream_id);
            if(result) results.push([key, result]);
            if(!redraw && sel_html.indexOf(result) < 0) redraw = true; // only update on new metadata
        }
    }

    if(redraw && results.length > 0){
        sel_metadata.empty();
        $(results).each(function(i, data) {
            let key = data[0];
            let result = data[1];

            // add youtube search link
            if(key == "Song"){
                result = `<a href="https://www.youtube.com/results?search_query=${result}" target="_blank">${result}</a>`;
            }

            // add link to stream url
            if(key == "Stream URL"){
                result = `<a href="${result}" target="_blank">${result}</a>`;
            }

            sel_metadata.append(`<span>
                ${key}:<br><small>${result}</small>
            </span>`);
        });
    }

    setTimeout(metadata, 200);
}

radiostreams();
metadata();
