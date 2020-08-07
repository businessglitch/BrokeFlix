import React from 'react'
import './Header.css'
export const Header = (props) => {

    const openChat = () => {
        props.setChat(!props.currentChatState)
    }

    return (
        <div id="header-bar">
            <div id="cover">
                <form method="get" action="">
                    <div className="tb">
                        <div className="td"><input className="search-input" type="text" placeholder="Search" required/></div>
                        <div className="td" id="s-cover">
                            <button className="search-button" type="submit">
                                <div id="s-circle"></div>
                                <span></span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div id="notification-messages" onClick={(e) => {openChat(e)}}>
                <svg width="25px" height="25px" viewBox="0 0 16 16" className="bi bi-chat-right-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M14 0a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/>
                </svg>
            </div>
        </div>
    )   
}
