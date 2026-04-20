<script>
    import '../../app.css';
    import { page } from '$app/stores';
    import logotype from '$lib/assets/svg/logotype.svg';
    import NavLink from '$lib/atoms/NavLink.svelte';

    let { data, children } = $props();
</script>

<header class="header">
    <div class="logotype">
        <a href="/" draggable="false"><img src={logotype} alt="Logotype" draggable="false"></a>
    </div>
    {#if $page.url.pathname !== '/'}
        <nav class="nav">
            <NavLink href="/" text="Home" />
            {#each Object.values(data.links.links) as link}
                {#if link.is_folder === false && data.content.stories.some(s => s.slug === link.slug && s.content.isNavigation === true)}
                    <NavLink href={'/' + link.slug} text={link.name} />
                {/if}
            {/each}
        </nav>
    {/if}
</header>

<!-- Render chrildren -->
<div class="page">
    {#if children}
        {@render children()}
    {/if}
</div>