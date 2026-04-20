<script>
import RichText from "$lib/atoms/RichText.svelte";
    export let data;
    console.log('ProjectPage data:', data);
</script>

<div class="content project-page-template">
    <div class="heading">
        <h1>{data.content.title}</h1>
    </div>
    <div class="blocks m-gap">
        {#each data.content.body as block}
            {#if block.component === 'text-columns'}
                <div class="text-columns">
                    {#each block.columns as column}
                        <div class="column">
                            <RichText content={column} />
                        </div>
                    {/each}
                </div>
            {:else if block.component === 'simple-media'}
                <div class="simple-media">
                    <picture>
                        <img 
                        draggable="false"
                        src={block.media.filename + "/m/400x0/filters:format(webp):quality(80)"}
                        srcset={`
                            ${block.media.filename}/m/400x0/filters:format(webp):quality(80) 400w,
                            ${block.media.filename}/m/800x0/filters:format(webp):quality(80) 800w,
                            ${block.media.filename}/m/1600x0/filters:format(webp):quality(80) 1600w,
                        `}
                        sizes="100vw"
                        alt={block.media.alt} 
                        />
                    </picture>
                </div>
            {:else if block.component === 'credits'}
                <div class="credits">
                    <div class="recognition">
                        <h3 class="title">{block.recognition}</h3>
                        <p class="awards">{block.text}</p>
                    </div>
                    <ul class="list">
                        {#each block.list as creditRow}
                        <li class="credit-row"><strong>{creditRow.role}:</strong> {creditRow.names}</li>
                        {/each}
                    </ul>
                </div>
            {/if}
        {/each}
    </div>
</div>