import type {ReadableStream} from "stream/web";
import {sayStore} from "../model/say";
import {createInitParagraph, speakerStore} from "../model/speaker";
import type {InputConverter} from "./converter";

export class CcfoliaV122Html implements InputConverter {
    private rowRegexp = new RegExp("    <p style=\"color:(#[a-zA-Z0-9]+);\">\n" +
        "      <span> \\[(.+)\\]</span>\n" +
        "      <span>(.+?)</span> :\n" +
        "      <span>\n" +
        "        (.+?)\n" +
        "      </span>\n" +
        "    </p>", "g");

    async canParse(input: File): Promise<InputConverter> {
        if (input.type !== "text/html") {
            return Promise.reject();
        }
        return input.text().then(text => {
            if (text.includes("<title>ccfolia - logs</title>") && this.rowRegexp.test(text)) {
                return this;
            }
            return Promise.reject();
        });
    }

    parse(file: File) {
        let previous = "";
        const regexp = this.rowRegexp;
        const reader = (file.stream() as unknown as ReadableStream).getReader();
        let textDecoder = new TextDecoder();
        reader.read().then(function doChunk({value, done}) {
            previous += textDecoder.decode(value);
            let result;
            while (result = regexp.exec(previous)) {
                this.step(result);
            }
            if (done) {
                return;
            }
            return reader.read().then(doChunk.bind(this));
        }.bind(this));
    }

    step(result: RegExpExecArray) {
        const data = {
            color: result[1],
            channel: result[2],
            name: result[3],
            content: result[4]
        };
        let speakerIdentity = data.name;
        speakerStore.addSpeaker({
            identity: speakerIdentity,
            name: data.name,
            paragraph: createInitParagraph(data.color)
        })
        sayStore.addMessage({
            identity: "" + Array.from(data.content)
                .reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0),
            speaker: speakerIdentity,
            content: data.content
                .replaceAll("<br>", "\n")
                .replaceAll("&gt;", ">")
                .replaceAll("&lt;", "<")
        })
    }
}

