<!-- Profiles page -->
<script>
  import MuxVideo from '$lib/components/MuxVideo.svelte'

  export let data
  const { profile } = data

  let videoMuted = true

  function renderRichText(content) {
    if (!content?.root?.children) return '';
    return content.root.children.map(renderNode).join('');
  }

  function renderNode(node) {
    if (node.type === 'text') {
      let text = node.text ?? '';
      if (node.format & 1) text = `<strong>${text}</strong>`;
      if (node.format & 2) text = `<em>${text}</em>`;
      return text;
    }
    if (node.type === 'paragraph') {
      const children = (node.children ?? []).map(renderNode).join('');
      return `<p>${children}</p>`;
    }
    if (node.type === 'heading') {
      const tag = node.tag ?? 'h3';
      const children = (node.children ?? []).map(renderNode).join('');
      return `<${tag}>${children}</${tag}>`;
    }
    if (node.type === 'linebreak') return '<br>';
    return (node.children ?? []).map(renderNode).join('');
  }

  function getHeroImageUrl(profile) {
    if (profile.heroType !== 'media' || !profile.heroMedia) return null;
    return profile.heroMedia?.cloudinary?.secure_url ?? profile.heroMedia?.url ?? null;
  }

  $: isMuxHero = profile.heroType === 'mux' && profile.heroMux?.playbackId
  $: heroImageUrl = getHeroImageUrl(profile)
  $: bioHtml = renderRichText(profile.bio)
</script>

<style>
  .duo-info { align-content: center; min-height: 100svh; padding: calc(var(--md) * 3) 0; }
  .duo-info .wrapper { width: 100%; }
  .duo-info .wrapper .title { color: var(--color-white); line-height: 1; margin: auto; margin-bottom: var(--lg); }
  .duo-info .wrapper .bio-wrapper { width: 100%; margin: auto; max-width: 910px; display: flex; gap: var(--md); justify-content: space-between; margin-top: 2rem; }
  .duo-info .wrapper .bio-wrapper .bio-text { color: var(--color-white); width: 100%; min-width: 300px; max-width: 500px; text-align: left; }
  .duo-info .wrapper .bio-wrapper .bio-text :global(h3) { text-transform: none; margin-bottom: var(--xs); line-height: 1; }
  .duo-info .wrapper .bio-wrapper .bio-text :global(p) { margin: 0; }
  .duo-info .wrapper .bio-wrapper .bio-text :global(p + p) { margin-top: 1rem; }
  .duo-info .wrapper .bio-wrapper .media { border-radius: var(--rounded-md); overflow: hidden; max-width: 300px; position: relative; }
  .duo-info .wrapper .bio-wrapper .media img { width: 100%; height: auto; display: block; }
  .duo-info .wrapper .bio-wrapper .media .mux-wrap { width: 300px; height: 450px; }

  .mute-btn { position: absolute; bottom: 12px; right: 12px; width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; z-index: 10; }
  .mute-btn:hover { background: rgba(0,0,0,0.75); }

  @media (max-width: 750px) {
    .duo-info .wrapper .bio-wrapper { flex-direction: column-reverse; align-items: center; }
    .duo-info .wrapper .bio-wrapper .bio-text { width: 100%; margin: auto; text-align: center; }
    .duo-info .wrapper .bio-wrapper .media { width: 100%; }
    .duo-info .wrapper .bio-wrapper .media .mux-wrap { width: 100%; height: 300px; }
  }
</style>

<div class="content profile-page-template">
  <div class="duo-info">
    <div class="wrapper">
      <h1 class="title">{profile.title ?? profile.name}</h1>
      <div class="bio-wrapper">
        <div class="bio-text">
          {@html bioHtml}
        </div>
        {#if isMuxHero}
          <div class="media">
            <div class="mux-wrap">
              <MuxVideo
                playbackId={profile.heroMux.playbackId}
                hasAudio={!profile.heroMuted}
                cover={true}
                bind:muted={videoMuted}
              />
            </div>
            {#if !profile.heroMuted}
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
        {:else if heroImageUrl}
          <div class="media">
            <img src={heroImageUrl} alt={profile.name} loading="lazy" />
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>