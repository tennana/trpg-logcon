export interface Decoration {
    startChar: string;
    endChar: string;
    colorEnabled: boolean;
    color: string;
    bold: boolean;
    italics: boolean;
    strikethrough: boolean;
    removal: boolean;
}

export interface ValidDecoration extends Decoration {
    match: RegExp;
}

export function createEmptyDecoration(): Decoration {
    return {
        startChar: "",
        endChar: "",
        color: "#000000",
        bold: false,
        colorEnabled: false,
        italics: false,
        removal: false,
        strikethrough: false
    };
}

export function isValidDecoration(decoration: Decoration): boolean {
    return decoration.startChar && decoration.endChar &&
        !decoration.startChar.includes(decoration.endChar) &&
        !decoration.endChar.includes(decoration.startChar);
}

import {writable} from 'svelte/store';

const {subscribe, set, update} = writable([createEmptyDecoration()] as Decoration[]);

export const decorationStore = {
    subscribe,
    set,
    update
}