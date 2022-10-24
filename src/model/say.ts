import {writable} from "svelte/store";

const {subscribe, set, update} = writable([] as Message[]);

export interface Message {
    identity: string;
    speaker: string;
    overrideName?: string;
    icon?: string;
    content: string;
}

function addMessage(message: Message) {
    update(function (state) {
        if (state.findIndex((s) => s.identity === message.identity) === -1) {
            state.push(message);
        }
        return state;
    });
}

export const sayStore = {
    subscribe: subscribe,
    addMessage,
    set,
    clear: function () {set([])}
}