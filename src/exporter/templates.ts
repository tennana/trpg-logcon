import type {Exporter} from "./exporter";
import WordTemplate from "./word";

export interface Template {
    id: number,
    name: string;
    type: "Word";
    generator: () => Exporter;
}

const templates: Template[] = [
    {
        id: 1,
        name: "A5縦/縦書き2段",
        type: "Word",
        generator: () => {
            return new WordTemplate("A5-001-1-cn.docx");
        }
    },
    {
        id: 2,
        name: "A5横/縦書き1段",
        type: "Word",
        generator: () => {
            return new WordTemplate("A5-cn.docx");
        }
    },
    {
        id: 3,
        name: "A5縦/縦書き2段(テーブル)",
        type: "Word",
        generator: () => {
            return new WordTemplate("A5-001-1-cn-table.docx");
        }
    },
    {
        id: 4,
        name: "A5横/縦書き1段(テーブル)",
        type: "Word",
        generator: () => {
            return new WordTemplate("A5-cn-table.docx");
        }
    },
];

export default templates;