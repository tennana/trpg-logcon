import {writable} from 'svelte/store';

const {subscribe, set, update} = writable([] as Speaker[]);

export interface ParagraphStyle {
    color: string;
    lineBreakNum: number;
}

function createInitParagraph(): ParagraphStyle {
    return {
        color: '',
        lineBreakNum: 0
    }
}

export interface Speaker {
    identity: string;
    name: string;
    paragraph?: ParagraphStyle;
}

function addSpeaker(speaker: Speaker) {
    update(function (state) {
        if (state.findIndex((s) => s.identity === speaker.identity) === -1) {
            speaker.paragraph = createInitParagraph();
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