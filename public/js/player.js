// 2. This code loads the IFrame Player API code asynchronously.
// import socket from './socket-connection.js';
// console.log("socket", socket);


let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '480',
        width: '640',
        videoId: 'OHviieMFY0c',
        playerVars: { 
            'autoplay': 0, 
            'controls': 0,
            'disablekb': 1,
            'modestbranding': 1,
            'rel': 1,

        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    progressBarLoop();
    initalizeButtons();  
    $("#videoDuration").text(convertSecondsToString(getDuration()))
}

function playVideo(){
    player.playVideo();
}

function pauseVideo(){
    player.pauseVideo();
}

function getCurrentTime() {
    return player.getCurrentTime();
}

function getDuration() {
    return player.getDuration();
}


// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
    console.log(event.data)
}
function stopVideo() {
    player.stopVideo();
}
function seekToTime(seconds){
    player.seekTo(seconds);
}

// Attach Event handler to buttons
function initalizeButtons(){
    let playButton = $("#playButton");
    let pauseButton = $("#pauseButton");
    let videoIDButton = $("#videoID");

    playButton.click(function(event){
    //    playVideo();

        let myData = {state:'play', time: getCurrentTime()}
        socket.emit('event', myData);
    });

    pauseButton.click(function(event){
    //    pauseVideo();

        let myData = {state:'pause', time: getCurrentTime()}
        socket.emit('event', myData);
    });

    videoIDButton.click(function(event) {
        let videoIDValue  = $("#videoIdValue").val();
        if (videoIDValue == null || videoIDValue.length < 11) return ;
        
        let myData = {state: 'form', value: videoIDValue}
        socket.emit("event", myData);
    });
}
  
function progressBarLoop() {
    let progressBar  = $("#progressBar");
    let progressSquare = $("#square");
    let videoLength = player.getDuration();

    progressBar.click(function(event){
        // send seek request
        let divOffset = $(this).offset();
        let seekTo = (event.pageX - divOffset.left)/600*videoLength;
        let myData = {state: 'play', time: seekTo};

        seekToTime(seekTo);
        socket.emit("event", myData);
    });

    setInterval(function(){
        if (player == null || progressBar == null) {
            return;
        }
        let fraction = (getCurrentTime()/getDuration()) * 100;
        $("#videoRemainingTime").text(convertSecondsToString(getCurrentTime()));
        console.log(convertSecondsToString(getCurrentTime()));
        progressSquare.css('left', fraction.toString()+'%');
    },200);
}

function showPlayerErrors(event) {
    console.log("event", event);
}

function changeVideo(id) {
    player.loadVideoById(id)
}

function convertSecondsToString(time){
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);

    return `${minutes}:${seconds}`;
}

let socket = io();

socket.on("event", function(msg) {
    switch(msg.state){
        case 'play':
            if(Math.abs(msg.time - player.getCurrentTime() > 1)) {
                seekToTime(msg.time);
            }
            playVideo();
            break;

        case 'pause':
            pauseVideo();
            break;
        
        case 'form':
            changeVideo(msg.value);
        break;

        default:
    }
});