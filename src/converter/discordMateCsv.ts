import { parse, Parser } from "papaparse";
import type { ParseStepResult } from "papaparse";
import {sayStore} from "../model/say";
import {speakerStore} from "../model/speaker";
import type {InputConverter} from "./converter";

export class DiscordMateCsv implements InputConverter {
    async canParse(input: File): Promise<InputConverter> {
        if (input.type !== "text/csv") {
            return Promise.reject();
        }
        return input.text().then(text => {
            if (text.startsWith("Date,Username,User tag,Content,Mentions,link")) {
                return this;
            }
            return Promise.reject();
        });
    }

    parse(file: File) {
        parse(file, {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            step: DiscordMateCsv.step, header: true
        });
    }

    static step(results: ParseStepResult<{Username: string, "User tag":string, Date: string, "Content": string}>, _parser: Parser): void {
        const data = results.data;
        if (!data["Username"]) {
            return;
        }
        const speakerIdentity: string = data["Username"] + data["User tag"];
        speakerStore.addSpeaker({
            identity: speakerIdentity,
            name: data["Username"]
        })
        sayStore.addMessage({
            identity: data["Date"] + speakerIdentity,
            speaker: speakerIdentity,
            content: data["Content"]
        })
    }
}