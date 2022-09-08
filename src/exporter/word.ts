import type {Exporter, ExportResult} from "./exporter";
import type {ConcatMessage} from "../model/exportMessage";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export const literalXMLDelimiter = '||';

export default class Word implements Exporter {
    async transform(messages: ConcatMessage[]): Promise<ExportResult> {
        const templateDoc: ArrayBuffer = await fetch("/template/A5-001-1-cn.docx").then(res => res.arrayBuffer());
        const zip = new PizZip(templateDoc);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });
        doc.render({
            messages: messages
        })
        const buf = doc.getZip().generate({
            type: "blob",
            compression: "DEFLATE",
        });
        return {
            file: new File([buf], "output.docx", {lastModified: new Date().getDate()}),
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };
    }
}