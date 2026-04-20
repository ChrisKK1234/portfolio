<script>
import { page } from '$app/stores';
import Profiles from "$lib/pages/Profiles.svelte";
import ProfilePage from "$lib/pages/ProfilePage.svelte";
import ProjectPage from "$lib/pages/ProjectPage.svelte";
import Page from "$lib/pages/Page.svelte";

  let { data } = $props();
  let DocTitle = '';
  console.log('Page data:', data);
</script>

<svelte:head>
  <title>{DocTitle}</title>
  <link rel="stylesheet" href="https://use.typekit.net/yhk7ick.css">
</svelte:head>

{#if $page.url.pathname === '/'}
  <Profiles data={data.content} />

{:else if data.story}
<!-- <p style="position: fixed; top: 0; left: 0; margin: 2px; color: #fff;">{data.story.content.component}</p> -->
  {#if data.story.content.component === 'profile-page'}
    <ProfilePage data={data.story} relations={data.relations} />
  {:else if data.story.content.component === 'project-page'}
    <ProjectPage data={data.story} />
  {:else if data.story.content.component === 'page'}
    <Page data={data.story} />
  {/if}
{/if}