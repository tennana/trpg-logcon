import type {Exporter, ExportResult} from "./exporter";
import type {ConcatMessage} from "../model/exportMessage";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export const literalXMLDelimiter = '||';

export default class Word implements Exporter {
    private _filePath: string;

    public constructor(filePath: string) {
        this._filePath = filePath;
    }

    private readonly LINE_SEPARATOR = `<w:r><w:rPr/><w:br/></w:r>`;

    createScreenplay(messages: ConcatMessage[], _scope: any): string {
        return messages.map((message) => {
            let decoration = message.speakerSetting?.paragraph;
            const colorTag = decoration?.color ? `<w:color w:val="${decoration.color}"/>` : '';
            let contentXml = message.content.split("\n").map(function (paragraph) {
                return `<w:r><w:rPr>${colorTag}</w:rPr><w:t>${paragraph}</w:t></w:r>`
            }).join(this.LINE_SEPARATOR)
            return `<w:p>
      <w:pPr>
        <w:pStyle w:val="Normal"/>
        <w:rPr>
        </w:rPr>
      </w:pPr>
      <w:r>
        <w:rPr>
          ${colorTag}
        </w:rPr>
        <w:t>${message.name}</w:t>
      </w:r>
      <w:r>
        <w:rPr>
        </w:rPr>
        <w:tab/>
      </w:r>
      ${contentXml}
      ${this.LINE_SEPARATOR.repeat(decoration.lineBreakNum || 0)}
    </w:p>`;
        }).join("");
    }

    async transform(messages: ConcatMessage[]): Promise<ExportResult> {
        const templateDoc: ArrayBuffer = await fetch(`/template/${this._filePath}`).then(res => res.arrayBuffer());
        const zip = new PizZip(templateDoc);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });
        doc.render({
            screenplay: this.createScreenplay.bind(this, messages),
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