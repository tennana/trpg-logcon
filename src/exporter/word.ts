import type {Exporter, ExportResult} from "./exporter";
import type {Message} from "../model/say";
import type {Speaker} from "../model/speaker";
import {createReport} from "docx-templates/lib/browser";

export default class Word implements Exporter {
    async transform(messages: Message[], speakers: Speaker[]): Promise<ExportResult> {
        const templateDoc: ArrayBuffer = await fetch("/template/A5-001-1-cn.docx").then(res => res.arrayBuffer());
        const doc = await createReport({template: templateDoc, data: {message: messages}}) as Uint8Array;
        return {
            file: new File([doc], "output.docx", {lastModified: new Date().getDate()}),
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };
    }
}