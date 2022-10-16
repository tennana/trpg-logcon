import * as zip from "@zip.js/zip.js";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import type {ConcatMessage} from "../model/exportMessage";
import type {Exporter, ExportResult} from "./exporter";

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

    createTableRow(message: ConcatMessage) {
        let decoration = message.speakerSetting?.paragraph;
        const colorTag = decoration?.color ? `<w:color w:val="${decoration.color}"/>` : '';
        let contentXml = message.content.split("\n").map(function (paragraph) {
            return `<w:r><w:rPr>${colorTag}</w:rPr><w:t>${paragraph}</w:t></w:r>`
        }).join(this.LINE_SEPARATOR)
        return `<w:tr>
        <w:trPr>
        </w:trPr>
        <w:tc>
          <w:tcPr>
            <w:tcBorders>
            </w:tcBorders>
            <w:tcW w:w="30" w:type="pct"/>
            <w:textDirection w:val="tbRl"/>
          </w:tcPr>
          <w:p>
            <w:pPr>
              <w:widowControl w:val="false"/>
              <w:rPr>
              </w:rPr>
            </w:pPr>
            <w:r>
              <w:rPr>
                ${colorTag}
              </w:rPr>
              <w:t>${message.name}</w:t>
            </w:r>
          </w:p>
        </w:tc>
        <w:tc>
          <w:tcPr>
            <w:tcW w:w="70" w:type="pct"/>
            <w:tcBorders>
            </w:tcBorders>
            <w:textDirection w:val="tbRl"/>
          </w:tcPr>
          <w:p>
            <w:pPr>
              <w:widowControl w:val="false"/>
              <w:rPr>
              </w:rPr>
            </w:pPr>
            ${contentXml}
            ${this.LINE_SEPARATOR.repeat(decoration.lineBreakNum || 0)}
          </w:p>
        </w:tc>
      </w:tr>`
    }

    createTable(messages: ConcatMessage[]): string {
        return `
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="5000" w:type="dxa"/>
        <w:jc w:val="left"/>
        <w:tblInd w:w="0" w:type="dxa"/>
        <w:tblLayout w:type="fixed"/>
        <w:tblCellMar>
          <w:top w:w="0" w:type="dxa"/>
          <w:left w:w="0" w:type="dxa"/>
          <w:bottom w:w="0" w:type="dxa"/>
          <w:right w:w="0" w:type="dxa"/>
        </w:tblCellMar>
      </w:tblPr>
      <w:tblGrid>
        <w:gridCol w:w="610"/>
        <w:gridCol w:w="5500"/>
      </w:tblGrid>
      ${messages.map(this.createTableRow.bind(this)).join("")}
    </w:tbl>`;
    }

    async transform(messages: ConcatMessage[]): Promise<ExportResult> {
        const templateDoc: ArrayBuffer = await fetch(`/template/${this._filePath}`).then(res => res.arrayBuffer());
        const baseZip = new PizZip(templateDoc);
        const doc = new Docxtemplater(baseZip, {
            paragraphLoop: true,
            linebreaks: true,
        });
        doc.render({
            screenplay: this.createScreenplay.bind(this, messages),
            table: this.createTable.bind(this, messages),
            messages: messages
        })
        const buf = doc.getZip().generate({
            type: "uint8array",
            compression: "STORE"
        });
        const oldZip = new zip.ZipReader(new zip.Uint8ArrayReader(buf));
        const newZip = new zip.ZipWriter(new zip.BlobWriter(), {
            msDosCompatible: true,
            zipCrypto: false
        });
        for await(let entry of oldZip.getEntriesGenerator()) {
            const content = await entry.getData(new zip.BlobWriter());
            if (!entry.directory)
                await newZip.add(entry.filename, new zip.BlobReader(content), {directory: entry.directory});
        }
        const [file] = await Promise.all([
            newZip.close(),
            oldZip.close(),
        ]);
        return {
            file: new File([file], "output.docx", {lastModified: new Date().getDate()}),
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };
    }
}