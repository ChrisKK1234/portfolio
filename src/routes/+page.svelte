<script>
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import Profile from '$lib/components/Profile.svelte'
  import LandingExperience from '$lib/components/LandingExperience.svelte'
  import { isMobile } from '$lib/store/device.js'

  export let data

  const { orderedItems } = data

  // Start med sort overlay – fjernes hvis intern navigation
  let showLanding = false
  let landingChecked = false

  onMount(() => {
    const cameFromInternal = sessionStorage.getItem('internal_nav') === 'true'
    if (cameFromInternal) {
      showLanding = false
    }
    landingChecked = true
  })

  function handleLandingDone() {
    showLanding = false
  }

  function getProfileImageUrl(profile) {
    if (!profile.profileImage) return ''
    return profile.profileImage?.cloudinary?.secure_url ?? profile.profileImage?.url ?? ''
  }
</script>

{#if showLanding && landingChecked}
  <LandingExperience on:done={handleLandingDone} />
{:else if !landingChecked}
  <div style="position:fixed;inset:0;background:#000;z-index:1000;"></div>
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

    <button class=" more-ads btn" on:click={() => goto('/contact')}>
      <div class="text">
        <h4>Subscribe for more ads</h4>
      </div>
    </button>
  </div>
</div>