import Word from "./word";
import type {ConcatMessage} from "../model/exportMessage";

export interface ExportResult {
    file: File;
    mimeType: string;
}

export interface Exporter {
    transform(messages: ConcatMessage[]): Promise<ExportResult>;
}

export function exportFile(messages: ConcatMessage[]) {
    return new Word().transform(messages);
}