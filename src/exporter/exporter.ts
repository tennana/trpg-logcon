import type {ConcatMessage} from "../model/exportMessage";
import type {Template} from "./templates";

export interface ExportResult {
    file: File;
    mimeType: string;
}

export interface Exporter {
    transform(messages: ConcatMessage[]): Promise<ExportResult>;
}

export function exportFile(messages: ConcatMessage[], template: Template) {
    return template.generator().transform(messages);
}