<script>
  import '../app.css'
  import { fade } from 'svelte/transition'
  import { beforeNavigate } from '$app/navigation'
  import { page } from '$app/stores'
  import logotype from '$lib/assets/svg/logotype.svg'
  import defaultImg from '$lib/assets/svg/default.svg'

  export let data

  const { profiles, work, nav } = data

  $: isHome = $page.url.pathname === '/'

  beforeNavigate(({ to }) => {
    if (to?.url.pathname === '/') {
      sessionStorage.setItem('internal_nav', 'true')
    }
  })
  $: isProject = $page.url.pathname.startsWith('/projects/')
  $: isProfile = $page.url.pathname.startsWith('/profiles/')

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
</script>

<svelte:head>
  <link rel="stylesheet" href="https://use.typekit.net/yhk7ick.css">
</svelte:head>

<header class="header">
  <div class="logotype">
    <a href="/work" draggable="false">
      <img src={logotype} alt="Logotype" draggable="false" />
    </a>
  </div>
  
  <div class="nav-right">
    {#if isProject}
      <a href="/work" class="back-btn">Back</a>
    <!-- {:else if isProfile}
      <a href="/" class="back-btn">Back</a> -->
    {/if}
    {#if !isHome}
      <div class="avatar-wrapper">
        <button
          class="avatar-btn"
          class:default-img={!avatarUrl}
          aria-label="Profil menu"
          style={!avatarUrl ? `background-color: ${avatarColor}` : ''}
        >
          <span class="overlay"></span>
          <img src={avatarUrl ? avatarUrl : defaultImg} alt={activeName ?? ''} draggable="false" />
        </button>

        <div class="dropdown">
          <div class="dropdown-inner">
            <div class="dropdown-section">
              <a href="/" class="dropdown-item">
                <span class="dropdown-item-label">Profiles</span>
              </a>
            </div>
            <div class="dropdown-section">
              <a href="/work" class="dropdown-item">
                <span class="dropdown-item-label">Projects</span>
              </a>
            </div>
            <div class="dropdown-section">
              <a href="/contact" class="dropdown-item">
                <span class="dropdown-item-label">Contact</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</header>

<div class="page">
  <slot />
</div>

<style>
  @view-transition {
    navigation: auto;
  }

  .nav-right {
    position: relative;
    height: 100%;
    font-family: 'geologica-variable', sans-serif;
    display: flex;
    align-items: center;
    gap: var(--sm);
  }

  .back-btn {
    font-family: 'geologica-variable', sans-serif;
    font-size: var(--text-sm);
    font-weight: 100;
    line-height: 1;
    padding: 0;
    color: var(--color-white);
    text-decoration: none;
    opacity: 0.7;
    transition: opacity 0.15s;
  }
  .back-btn:hover { opacity: 1; }

  .avatar-wrapper {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .avatar-btn {
    position: relative;
    width: auto;
    height: 100%;
    max-height: 100%;
    aspect-ratio: 1/1;
    border-radius: var(--rounded-xs);
    border: none;
    cursor: pointer;
    overflow: hidden;
    padding: 0;
    flex-shrink: 0;
  }
  .avatar-btn img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .avatar-btn.default-img img { background-color: transparent; opacity: 0.5; width: 35%; object-fit: contain; margin: auto; }
  .avatar-btn .overlay {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%);
    opacity: 1;
    transition: opacity 0.15s;
  }
  .avatar-btn:hover .overlay { opacity: 0.25; }

  .dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    padding-top: 10px; /* gap mellem avatar og dropdown uden at miste hover */
    min-width: fit-content;
    opacity: 0;
    pointer-events: none;
    transform: translateY(-4px);
    transition: opacity 0.15s, transform 0.15s;
    z-index: 100;
  }

  .avatar-wrapper:hover .dropdown {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .dropdown-inner {
    background: var(--color-darkest, #111);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--rounded-xs);
    overflow: hidden;
  }

  .dropdown-section { padding: 4px 0; }
  .dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    text-decoration: none;
    color: var(--color-white);
    font-size: 13px;
    transition: background 0.15s;
  }
  .dropdown-item:hover { background: rgba(255, 255, 255, 0.06); }
  .dropdown-item-label {
    font-weight: 400;
    color: var(--color-dark);
    transition: color 0.15s;
  }
  .dropdown-item:hover .dropdown-item-label { color: var(--color-white); }

  @media (min-width: 750px) {
    .avatar-wrapper::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 100%; 
    height: 100%; 
    box-sizing: content-box;
    padding: 50%;
    opacity: 0;
    z-index: 101;
  }
  }
</style>