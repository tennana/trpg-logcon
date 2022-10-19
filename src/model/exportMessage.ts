import {derived} from 'svelte/store';
import type {Message} from "./say";
import {sayStore} from "./say";
import type {Speaker} from "./speaker";
import {speakerStore} from "./speaker";

export interface ConcatMessage extends Message {
    name: string;
    speakerSetting: Speaker;
}

export const exportMessageStore = derived([sayStore, speakerStore], ($values, set) => {
    set($values[0].map(message => {
        const speaker = $values[1].find(speaker => speaker.identity === message.speaker);
        return {...message, name: message.overrideName || speaker && speaker.name || "", speakerSetting: speaker}
    }) as ConcatMessage[])
})