import {writable} from 'svelte/store';

const {subscribe, set, update} = writable([] as Speaker[]);

export interface Speaker {
    identity: string;
    name: string;
}

function addSpeaker(speaker: Speaker) {
    update(function (state) {
        if (state.findIndex((s) => s.identity === speaker.identity) === -1) {
            state.push(speaker);
        }
        return state;
    });
}

export const speakerStore = {
    subscribe: subscribe,
    addSpeaker,
    set,
    clear: function () {set([])}
}