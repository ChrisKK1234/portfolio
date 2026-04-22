<script>
  import { onMount } from 'svelte'

  export let playbackId
  export let hasAudio = false
  export let cover = false
  export let muted = true
  export let autoplayWithViewport = true
  export let onended = null

  let videoEl
  let hls

  export function play() {
    return videoEl?.play()
  }

  export function setMuted(val) {
    if (videoEl) videoEl.muted = val
  }

  onMount(async () => {
    if (!videoEl) return

    const src = `https://stream.mux.com/${playbackId}.m3u8`
    videoEl.muted = muted

    // Dynamisk import – kører kun i browser
    const { default: Hls } = await import('hls.js')

    if (Hls.isSupported()) {
      hls = new Hls({ autoStartLoad: true })
      hls.loadSource(src)
      hls.attachMedia(videoEl)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoplayWithViewport) setupViewport()
      })
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = src
      if (autoplayWithViewport) setupViewport()
    }

    if (onended) videoEl.addEventListener('ended', onended)

    return () => {
      hls?.destroy()
      if (onended) videoEl?.removeEventListener('ended', onended)
    }
  })

  function setupViewport() {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) videoEl?.play().catch(() => {})
        else videoEl?.pause()
      },
      { threshold: 0.1 }
    )
    observer.observe(videoEl)
  }

  $: if (videoEl) videoEl.muted = muted
</script>

<video
  bind:this={videoEl}
  autoplay={autoplayWithViewport}
  muted
  loop={autoplayWithViewport}
  playsinline
  preload="none"
  style="width:100%;height:100%;object-fit:{cover ? 'cover' : 'contain'};display:block;"
></video>