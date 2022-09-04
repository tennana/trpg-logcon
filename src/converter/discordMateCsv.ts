import {parse, Parser} from "papaparse";
import {speakerStore} from "../model/speaker";
import {sayStore} from "../model/say";

export class DiscordMateCsv {
    parse(file: File) {
        parse(file, {
            step: this.step, header: true
        });
    }

    step(results, parser: Parser) {
        const data = results.data;
        if(!data["Username"]){
            return;
        }
        let speakerIdentity = data["Username"] + data["User tag"];
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