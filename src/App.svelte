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
        <Panel name="ログファイルの準備">
            <h2>Discord</h2>
            <h3>Discord Chat Exporterを使う</h3>
            <ol>
                <li>ダウンロードして利用する形式のDiscord非公式ツールです。基本的な使い方は、<a
                        href="https://note.com/as_hr/n/n1dfec743eedf">明日原様のnote</a>や検索で確認して下さい。
                </li>
                <li>チャンネル選択後、右下のボタンを押して出てきたウィンドウで、FormatをCSVに変更して、Exportします。</li>
            </ol>
            <h3>DiscordMateを使う</h3>
            <ol>
                <li>Chrome系ブラウザで、拡張機能「<a
                        href="https://chrome.google.com/webstore/detail/discord/ofjlibelpafmdhigfgggickpejfomamk ">DiscordMate</a>」をインストールします。
                </li>
                <li>"Web版の"Discordで出力したいチャンネルを開き、アドレスバー右のDiscordMateのアイコンをクリックします。いない場合はハンマーのようなアイコンの中にあります</li>
                <li>Step 1 で開始日時と終了日時を入力してSearchします。500発言以上は出力に失敗することがあります。</li>
                <li>Export FormatをCSVに変更して、Exportします。</li>
            </ol>
            <h2>ココフォリア</h2>
            ココフォリアv1.22.5が出力するものと同じ形式のHTMLファイルを読み込むことができます。タブ情報は区別しません。
        </Panel>
    {/if}

    <input type="file" bind:files
           accept="text/csv,text/html"
           style="margin-top: 2rem">

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
<footer>
    <span><a href="./readme.html" target="_black">README & LICENSE</a></span><br/>
    <span>logcone {__APP_VERSION__}</span>
</footer>

<style>
    .normal {
        display: grid;
        grid-template-columns: 150px 1fr;
        grid-row-gap: 1em;
    }
</style>