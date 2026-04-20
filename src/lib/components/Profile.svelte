<script>
import { onMount } from 'svelte';
    export let img;
    export let full_slug;
    export let color;
    export let name;
    export let order;

    let media = null;

    onMount(() => {
        if (!img) {
            media.classList.add('mask');
        }
    });
</script>

<a href={"/" + (full_slug)} style={`order: ${order};`} draggable="false">
    <div class="profile">
        <div class="media" bind:this={media} style:background-color={color}>
            {#if img}
                <picture>
                    <source srcset={img + "/m/200x200/filters:format(webp):quality(80)"} type="image/webp" />
                    <img src={img} alt={name} draggable="false" />
                </picture>
            {/if}
        </div>
        <div class="name">
            <h3>{name}</h3>
        </div>
    </div>
</a>