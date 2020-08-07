import React, {useState} from 'react'
import bgImg from '../../assets/img/bg2.jpg';
import youtubeLogo from '../../assets/img/ytv.png';
import {socket, hst as history} from '../../global/global'

import './Home.css';

export const Home = () => {
    const [name, setName] = useState('');

    const joinSession = (e) => {
        if (name.length < 3) return;

        const userData = {name, id: socket.id}
        socket.emit("register", userData);
        history.push('/Main',{ response: {name} })
    }



    return (
        <div id="home">
            <div className="gradient-layer" ></div>
            <img  id="bg-img"  alt="" className = "img-responsive" src={bgImg} />
            <img id="ytv-logo" alt="" className = "img-responsive" src={youtubeLogo}/>

            
            <div id="name-entry" className="">
                <div id="home-title">
                    <span>Quarantine & Chill</span>
                </div>

                <form onSubmit={joinSession}>
                    <input type="text"  value={name} onChange={(e) => {setName(e.target.value)}} id="name-input" aria-describedby="" placeholder="Enter Name" />
                    <button id="join-button" onClick= {() => {joinSession()}} type="button" className="btn btn-danger mb-2">JOIN SESSION</button>	
                </form>
            </div>
        </div>
    )
}

