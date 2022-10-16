<script lang="ts">
    import {createEmptyDecoration, decorationStore} from "../model/decoration";
    import CharacterDecorationRow from "./CharacterDecorationRow.svelte";

    function addRow() {
        decorationStore.update((rows) => {
            rows.push(createEmptyDecoration());
            return rows;
        });
    }

    function deleteRow(e: CustomEvent) {
        decorationStore.update((rows) => rows.filter(row => row !== e.detail));
    }

    let exists = false;
    $: exists = $decorationStore.length > 0;
</script>
{#if exists}
    <table>
        <thead>
        <tr>
            <th>&nbsp;</th>
            <th>開始文字</th>
            <th>終端文字</th>
            <th>文字色</th>
            <th>太字</th>
            <th>斜字</th>
            <th>取消</th>
            <th>囲い文字を除去</th>
            <th>サンプル</th>
            <th>&nbsp;</th>
        </tr>
        </thead>
        <tbody>
        {#each $decorationStore as decoration}
            <CharacterDecorationRow decoration={decoration} on:delete={deleteRow}/>
        {/each}
        </tbody>
    </table>
{/if}
<button type="button" on:click={addRow}>
    新規追加
</button>
<style>
</style>