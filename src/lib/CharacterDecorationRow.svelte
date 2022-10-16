<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import {HsvPicker} from 'svelte-color-picker';
    import FaExclamationTriangle from 'svelte-icons/fa/FaExclamationTriangle.svelte'
    import FaRegCheckCircle from 'svelte-icons/fa/FaRegCheckCircle.svelte'
    import FaTrashAlt from 'svelte-icons/fa/FaTrashAlt.svelte'
    import type {Decoration} from "../model/decoration";
    import {createEmptyDecoration} from "../model/decoration";
    import Panel from "./panel.svelte"

    let dispatcher = createEventDispatcher();

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

    function tagDecoration(str: string, decoration: Decoration) {
        let result = str;
        if (decoration.bold) {
            result = `<b>${result}</b>`;
        }
        if (decoration.strikethrough) {
            result = `<s>${result}</s>`;
        }
        if (decoration.colorEnabled) {
            result = `<span style="color: ${decoration.color}">${result}</span>`;
        }
        if (decoration.italics) {
            result = `<span class="italics">${result}</span>`;
        }
        return result;
    }

    export let decoration: Decoration = createEmptyDecoration();

    let valid = false;
    $: valid = decoration.startChar && decoration.endChar &&
        !decoration.startChar.includes(decoration.endChar) &&
        !decoration.endChar.includes(decoration.startChar);
</script>

<tr>
    <td class="icon">
        {#if valid}
            <div style="color:green">
                <FaRegCheckCircle/>
            </div>
        {:else}
            <div style="color:red">
                <FaExclamationTriangle/>
            </div>
        {/if}
    </td>
    <td><input type="text" size="4" bind:value={decoration.startChar}/></td>
    <td><input type="text" size="4" bind:value={decoration.endChar}/></td>
    <td class="color">
        <div>
            <input type="checkbox" bind:checked={decoration.colorEnabled}/>
        </div>
        <Panel name="設定変更">
            <span slot="name" style="color: {decoration.color}">{decoration.color}</span>
            <HsvPicker on:colorChange={(rgba) => {decoration.color = RGBAToHex(rgba.detail)}}
                       startColor={decoration.color}/>
        </Panel>
    </td>
    <td><input type="checkbox" bind:checked={decoration.bold}/></td>
    <td><input type="checkbox" bind:checked={decoration.italics}/></td>
    <td><input type="checkbox" bind:checked={decoration.strikethrough}/></td>
    <td><input type="checkbox" bind:checked={decoration.removal}/></td>
    <td class="sample">
        {decoration.startChar}サンプル{decoration.endChar} =>
        {#if decoration.removal}
            {@html tagDecoration("サンプル", decoration)}
        {:else}
            {@html tagDecoration(decoration.startChar + "サンプル" + decoration.endChar, decoration)}
        {/if}
    </td>
    <td class="icon" style="padding-left: 3em" on:click={dispatcher("delete", decoration)}>
        <FaTrashAlt/>
    </td>
</tr>
<style>
    td {
        text-align: center;
    }

    .color {
        margin-left: 2em;
        display: flex;
    }

    .color > div {
        align-self: center;
    }

    .sample :global .italics {
        display: inline-block;
        -webkit-transform: skewX(-15deg);
        -moz-transform: skewX(-15deg);
        -o-transform: skewX(-15deg);
        transform: skewX(-15deg);
        -ms-filter: "progid:DXImageTransform.Microsoft.Matrix(M11=1, M12=-0.26794919243112214, M21=0, M22=1, SizingMethod='auto expand')";
    }

    .icon {
        width: 32px;
        height: 32px;
    }
</style>