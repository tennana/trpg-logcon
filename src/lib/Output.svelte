<script lang="ts">
    import Select from 'svelte-select';
    import {exportFile} from "../exporter/exporter";
    import type {ConcatMessage} from "../model/exportMessage";
    import {exportMessageStore} from "../model/exportMessage";
    import templates from "../exporter/templates";

    let selectTemplate = templates[0];

    const downloadURL = (data, fileName) => {
        const a = document.createElement("a");
        a.href = data;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    async function convert() {
        const result = await exportFile($exportMessageStore as ConcatMessage[], selectTemplate);

        const url = URL.createObjectURL(result.file);
        downloadURL(url, result.file.name);
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }

    function handleSelect(e: CustomEvent) {
        selectTemplate = e.detail
    }
</script>
<p></p>
<dl>
    <dt>出力テンプレート</dt>
    <dd>
        <div style="width: fit-content; min-width: 18em;">
            <Select items={templates} labelIdentifier="name" optionIdentifier="id" value={selectTemplate}
                    listAutoWidth={true} on:select={handleSelect}/>
        </div>
    </dd>
    <dt>出力ファイル</dt>
    <dd>{selectTemplate?.type}</dd>
</dl>
<button on:click={convert}>Go!</button>