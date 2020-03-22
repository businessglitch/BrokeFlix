let socket = io();
// let moment = require('moment');
let name;

let joinSession = $("#name-button");
joinSession.click(function(e){
    name = $("#name-input").val();
    if (name.length < 3) return;


    let myData = {name, id: socket.id}
    socket.emit("register", myData);

    $("#home-section").hide();
    $("#video-section").show();
    $("#chat-section").show();
});

let sendMessage = $("#message-button");
sendMessage.click(function(e){
    let message = $("#message-input").val();
    if (message.length < 1) return;

    let time = moment().format('LT');  
    console.log(time);
    let html = `<li class="my-message"><span class="message-name">${name}  ${time}</span><span class="message-body">${message}<span></li>`
    $('#chat-messages-list').append(html);

    let myData = {message, id: socket.id}
    socket.emit("message", myData);
    console.log("emitted", myData);
})



function setTimestamp() {
    let currentTime = Date.now();

    
    return `${rhours}:${rminutes}`
}







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
        height: '520',
        width: '750',
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
    if(event.data == YT.PlayerState.PLAYING) {
        console.log()
    }

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

        progressSquare.css('left', fraction.toString()+'%');
    },200);
}

function showPlayerErrors(event) {
    console.log("event", event);
}

function changeVideo(url) {
    let id = url.slice(url.indexOf("=") + 1, url.length)
    player.loadVideoById(id)
}

function convertSecondsToString(time){
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);

    return `${minutes}:${seconds}`;
}



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


socket.on("register", function(user) {
    let html = `<li class="joined-message"> ${user.name} joined </li>`
    $('#chat-messages-list').append(html);
    console.log('users: ', user);
});

socket.on("all-messages", function(data) {
    console.log(data, 'recieved');
    let html = `<li class="message"><span class="message-name">${data.name}</span><span class="message-body">${data.message}<span></li>`
    $('#chat-messages-list').append(html);
});
