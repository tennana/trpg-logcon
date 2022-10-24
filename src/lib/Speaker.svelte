<script lang="ts">
    import {speakerStore} from "../model/speaker";
    import ColorPanel from "./ColorPanel.svelte"
</script>
<table>
    <thead>
    <tr>
        <th>ID</th>
        <th>表示名</th>
        <th>文字色</th>
        <th>改行設定</th>
    </tr>
    </thead>
    <tbody>
    {#each $speakerStore as speaker}
        <tr>
            <td>{speaker.identity}</td>
            <td><input type="text" bind:value={speaker.name} style="color: {speaker.paragraph.color}"></td>
            <td>
                <ColorPanel on:colorChange={(e) => speaker.paragraph.color = e.detail}
                            color={speaker.paragraph.color || '#000000'}/>
            </td>
            <td>発言後<input type="number" size="2" min="0" style="width:2em" bind:value={speaker.paragraph.lineBreakNum}>行、改行する
            </td>
        </tr>
    {/each}
    </tbody>
</table>