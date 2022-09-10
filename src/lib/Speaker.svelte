<script lang="ts">
    import {speakerStore} from "../model/speaker";
    import {HsvPicker} from 'svelte-color-picker';
    import Panel from "./panel.svelte"

    function RGBAToHex(rgba) {
        const {r, g, b} = rgba;
        let rHex = r.toString(16);
        let gHex = g.toString(16);
        let bHex = b.toString(16);

        if (rHex.length == 1)
            rHex = "0" + rHex;
        if (gHex.length == 1)
            gHex = "0" + gHex;
        if (bHex.length == 1)
            bHex = "0" + bHex;

        return ("#" + rHex + gHex + bHex).toUpperCase();
    }
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
                <Panel name="設定変更">
                    <HsvPicker on:colorChange={(rgba) => {speaker.paragraph.color = RGBAToHex(rgba.detail)}}
                               startColor="{speaker.paragraph.color || '#000000'}"/>
                </Panel>
            </td>
            <td>発言後<input type="number" size="2" min="0" style="width:2em" bind:value={speaker.paragraph.lineBreakNum}>行、改行する
            </td>
        </tr>
    {/each}
    </tbody>
</table>