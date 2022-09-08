<script lang="ts">
    import type {Message} from "../model/say";
    import {sayStore} from "../model/say";
    import {exportFile} from "../exporter/exporter";
    import type {Speaker} from "../model/speaker";
    import {speakerStore} from "../model/speaker";

    const downloadURL = (data, fileName) => {
        const a = document.createElement("a");
        a.href = data;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    async function convert() {
        const result = await exportFile($sayStore as Message[], $speakerStore as Speaker[]);

        const url = URL.createObjectURL(result.file);
        downloadURL(url, result.file.name);
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }
</script>

<button on:click={convert}>Go!</button>