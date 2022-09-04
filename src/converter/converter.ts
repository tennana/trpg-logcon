import {DiscordMateCsv} from "./discordMateCsv";

export default function (file: File) {
    (new DiscordMateCsv()).parse(file);
}