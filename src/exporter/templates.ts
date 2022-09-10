import type {Exporter} from "./exporter";
import WordTemplate from "./word";

export interface Template {
    name: string;
    type: 'Word';
    generator: () => Exporter;
}

const templates: Template[] = [
    {
        name: 'A5縦/縦書き2段',
        type: 'Word',
        generator: () => {
            return new WordTemplate('A5-001-1-cn.docx');
        }
    },
    {
        name: 'A5横/縦書き1段',
        type: 'Word',
        generator: () => {
            return new WordTemplate('A5-cn.docx');
        }
    },
];

export default templates;