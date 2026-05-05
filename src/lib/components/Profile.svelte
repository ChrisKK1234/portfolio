<script>
  import defaultImg from '$lib/assets/svg/default.svg'
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

<style>
  .profile .media.default-img img { background-color: transparent; opacity: 0.5; width: 30%; object-fit: contain; }
  .profile .media { transform-origin: center; transition: transform 0.3s ease; }

  @media (min-width: 750px) {
    .profile:hover .media { transform: scale(0.98); }
  }
</style>

<a href={"/" + full_slug} style={`order: ${order};`} draggable="false">
  <div class="profile">
    <div class="media" class:default-img={img ? false : true} bind:this={media} style:background-color={color}>
        <picture>
          <source srcset={imgWebp} type="image/webp" />
          <img src={img ? img : defaultImg} alt={name} draggable="false" />
        </picture>
    </div>
    <div class="name">
      <h3>{name}</h3>
    </div>
  </div>
</a>