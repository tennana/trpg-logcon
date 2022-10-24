<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import Panel from "./panel.svelte"
    import {HsvPicker} from 'svelte-color-picker';
    export let color = "#000000";

    let emit = createEventDispatcher();

    function emitHexCode(e:{detail: {r:number,g:number,b:number}}) {
        const {r, g, b} = e.detail;
        let rHex = r.toString(16);
        let gHex = g.toString(16);
        let bHex = b.toString(16);

        if (rHex.length == 1)
            rHex = "0" + rHex;
        if (gHex.length == 1)
            gHex = "0" + gHex;
        if (bHex.length == 1)
            bHex = "0" + bHex;

        emit("colorChange", ("#" + rHex + gHex + bHex).toUpperCase());
    }
</script>
<Panel name="色設定">
    <span slot="name" style="color: {color}">{color}</span>
    <HsvPicker on:colorChange={emitHexCode}
               startColor={color}/>
</Panel>
