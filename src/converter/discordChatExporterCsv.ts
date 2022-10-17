import {parse, Parser} from "papaparse";
import {sayStore} from "../model/say";
import {speakerStore} from "../model/speaker";
import type {InputConverter} from "./converter";

export class DiscordChatExporterCsv implements InputConverter {
    async canParse(input: File): Promise<InputConverter> {
        if (input.type !== "text/csv") {
            return Promise.reject();
        }
        return input.text().then(text => {
            if (text.startsWith("AuthorID,Author,Date,Content,Attachments,Reactions")) {
                return this;
            }
            return Promise.reject();
        });
    }

    parse(file: File) {
        parse(file, {
            step: this.step, header: true
        });
    }

    step(results, _parser: Parser) {
        const data = results.data;
        if (!data["AuthorID"]) {
            return;
        }
        let speakerIdentity = data["AuthorID"];
        speakerStore.addSpeaker({
            identity: speakerIdentity,
            name: data["Author"]
        })
        sayStore.addMessage({
            identity: "" + Array.from(data["Date"] + data["Content"] as string)
                .reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0),
            speaker: speakerIdentity,
            content: data["Content"]
        })
    }
}
