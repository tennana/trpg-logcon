<script lang="ts">
    import type {Message} from "../model/say";
    import type {Speaker} from "../model/speaker";
    import {speakerStore} from "../model/speaker";

    export let say: Message;
    $: speaker = ($speakerStore as Speaker[]).find(speaker => speaker.identity === say.speaker);
    $: speakerName = say?.overrideName ? say?.overrideName : speaker?.name;
</script>
    <div class="name">
        {speakerName}
    </div>
    <div class="content">
        {say.content}
    </div>

<style>
    .name, .content {
        border-bottom: 1px solid black;
    }

    .content {
        flex-basis: max-content;
        white-space: pre-wrap;
        word-break: normal;
        text-align: left;
    }
</style>