<script>
  import { onMount, createEventDispatcher } from 'svelte'

  export let playbackId
  export let hasAudio = false
  export let cover = false
  export let muted = true
  export let autoplayWithViewport = true
  export let onended = null

  const dispatch = createEventDispatcher()

  let videoEl
  let hls

  export function play() {
    return videoEl?.play()
  }

  export function setMuted(val) {
    if (videoEl) videoEl.muted = val
  }

  export function restart() {
    if (!videoEl) return
    videoEl.loop = true
    videoEl.currentTime = 0
    videoEl.play().catch(() => {})
  }

  export function pause() {
      videoEl?.pause()
  }

  onMount(async () => {
    if (!videoEl) return

    const src = `https://stream.mux.com/${playbackId}.m3u8`
    videoEl.muted = muted

    videoEl.addEventListener('playing', () => dispatch('videoPlaying'))
    if (onended) videoEl.addEventListener('ended', onended)

    const { default: Hls } = await import('hls.js')

    if (Hls.isSupported()) {
      hls = new Hls({ autoStartLoad: true })
      hls.loadSource(src)
      hls.attachMedia(videoEl)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoplayWithViewport) {
            setupViewport()
        } else {
            videoEl?.play().catch(() => {})
        }
      })
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = src
      if (autoplayWithViewport) setupViewport()
      else videoEl?.play().catch(() => {})
    }

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
  loop
  playsinline
  preload="auto"
  style="width:100%;height:100%;object-fit:{cover ? 'cover' : 'contain'};display:block;"
></video>