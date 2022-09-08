import {literalXMLDelimiter} from "../word";

type DecorationExport = (text: string) => string;


export const Bold: DecorationExport = (text: string) => {
    return text.split("\n").map(line => {
        return literalXMLDelimiter + `<w:r><w:rPr><w:b /></w:rPr><w:t>${line}</w:t></w:r>` + literalXMLDelimiter;
    }).join("\r\n")
}
