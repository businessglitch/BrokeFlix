import socketIOClient from "socket.io-client";
import { createBrowserHistory as history} from 'history';

export const hst = history();
export const socket = socketIOClient('http://localhost:5000/')

export const convertSecondsToString = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);

    return `${minutes}:${seconds}`;
}
