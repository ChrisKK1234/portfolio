<script>
  import { onMount } from 'svelte'
  import Profile from '$lib/components/Profile.svelte'
  import LandingExperience from '$lib/components/LandingExperience.svelte'
  import { isMobile } from '$lib/store/device.js'

  export let data

  const { orderedItems } = data

  let showLanding = false

  onMount(() => {
    const cameFromInternal = sessionStorage.getItem('internal_nav') === 'true'
    if (!cameFromInternal) {
      showLanding = true
    }
    // Flaget ryddes IKKE her – beforeNavigate i layout sætter det ved næste navigation
    // Ved direkte visit (refresh/ekstern) er flaget aldrig sat så landing vises
  })

  function handleLandingDone() {
    showLanding = false
  }

  function getProfileImageUrl(profile) {
    if (!profile.profileImage) return ''
    return profile.profileImage?.cloudinary?.secure_url ?? profile.profileImage?.url ?? ''
  }
</script>

{#if showLanding}
  <LandingExperience on:done={handleLandingDone} />
{/if}

<div class="content profiles-template">
  <div class="center-wrapper">
    <div class="heading">
      <h1>Who is watching?</h1>
    </div>

    <div class="profiles-wrapper">
      {#each orderedItems as item, i}
        {#if item.type === 'work'}
          <Profile
            name={item.data?.name ?? 'Future Boss'}
            img=""
            color={item.data?.color ?? '#33FF57'}
            full_slug="work"
            order={$isMobile ? i : i}
          />
        {:else}
          <Profile
            name={item.data.name}
            img={getProfileImageUrl(item.data)}
            color={item.data.color ?? '#000000'}
            full_slug="profiles/{item.data.slug}"
            order={$isMobile ? i : i}
          />
        {/if}
      {/each}
    </div>

    <div class="m more-ads">
      <div class="text">
        <h4>Subscribe for more ads</h4>
      </div>
    </div>
  </div>
</div>