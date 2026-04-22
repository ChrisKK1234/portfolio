<script>
  import { onMount } from 'svelte'

  export let img
  export let full_slug
  export let color
  export let name
  export let order

  let media = null

  // Cloudinary URL transformation – resize til 200x200 webp
  function getCloudinaryUrl(url, width = 200, height = 200) {
    if (!url) return null
    // Indsæt transformation efter /upload/
    return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill,f_webp,q_80/`)
  }

  const imgWebp = img ? getCloudinaryUrl(img) : null

  onMount(() => {
    if (!img) {
      media.classList.add('mask')
    }
  })
</script>

<a href={"/" + full_slug} style={`order: ${order};`} draggable="false">
  <div class="profile">
    <div class="media" bind:this={media} style:background-color={color}>
      {#if img}
        <picture>
          <source srcset={imgWebp} type="image/webp" />
          <img src={img} alt={name} draggable="false" />
        </picture>
      {/if}
    </div>
    <div class="name">
      <h3>{name}</h3>
    </div>
  </div>
</a>