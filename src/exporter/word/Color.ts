import {literalXMLDelimiter} from "../word";

type DecorationExport = (text: string, colorCode: string) => string;


export const Color: DecorationExport = (text: string, colorCode: string) => {
    return text.split("\n").map(line => {
        return literalXMLDelimiter + `<w:r><w:rPr><w:color w:val="${colorCode}"/></w:rPr><w:t>${line}</w:t></w:r>` + literalXMLDelimiter;
    }).join("\r\n")
}
