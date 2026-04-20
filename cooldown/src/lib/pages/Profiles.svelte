<script>
    import Profile from "$lib/components/Profile.svelte";
    export let data;
    console.log('ProfilePage data:', data);
</script>

<div class="content profiles-template">
    <div class="center-wrapper">
      <div class="heading">
        <h1>Who is watching?</h1>
      </div>

      <div class="profiles-wrapper">
        {#each data.stories as story}
            {#if story.content.component === 'profile-page'}
                <Profile data={story} />
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