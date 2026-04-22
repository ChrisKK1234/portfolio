<script>
  import { onMount } from 'svelte'
  import { createEventDispatcher } from 'svelte'
  import Hls from 'hls.js'

  const dispatch = createEventDispatcher()

  const PLAYBACK_ID = 'FV6CbXr2wgDRgapolIVHkLyVY6KQZdaGWCEYZ1vXUOI'
  const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`

  let videoEl
  let state = 'loading'  // loading | ready | playing | done
  let hls

  onMount(() => {
    if (!videoEl) return

    function onReady() {
      if (state === 'loading') state = 'ready'
    }

    if (Hls.isSupported()) {
      hls = new Hls({ autoStartLoad: true })
      hls.loadSource(SRC)
      hls.attachMedia(videoEl)
      hls.on(Hls.Events.MANIFEST_PARSED, onReady)
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      videoEl.src = SRC
      videoEl.addEventListener('loadedmetadata', onReady)
    }

    videoEl.addEventListener('ended', handleEnded)

    // Fallback
    setTimeout(() => { if (state === 'loading') state = 'ready' }, 4000)

    return () => {
      hls?.destroy()
      videoEl?.removeEventListener('ended', handleEnded)
    }
  })

  function handlePlay() {
    if (!videoEl) return
    state = 'playing'
    videoEl.muted = false
    videoEl.play().catch(() => {
      // Browser blocked audio – play muted as fallback
      videoEl.muted = true
      videoEl.play()
    })
  }

  function handleEnded() {
    state = 'done'
    setTimeout(() => dispatch('done'), 700)
  }
</script>

<style>
  .landing {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.7s ease;
  }

  .landing.fade-out {
    opacity: 0;
    pointer-events: none;
  }

  video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .play-btn {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    backdrop-filter: blur(8px);
  }

  .play-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }

  .play-btn svg {
    margin-left: 4px;
  }

  .loader {
    position: relative;
    z-index: 10;
    width: 24px;
    height: 24px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>

<div class="landing" class:fade-out={state === 'done'}>
  <video bind:this={videoEl} playsinline preload="auto" muted></video>

  {#if state === 'loading'}
    <div class="loader"></div>
  {:else if state === 'ready'}
    <button class="play-btn" on:click={handlePlay} aria-label="Afspil">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    </button>
  {/if}
</div>