import React, {useState, useEffect} from 'react';
import YouTube from 'react-youtube';
import './Video.css';
import {socket, convertSecondsToString} from '../../global/global';


let player = {}

export const Video = () => {
    const [videoRemainingTime, setVideoRemainingTime] = useState('0:0'); 
    const [videoDuration, setVideoDuration] = useState('4:28'); 
    const [nextVideoID, setNextVideoID] = useState(''); 
    const [videoID, setVideoID] = useState('euy6ZoFLIqA'); 
    const [videoTime, setVideoTime] = useState(0); 
    const [squareLeft, setSquareLeft] = useState('0');
    const [playerOptions, setPlayerOptions] = useState({})
    const [playerState, setPlayerState] = useState(true)

    useEffect(() => {
        socket.on("send-player-configs", (data) => {
            const {time, videoID} = data.playerDetails
            console.log(data.options)
            setPlayerOptions(data.options)
            console.log(playerOptions)
            setVideoID(videoID)
            setVideoTime(time)
        });
        console.log('Mounted')
    }, []);


    socket.on("event", function(msg) {
        switch(msg.state){
            case 'play':
                console.log('MSG TIME: ', msg.time)
                if(Math.abs(msg.time - getCurrentTime() > 1)) {
                    seekToTime(msg.time);
                }
               
                player.playVideo();
                break;
    
            case 'pause':
                player.pauseVideo();
                break;
            
            case 'form':
                changeVideo(msg.value);
            break;
    
            default:
        }
    });

    // 4. The API will call this function when the video player is ready.
    const onPlayerReady = (event)  => {
        player = event.target;
        seekToTime(videoTime);

        progressBarLoop(event);
        setVideoDuration(convertSecondsToString(getDuration(event)));
    }
    const  getVideoID = () =>  {
        return player['g']['g'].videoId;
    }

    const  getCurrentTime = () => {
        return player.getCurrentTime();
    }
    
    const getDuration = () => {
        return player.getDuration();
    }

    const seekToTime = (seconds) => {
        player.seekTo(seconds);
    }

    const playButton = () => {
        console.log('PlayerState' , playerState)
        if (playerState) {
            player.playVideo()
            socket.emit('event', {state:'play', time: getCurrentTime(), value: getVideoID()});
        } else {
            player.pauseVideo()
            socket.emit('event', {state:'pause', time: getCurrentTime(), value: getVideoID()});
        }
        setPlayerState(!playerState)
        
    }

    const changeVideo = (videoID) => {
        player.loadVideoById(videoID)
    }

    const updateVideo = () => {
        if (nextVideoID == null || nextVideoID.length < 11) return ;
        let id = nextVideoID.slice(nextVideoID.indexOf("=") + 1, nextVideoID.length)
        changeVideo(id)
        
        socket.emit("event", {state: 'form', value: id, time: getCurrentTime()});
    }
   
    const onProgressBarClick = (event) => {
        // send seek request
        let progressBarLength = 360
        let videoLength = player.getDuration();
        let divOffset = event.target.offsetLeft;
        
        let seekTo = (event.pageX - divOffset)/progressBarLength*videoLength;
        let myData = {state: 'play', time: seekTo};

        seekToTime(seekTo);
        socket.emit("event", myData);
    }

    const progressBarLoop = (event) => {
        setInterval(() => {
            const newTime = convertSecondsToString(getCurrentTime())
            const fraction = (getCurrentTime()/getDuration()) * 100;
            // Keeping track for video progress time
            setVideoRemainingTime(newTime);
            //  Keeping track of circle position
            setSquareLeft(fraction.toString()+'%');
        },200);
    }

    const onPlayerStateChange = (event)  => {
    }


    return (
        <div id="videoSection">
            {/* <!-- 1. The <iframe> (and video player) will replace this <div> tag. --> */}
            <YouTube videoId={videoID} 
                opts={playerOptions}
                onReady={(e) => {onPlayerReady(e)}}
                onStateChange={(e) => {onPlayerStateChange(e)}}
            />
                
            <div id="video-control-bar">
                {/* <!-- Buttons --> */}
                <div id="player-controls">
                    <div className={(playerState === true) ? "play-button" : "play-button active"} onClick={(e) =>{playButton(e)}}>
                        <div className="arrow arrow-left"></div>
                        <div className="arrow arrow-right"></div>
                    </div>
                </div>
                
                {/* <!-- Progress Line --> */}
                <div>
                    <span id="videoRemainingTime">{videoRemainingTime}</span> 
                    <div id="progressBar"  onClick={(e) => {onProgressBarClick(e)}}>
                        <div id="square" style={{left: squareLeft}}></div>
                    </div>
                    <span id="videoDuration">{videoDuration}</span> 
                </div>
            </div>	
            {/* <!-- /.container --> */}
            <div id="videoSubmission"> 
                <form className="form-inline"  target="_blank">
                    <div>
                        <button type="button" onClick= {(e) => {updateVideo(e)}} id="video-id-button" className="btn mb-2">Change Video</button>
                        <input type="text" className="form-control" value={nextVideoID} onChange= {(e) => {setNextVideoID(e.target.value)}} id="videoIdValue" placeholder="Enter video URL here"/>
                        
                    </div>
                </form>
            </div>	
        </div>
    )
}
