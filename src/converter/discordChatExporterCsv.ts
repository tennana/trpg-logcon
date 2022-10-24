import {parse, Parser} from "papaparse";
import type { ParseStepResult } from "papaparse";
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
            // eslint-disable-next-line @typescript-eslint/unbound-method
            step: DiscordChatExporterCsv.step, header: true
        });
    }

    static step(results:ParseStepResult<{AuthorID: string, Author: string, Date: string, Content: string}>, _parser: Parser) {
        const data = results.data;
        if (!data["AuthorID"]) {
            return;
        }
        const speakerIdentity = data["AuthorID"];
        speakerStore.addSpeaker({
            identity: speakerIdentity,
            name: data["Author"]
        })
        sayStore.addMessage({
            identity: Array.from(data["Date"] + data["Content"])
                .reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0).toFixed(),
            speaker: speakerIdentity,
            content: data["Content"]
        })
    }
}
