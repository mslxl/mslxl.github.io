<script lang="ts">
  import { onMount } from "svelte"

    let editor: HTMLDivElement;
    let code = $state("")
    function refreshCode(){
        code = editor.innerHTML;
    }
    function execBoldCmd(){
        document.execCommand('bold');
        refreshCode();
    }
    function execItalicCmd(){
        document.execCommand('italic');
        refreshCode();
    }
    onMount(()=>{
        refreshCode();
    })
</script>
<div class="border rounded flex">
    <div class="flex-1 border-r p-4" contenteditable="true" bind:this={editor} oninput={refreshCode}>
        <p>Hello, World</p>
    </div>
    <div class="flex-1 flex flex-col">
        <div class="flex-1 border-b p-2" >
            <button type="button" onclick={execBoldCmd} class="border p-1">Bold</button>
            <button type="button" onclick={execItalicCmd} class="border p-1">Italic</button>
        </div>
        <div class="flex-1 p-2">
            <textarea class="w-full h-full border" readonly>{code}</textarea>
        </div>
    </div>
</div>
