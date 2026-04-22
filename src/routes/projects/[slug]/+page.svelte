<!-- Project page -->
<script>
  import RichText from '$lib/atoms/RichText.svelte'
  import MuxVideo from '$lib/components/MuxVideo.svelte'

  export let data
  const { project } = data

  let videoMuted = true

  function getMediaUrl(media, width = 1600) {
    if (!media) return ''
    const url = media?.cloudinary?.secure_url ?? media?.url ?? ''
    if (!url || !url.includes('/upload/')) return url
    return url.replace('/upload/', `/upload/w_${width},f_webp,q_80/`)
  }
</script>

<style>
  .m-gap > * { margin-bottom: var(--m-gap); }
  .m-gap > :last-of-type { margin-bottom: var(--md); }
  .project-page-template.content { padding: 0 var(--md); padding-top: calc(var(--md) * 3); color: var(--color-white); padding-bottom: var(--md); text-align: center; }
  .project-page-template.content .heading { width: fit-content; margin: 0 auto; line-height: 0.9; margin-bottom: var(--m-gap); }
  .text-columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--md); }
  .text-columns .column { text-align: left;}
  .simple-media { width: 100%; height: auto; max-height: 90svh; overflow: hidden; }
  .simple-media img { display: block; width: auto; height: auto; max-width: 100%; max-height: 90svh; margin: auto; object-fit: contain; }
  .simple-media .mux-wrap { position: relative; width: 100%; max-height: 90svh; }
  .media-grid { display: grid; grid-template-columns: repeat(3, minmax(250px, 1fr)); gap: var(--sm); }
  .media-grid .item { width: 100%; height: auto; overflow: hidden; }
  .media-grid .item img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .credits { text-align: left; }
  .credits .recognition { line-height: 1; padding-bottom: var(--md); }
  .credits .awards { font-size: var(--text-md); }
  .credits .list { list-style: none; padding: 0; margin: 0; }
  .credits .list .credit-row { font-size: var(--text-md); line-height: 1; }
  .credits .list .credit-row strong { font-weight: 700; text-transform: uppercase; }
  .mute-btn { position: absolute; bottom: 12px; right: 12px; width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; z-index: 10; }
  .mute-btn:hover { background: rgba(0,0,0,0.75); }
  @media (max-width: 1000.5px) { .media-grid { grid-template-columns: repeat(2, minmax(250px, 1fr)); } }
  @media (max-width: 750.5px) {
    .media-grid { grid-template-columns: 1fr; gap: var(--md); }
    .text-columns .column { text-align: center; max-width: 400px; margin: auto;}
  }
</style>

<div class="content project-page-template">
  <div class="heading">
    <h1>{project.title}</h1>
  </div>
  <div class="blocks m-gap">
    {#each project.fields ?? [] as block}

      {#if block.blockType === 'contextText'}
        <div class="text-columns">
          {#if block.col1}<div class="column"><RichText content={block.col1} /></div>{/if}
          {#if block.columns !== '1' && block.col2}<div class="column"><RichText content={block.col2} /></div>{/if}
          {#if block.columns === '3' && block.col3}<div class="column"><RichText content={block.col3} /></div>{/if}
        </div>

      {:else if block.blockType === 'simpleMedia'}
        <div class="simple-media">
          {#if block.mediaType === 'mux' && block.mediaMux?.playbackId}
            <div class="mux-wrap">
              <MuxVideo
                playbackId={block.mediaMux.playbackId}
                hasAudio={!block.mediaMuted}
                cover={false}
                bind:muted={videoMuted}
              />
              {#if !block.mediaMuted}
                <button class="mute-btn" on:click={() => videoMuted = !videoMuted} aria-label={videoMuted ? 'Slå lyd til' : 'Slå lyd fra'}>
                    {#if videoMuted}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <line x1="23" y1="9" x2="17" y2="15"/>
                        <line x1="17" y1="9" x2="23" y2="15"/>
                    </svg>
                    {:else}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </svg>
                    {/if}
                </button>
                {/if}
            </div>
          {:else if block.mediaMedia}
            <picture>
              <source srcset="{getMediaUrl(block.mediaMedia, 400)} 400w, {getMediaUrl(block.mediaMedia, 800)} 800w, {getMediaUrl(block.mediaMedia, 1600)} 1600w" sizes="100vw" type="image/webp" />
              <img loading="lazy" draggable="false" src={getMediaUrl(block.mediaMedia, 1600)} alt={block.mediaMedia?.alt ?? ''} />
            </picture>
          {/if}
        </div>

      {:else if block.blockType === 'multipleImages'}
        <div class="media-grid">
          {#each block.images ?? [] as item}
            {#if item.image}
              <div class="item">
                <img src={getMediaUrl(item.image, 800)} alt={item.image?.alt ?? ''} draggable="false" loading="lazy" />
              </div>
            {/if}
          {/each}
        </div>

      {:else if block.blockType === 'credits'}
        <div class="credits">
          {#if block.recognitions?.length}
            <div class="recognition">
              {#each block.recognitions as r}
                <h3 class="title">Recognition</h3>
                <p class="awards">{r.text}</p>
              {/each}
            </div>
          {/if}
          {#if block.creditsList?.length}
            <ul class="list">
              {#each block.creditsList as credit}
                <li class="credit-row"><strong>{credit.role}:</strong> {credit.name}</li>
              {/each}
            </ul>
          {/if}
        </div>

      {/if}
    {/each}
  </div>
</div>