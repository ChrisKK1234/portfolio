<script>
import { onMount } from 'svelte';
    export let data;

    let media = null;

    onMount(() => {
        if (!data.content.ProfilePicture.filename) {
            media.classList.add('mask');
        }
    });
</script>

<a href={"/" + (data.full_slug)} draggable="false">
    <div class="profile">
        <div class="media" bind:this={media} style:background-color={data.content.ProfileColor.color}>
            {#if data.content.ProfilePicture.filename}
                <picture>
                    <source srcset={data.content.ProfilePicture.filename + "/m/200x200/filters:format(webp):quality(80)"} type="image/webp" />
                    <img src={data.content.ProfilePicture.filename} alt={data.content.Name} draggable="false" />
                </picture>
            {/if}
        </div>
        <div class="name">
            <h3>{data.content.ProfileName}</h3>
        </div>
    </div>
</a>