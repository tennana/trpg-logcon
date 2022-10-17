<script lang="ts">
    import converter from "./converter/converter";
    import CharacterDecoration from "./lib/CharacterDecoration.svelte";
    import Message from "./lib/Message.svelte";
    import Output from "./lib/Output.svelte";
    import Panel from "./lib/panel.svelte"
    import Speaker from "./lib/Speaker.svelte";
    import {sayStore} from "./model/say";
    import {speakerStore} from "./model/speaker";

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
        <li>対応ツールを使ってログファイルをエクスポートします。対応ツールについては下のパネルから確認して下さい。</li>
        <li>下のフォームからエクスポートしたCSVを選ぶとファイルが読み込まれます。</li>
        <li>内容を確認して「出力」パネルから「Go!」すると、Wordのdocxファイルでダウンロードされます。仮で<a
                href="http://nameless.2box.jp/rakugakidou/index.html">楽描堂様</a>のA5テンプレートが入っています。
        </li>
    </ol>
    {#if !loaded}
        <Panel name="1.ログファイルの準備">
            <h3>Discord Chat Exporterを使う</h3>
            <ol>
                <li>ダウンロードして利用する形式のDiscord非公式ツールです。基本的な使い方は、<a
                        href="https://note.com/as_hr/n/n1dfec743eedf">明日原様のnote</a>や検索で確認して下さい。
                </li>
                <li>歯車マークからDateFormatを「dd-MMM-yy hh:mm:ss tt」にするなどして、秒数まで含まれるようにしてください。</li>
                <li>チャンネル選択後、右下のボタンを押して出てきたウィンドウで、FormatをCSVに変更して、Exportします。</li>
            </ol>
            <h3>DiscordMateを使う</h3>
            <ol>
                <li>Chrome系ブラウザで、拡張機能「<a
                        href="https://chrome.google.com/webstore/detail/discord/ofjlibelpafmdhigfgggickpejfomamk ">DiscordMate</a>」をインストールします。
                </li>
                <li>"Web版の"Discordで出力したいチャンネルを開き、アドレスバー右のDiscordMateのアイコンをクリックします。いない場合はハンマーのようなアイコンの中にあります</li>
                <li>Step 1 で日付を入力してSearchします。日付なしでは選べないようです。</li>
                <li>Export FormatをCSVに変更して、Exportします。</li>
            </ol>
        </Panel>
    {/if}

    <input type="file" bind:files
           accept="text/csv">

    {#if loaded}
        <Panel name="発言者一覧">
            <Speaker/>
        </Panel>
        <Panel name="装飾設定">
            <CharacterDecoration/>
        </Panel>
        <Panel name="発言確認">
            <div class="normal">
                {#each $sayStore as message}
                    <Message say="{message}"/>
                {/each}
            </div>
        </Panel>
        <Panel name="出力">
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