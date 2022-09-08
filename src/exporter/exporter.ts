import type {Message} from "../model/say";
import type {Speaker} from "../model/speaker";
import Word from "./word";

export interface ExportResult {
    file: File;
    mimeType: string;
}

export interface Exporter {
    transform(messages: Message[], speakers: Speaker[]): Promise<ExportResult>;
}

export function exportFile(messages: Message[], speakers: Speaker[]) {
    return new Word().transform(messages, speakers);
}