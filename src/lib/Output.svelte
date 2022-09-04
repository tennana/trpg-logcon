<script lang="ts">
    import {sayStore} from "../model/say";

    let doc;
    import {createReport} from "docx-templates/lib/browser";

    const downloadURL = (data, fileName, mimeType) => {
        const a = document.createElement("a");
        a.href = data;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    const saveDataToFile = (data, fileName, mimeType) => {
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        downloadURL(url, fileName, mimeType);
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    };

    async function convert() {
        const templateDoc: ArrayBuffer = await fetch("/template/A5-001-1-cn.docx").then(res => res.arrayBuffer());
        doc = await createReport({template: templateDoc, data: {message: $sayStore}})
        saveDataToFile(doc, "test.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    }
</script>

<button on:click={convert}>Go!</button>
{#if doc}
    <div id="doc-preview"></div>
{/if}