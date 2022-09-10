<script lang="ts">
    import {exportFile} from "../exporter/exporter";
    import type {ConcatMessage} from "../model/exportMessage";
    import {exportMessageStore} from "../model/exportMessage";
    import templates from "../exporter/templates";

    let selectTemplate = 0;

    const downloadURL = (data, fileName) => {
        const a = document.createElement("a");
        a.href = data;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    async function convert() {
        const result = await exportFile($exportMessageStore as ConcatMessage[], templates[selectTemplate]);

        const url = URL.createObjectURL(result.file);
        downloadURL(url, result.file.name);
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }
</script>

<select bind:value={selectTemplate}>
    {#each templates as template, i}
        <option value={i}>
            {template.name}
        </option>
    {/each}
</select>
<button on:click={convert}>Go!</button>