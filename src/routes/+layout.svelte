<script>
  import '../app.css'
  import { fade } from 'svelte/transition'
  import { beforeNavigate } from '$app/navigation'
  import { page } from '$app/stores'
  import logotype from '$lib/assets/svg/logotype.svg'

  export let data

  const { profiles, work, nav } = data

  let dropdownOpen = false

  $: isHome = $page.url.pathname === '/'

  // Sæt flag når man navigerer internt til home
  beforeNavigate(({ to }) => {
    if (to?.url.pathname === '/') {
      sessionStorage.setItem('internal_nav', 'true')
    }
  })
  $: isProject = $page.url.pathname.startsWith('/projects/')

  $: activeProfile = (() => {
    const match = $page.url.pathname.match(/^\/profiles\/([^/]+)/)
    if (match) return profiles.find(p => p.slug === match[1]) ?? null
    return null
  })()

  $: isFutureBoss = !activeProfile

  $: avatarUrl = activeProfile
    ? (activeProfile.profileImage?.cloudinary?.secure_url ?? activeProfile.profileImage?.url ?? null)
    : null

  $: avatarColor = activeProfile?.color ?? work?.color ?? '#33FF57'
  $: activeName = isFutureBoss ? (work?.name ?? 'Future Boss') : activeProfile?.name

  function toggleDropdown() {
    dropdownOpen = !dropdownOpen
  }

  function closeDropdown() {
    dropdownOpen = false
  }

  function getContactHref(item) {
    if (item.type === 'email') return `mailto:${item.value}`
    if (item.type === 'phone') return `tel:${item.value}`
    return item.value
  }

  function getProfileImg(profile) {
    return profile?.profileImage?.cloudinary?.secure_url
      ?? profile?.profileImage?.url
      ?? null
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://use.typekit.net/yhk7ick.css">
</svelte:head>

<svelte:window on:click={(e) => {
  if (dropdownOpen && !e.target.closest('.nav-right')) closeDropdown()
}} />

<header class="header">
  <div class="logotype">
    <a href="/" draggable="false">
      <img src={logotype} alt="Logotype" draggable="false" />
    </a>
  </div>
  
  <div class="nav-right">
    {#if isProject}
      <a href="/work" class="back-btn">← Work</a>
    {/if}
    {#if isHome}
      <!-- Hjemmeside: Contact knap -->
      <button class="contact-btn" on:click={toggleDropdown}>
        Contact
      </button>
    {:else}
      <!-- Andre sider: Avatar knap -->
      <button
        class="avatar-btn"
        on:click={toggleDropdown}
        aria-label="Profil menu"
        style={!avatarUrl ? `background-color: ${avatarColor}` : ''}
      >
        {#if avatarUrl}
          <img src={avatarUrl} alt={activeName ?? ''} draggable="false" />
        {/if}
      </button>
    {/if}

    {#if dropdownOpen}
      <div class="dropdown">

        {#if isHome}
          <!-- Hjemmeside dropdown: kun kontakt -->
          {#if nav?.contact?.length}
            <div class="dropdown-contact">
              {#each nav.contact as item}
                <a
                  href={getContactHref(item)}
                  class="dropdown-contact-item"
                  target={item.type === 'link' ? '_blank' : null}
                  rel={item.type === 'link' ? 'noopener noreferrer' : null}
                  on:click={closeDropdown}
                >
                  <span class="contact-label">{item.type === 'link' ? '' : item.label}</span>
                  <span class="contact-value">{item.type === 'link' ? item.label : item.value}</span>
                </a>
              {/each}
            </div>
          {/if}

        {:else}
          <!-- Andre sider dropdown: aktiv profil + go to all profiles + kontakt -->

          <!-- 1. Aktiv profil -->
          <div class="dropdown-current">
            <div
              class="dropdown-avatar-sm"
              style={!avatarUrl ? `background-color: ${avatarColor}` : ''}
            >
              {#if avatarUrl}
                <img src={avatarUrl} alt={activeName ?? ''} />
              {/if}
            </div>
            <span class="dropdown-current-name">{activeName}</span>
          </div>

          <div class="dropdown-divider"></div>

          <!-- 2. Go to all profiles -->
          <div class="dropdown-section">
            <a href="/" class="dropdown-item" on:click={closeDropdown}>
              <span class="dropdown-item-label">all profiles</span>
              <span class="dropdown-arrow">→</span>
            </a>
          </div>

          <!-- 3. Kontakt -->
          {#if nav?.contact?.length}
            <div class="dropdown-divider"></div>
            <div class="dropdown-contact">
              {#each nav.contact as item}
                <a
                  href={getContactHref(item)}
                  class="dropdown-contact-item"
                  target={item.type === 'link' ? '_blank' : null}
                  rel={item.type === 'link' ? 'noopener noreferrer' : null}
                  on:click={closeDropdown}
                >
                  <span class="contact-label">{item.type === 'link' ? '' : item.label}</span>
                  <span class="contact-value">{item.type === 'link' ? item.label : item.value}</span>
                </a>
              {/each}
            </div>
          {/if}

        {/if}
      </div>
    {/if}
  </div>
</header>

<div class="page">
  <!-- {#key $page.url.pathname}
    <div in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
    </div>
    {/key} -->
    <slot />
</div>

<style>
    @view-transition {
        navigation: auto;
    }
  .nav-right { position: relative; height: 100%; font-family: 'geologica-variable', sans-serif; display: flex; align-items: center; gap: var(--sm); }

  .back-btn { font-family: 'geologica-variable', sans-serif; font-size: var(--text-sm); font-weight: 100; line-height: 1; padding: 0; color: var(--color-white); text-decoration: none; opacity: 1; transition: opacity 0.15s; }
  .back-btn:hover { opacity: 0.7; }

  .contact-btn { background: none; border: none; cursor: pointer; font-weight: 100; line-height: 1; font-size: 13px; color: var(--color-white); letter-spacing: 0.04em; opacity: 0.7; transition: opacity 0.15s; }
  .contact-btn:hover { opacity: 1; }

  .avatar-btn { position: relative; width: auto; height: 100%; max-height: 100%; aspect-ratio: 1/1; border-radius: var(--rounded-xs); border: none; cursor: pointer; overflow: hidden; padding: 0; flex-shrink: 0; }
  .avatar-btn img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .avatar-btn .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%); opacity: 1; transition: opacity 0.15s; }
  .avatar-btn:hover .overlay { opacity: 0; }

  .dropdown { position: absolute; top: calc(100% + 10px); right: 0; min-width: 220px; background: var(--color-darkest, #111); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; overflow: hidden; z-index: 100; }
  .dropdown-current { display: flex; align-items: center; gap: 10px; padding: 14px 16px; }
  .dropdown-current-name { font-size: 13px; font-weight: 600; color: var(--color-white); }
  .dropdown-divider { height: 1px; background: rgba(255, 255, 255, 0.08); }
  .dropdown-section { padding: 4px 0; }
  .dropdown-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; text-decoration: none; color: var(--color-white); font-size: 13px; transition: background 0.15s; }
  .dropdown-item:hover { background: rgba(255, 255, 255, 0.06); }
  .dropdown-item-label { font-weight: 400; color: var(--color-dark); transition: color 0.15s; }
  .dropdown-item:hover .dropdown-item-label { color: var(--color-white); }
  .dropdown-arrow { opacity: 0.4; transition: opacity 0.15s; }
  .dropdown-item:hover .dropdown-arrow { opacity: 1; }
  .dropdown-avatar-sm { width: 24px; height: 24px; border-radius: 4px; overflow: hidden; flex-shrink: 0; }
  .dropdown-avatar-sm img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .dropdown-contact { padding: 12px 16px; display: flex; flex-direction: column; gap: 2px; }
  .dropdown-contact-item { display: flex; flex-direction: column; gap: 0px; text-decoration: none; padding: 6px 0; line-height: 1.2; transition: opacity 0.15s; }
  .dropdown-contact-item:hover { opacity: 0.7; }

  .contact-label { font-size: 10px; font-weight: 400; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-dark); }
  .contact-value { font-size: 13px; color: var(--color-white); font-weight: 100; }
</style>
