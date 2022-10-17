import type {Decoration, ValidDecoration} from "../model/decoration";
import {isValidDecoration} from "../model/decoration";
import type {ConcatMessage} from "../model/exportMessage";
import type {Template} from "./templates";

export interface ExportResult {
    file: File;
    mimeType: string;
}

export interface Exporter {
    transform(messages: ConcatMessage[], decoration: ValidDecoration[]): Promise<ExportResult>;
}

export function exportFile(messages: ConcatMessage[], decoration: Decoration[], template: Template) {
    return template.generator().transform(messages, decoration.filter(decoration => {
        return isValidDecoration(decoration);
    }).map(decoration => {
        return {
            ...decoration,
            match: new RegExp(decoration.startChar + ".+?" + decoration.endChar, "g")
        }
    }));
}