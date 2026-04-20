<script>
import RichText from "$lib/atoms/RichText.svelte";
    export let data;
    console.log('ProjectPage data:', data);
</script>

<style>
    .m-gap > * { margin-bottom: var(--m-gap); }
    .m-gap > :last-of-type { margin-bottom: var(--md); }

    .project-page-template.content { padding: 0 var(--md); padding-top: calc(var(--md) * 3 + var(--m-gap)); color: var(--color-white); text-align: center; }
    .project-page-template.content .heading { width: fit-content; margin: 0 auto; line-height: 0.9; margin-bottom: var(--m-gap); }

    .text-columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--md); }

    .simple-media { width: 100%; max-width: 100vw; height: auto; max-height: 90svh; overflow: hidden; }
    .simple-media picture > * { display: block; width: 100%; height: 100%; object-fit: contain; }

    .media-grid { display: grid; grid-template-columns: repeat(3, minmax(250px, 1fr)); gap: var(--sm); }
    .media-grid .item { width: 100%; height: auto; overflow: hidden; }
    .media-grid .item img { display: block; width: 100%; height: 100%; object-fit: cover; }

    .credits .recognition { line-height: 1; padding-bottom: var(--md); }
    .credits .awards { font-size: var(--text-md); }
    .credits .list { list-style: none; padding: 0; margin: 0; }
    .credits .list .credit-row { font-size: var(--text-md); line-height: 1; }
    .credits .list .credit-row strong { font-weight: 700; text-transform: uppercase; }

    @media (max-width: 1000.5px) {
        .media-grid { grid-template-columns: repeat(2, minmax(250px, 1fr)); }
    }
    @media (max-width: 750.5px) {
        .media-grid { grid-template-columns: 1fr; gap: var(--md); }
    }
</style>

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
        <div class="media-grid">
            <div class="item"><img src="http://unsplash.it/400/600?random&gravity=center" alt=""></div>
            <div class="item"><img src="http://unsplash.it/400/600?random&gravity=center" alt=""></div>
            <div class="item"><img src="http://unsplash.it/400/600?random&gravity=center" alt=""></div>
            <div class="item"><img src="http://unsplash.it/400/600?random&gravity=center" alt=""></div>
            <div class="item"><img src="http://unsplash.it/400/600?random&gravity=center" alt=""></div>
            <div class="item"><img src="http://unsplash.it/400/600?random&gravity=center" alt=""></div>
        </div>
    </div>
</div>