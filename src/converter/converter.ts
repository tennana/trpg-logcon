import {DiscordChatExporterCsv} from "./discordChatExporterCsv";
import {DiscordMateCsv} from "./discordMateCsv";

export interface InputConverter {
    canParse(input: File): Promise<InputConverter>;

    parse(file: File);
}

const CONVERTERS = [
    new DiscordChatExporterCsv(),
    new DiscordMateCsv()
];

export default async function (file: File) {
    try {
        const parser = await Promise.any(CONVERTERS.map(converter => converter.canParse(file)));
        parser.parse(file);
    } catch (e) {
        console.log(e);
        alert("対応していないファイル形式か、エラーで読み取れませんでした");
    }
}