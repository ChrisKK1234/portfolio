<script>
    import Profile from "$lib/components/Profile.svelte";
    import { isMobile } from "$lib/store/device.js";
    export let data;
    console.log('ProfilePage data:', data);

    const profiles = [
      {
        name: "Chris",
        img: "",
        color: "#FF5733",
        full_slug: "profiles/chris",
        order: 1,
      },
      {
        name: "Future boss",
        img: "",
        color: "#33FF57",
        full_slug: "profiles/future-boss",
        order: 3,
      },
      {
        name: "Oscar",
        img: "",
        color: "#33C1FF",
        full_slug: "profiles/oscar",
        order: 2,
      },

    ];
</script>

<div class="content profiles-template">
    <div class="center-wrapper">
      <div class="heading">
        <h1>Who is watching?</h1>
      </div>

      <div class="profiles-wrapper">
        {#each profiles as profile, i}
            <Profile
                name={profile.name}
                img={profile.img}
                color={profile.color}
                full_slug={profile.full_slug}
                order={$isMobile ? i : i}
            />
        {/each}
      </div>
      
      <div class="m more-ads">
        <div class="text">
          <h4>Subscribe for more ads</h4>
        </div>
      </div>
    </div>

</div>