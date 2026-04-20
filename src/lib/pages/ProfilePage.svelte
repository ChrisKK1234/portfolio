<script>
    import Highlights from '../components/Highlights.svelte';

    export let data;
    export let relations;
    // console.log('ProfilePage data:', data);
</script>

<div class="content profile-page-template">
    {#each data.content.body as section}
        {#if section.component === 'highlights'}
            <Highlights data={section} relations={relations} />
        {/if}
    {/each}
</div>