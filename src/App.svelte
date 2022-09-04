<script lang="ts">
    import {speakerStore} from "./model/speaker";
    import converter from "./converter/converter";
    import Panel from "./lib/panel.svelte"
    import {sayStore} from "./model/say";
    import Message from "./lib/Message.svelte";
    import Output from "./lib/Output.svelte";

    let files: File[];
    let loaded = false;
    $: if (files && files.length > 0 && files[0].name) {
        speakerStore.clear();
        converter(files[0])
        loaded = true;
    }

</script>

<main class="container">
    <ol>
        <li>Chrome系ブラウザで、拡張機能「<a href="https://chrome.google.com/webstore/detail/discord/ofjlibelpafmdhigfgggickpejfomamk ">DiscordMate</a>」をインストールします。</li>
        <li>"Web版の"Discordで出力したいチャンネルを開き、アドレスバー右のDiscordMateのアイコンをクリックします。いない場合はハンマーのようなアイコンの中にあります</li>
        <li>Step 1 で日付を入力してSearchします。日付なしでは選べないようです。</li>
        <li>Export FormatをCSVに変更して、Exportします。</li>
        <li>下のフォームからExportしたCSVを選びます</li>
        <li>内容を確認して「出力」パネルから「Go!」すると、Wordのdocxファイルでダウンロードされます。仮で<a href="http://nameless.2box.jp/rakugakidou/index.html">楽描堂様</a>のA5テンプレートが入っています。</li>
    </ol>

    <input type="file" bind:files
           accept="text/csv">

    {#if loaded}
        <Panel name="発言者一覧">
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>表示名</th>
                </tr>
                </thead>
                <tbody>
                {#each $speakerStore as speaker}
                    <tr>
                        <td>{speaker.identity}</td>
                        <td><input type="text" bind:value={speaker.name}></td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </Panel>
        <Panel name="発言確認">
            <div class="normal">
            {#each $sayStore as message}
                <Message say="{message}"/>
            {/each}
            </div>
        </Panel>
        <Panel name="Word出力">
            <Output/>
        </Panel>
    {/if}
</main>

<style>
    .container {
        background-color: white;
    }

    .normal {
        display: grid;
        grid-template-columns: 150px 1fr;
        grid-row-gap: 1em;
    }
</style>