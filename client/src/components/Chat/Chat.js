import React, {useState, useEffect} from 'react';
import {socket} from '../../global/global';
import Moment from 'react-moment';

import './Chat.css'

export const Chat = (props) => {
    const {name} = props
    const [message, setMessage] = useState('')
    const [allMessages, setAllMessages] = useState([])

    socket.on("recieve-message", function(data) {
        console.log(data, 'recieved');
        setAllMessages( data)
    });

    socket.on('all-messages', (data) => {
        setAllMessages(data.messages)
    })
    
    const sendMessage = () => {
        if (message.length < 1) return;
        // setAllMessages( allMessages => [...allMessages, {message, name}])
        socket.emit("send-message", {message, name, id: socket.id});
        setMessage('')
    }

    const __renderList = () => {

       return ( <ul id="chat-messages-list">
                {
                    allMessages.map((msg,index) => {
                        return  (socket.id === msg.id) ? (<li key={index} className="my-message"><span className="message-name"></span><span className="message-body">{msg.message}</span></li>) :  (<li className="message"><span className="message-name">{msg.name}</span><span className="message-body">{msg.message}</span></li>)
                    })  
                }
            </ul>
       )
        
    }
    
    return (
    <div id="chatSection">
        <div id="chat-header">
            <span id="hide-chat"><i className="arrow right icon"></i></span>
            <span>Chat Messages</span>
            <span id="show-users"><i className="users icon"></i></span>
        </div>

        <div id="chat-messages">
            {__renderList()}
        </div>

        <div id="chat-send">
            <form>
                <input type="text" value={message}  onChange= {(e) => {setMessage(e.target.value)}} className="form-control" id="message-input" aria-describedby="" placeholder="Enter Name"/>
                <button id="message-button" onClick={(e) => sendMessage(e)} type="button" className="btn mb-2"><i className="paper plane icon"></i></button>
            </form>
        </div>
    </div>
    )
}
