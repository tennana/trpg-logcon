import {writable} from "svelte/store";

const {subscribe, set, update} = writable([] as Speaker[]);

export interface ParagraphStyle {
    color: string;
    lineBreakNum: number;
}

export function createInitParagraph(color: string = "", lineBreakNum: number = 0): ParagraphStyle {
    return {
        color,
        lineBreakNum
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
            if (!speaker.paragraph) {
                speaker.paragraph = createInitParagraph();
            }
            state.push(speaker);
        }
        return state;
    });
}

export const speakerStore = {
    subscribe: subscribe,
    addSpeaker,
    set,
    clear: function () {
        set([])
    }
}