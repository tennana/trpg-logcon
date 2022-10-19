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

    createDecorationRegExp(decoration: Decoration): RegExp;
}

export function exportFile(messages: ConcatMessage[], decoration: Decoration[], template: Template) {
    const exporter = template.generator();
    return exporter.transform(messages, decoration.filter(decoration => {
        return isValidDecoration(decoration);
    }).map(decoration => {
        return {
            ...decoration,
            match: exporter.createDecorationRegExp(decoration)
        }
    }));
}