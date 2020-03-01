import { playVideo, pauseVideo, seekTo } from './player.js';

let socket = io();

socket.on("event", function(msg) {
    switch(msg.state){
        case 'play':
            if(Math.abs(msg.time - player.getCurrentTime() > 1)) {
                seekTo(msg.time);
            }
            playVideo();
            break;

        case 'pause':
            pauseVideo();
        break;

        default:
    }
});

export default socket;
// module.exports = {socket}