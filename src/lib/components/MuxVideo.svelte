<script>
  import { onMount } from 'svelte'

  export let playbackId
  export let hasAudio = false
  export let cover = false
  export let muted = true
  export let autoplayWithViewport = true
  export let onended = null

  let videoEl

  export function play() {
    return videoEl?.play()
  }

  export function setMuted(val) {
    if (videoEl) videoEl.muted = val
  }

  onMount(() => {
    if (!videoEl) return
    videoEl.muted = muted
    if (onended) videoEl.addEventListener('ended', onended)
    if (autoplayWithViewport) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) videoEl.play().catch(() => {})
          else videoEl.pause()
        },
        { threshold: 0.1 }
      )
      observer.observe(videoEl)
      return () => {
        observer.disconnect()
        if (onended) videoEl?.removeEventListener('ended', onended)
      }
    }
    return () => {
      if (onended) videoEl?.removeEventListener('ended', onended)
    }
  })

  $: if (videoEl) videoEl.muted = muted
</script>

<video
  bind:this={videoEl}
  src="https://stream.mux.com/{playbackId}.m3u8"
  autoplay={autoplayWithViewport}
  muted
  loop={autoplayWithViewport}
  playsinline
  preload="none"
  style="width:100%;height:100%;object-fit:{cover ? 'cover' : 'contain'};display:block;"
></video>