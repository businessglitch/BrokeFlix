import React, {useState} from 'react';
import {Video} from './Video/Video'
import {Chat} from './Chat/Chat'
import {Header} from './Header/Header'

export const Main = (props) => {
    const {name} = props.location.state.response
    const [showChat, setshowChat] = useState(false); 
    return (
        <div>
            <Header currentChatState={showChat} setChat={setshowChat}/>
            <Video/>
            {(showChat === false ? '' : <Chat name={name} />)}
        </div>
    )
}
