<script>
    import { page } from '$app/stores';
    import Highlights from '../components/Highlights.svelte';

    export let data;
    export let relations;
    // console.log('ProfilePage data:', data);
</script>

<style>
    .duo-info { align-content: center; min-height: 100svh; }
    .duo-info .wrapper { width: 100%; }
    
    .duo-info .wrapper .title { color: var(--color-white); line-height: 1; margin: auto; margin-bottom: var(--lg); }
    .duo-info .wrapper .bio-wrapper { width: 100%; margin: auto; max-width: 910px; display: flex; gap: 2rem; justify-content: space-between; margin-top: 2rem; }
    .duo-info .wrapper .bio-wrapper .text { color: var(--color-white); width: 100%; min-width: 300px; max-width: 500px; }

    .duo-info .wrapper .bio-wrapper .media { border-radius: var(--rounded-md); overflow: hidden; max-width: 300px; }
    .duo-info .wrapper .bio-wrapper .media img { width: 100%; height: auto; display: block; }

    @media (max-width: 750.0px) {
        .duo-info .wrapper .bio-wrapper { flex-direction: column-reverse; align-items: center; }
        .duo-info .wrapper .bio-wrapper .text { width: 100%; margin: auto; }
        .duo-info .wrapper .bio-wrapper .media { width: 100%; }
    }
</style>

<div class="content profile-page-template">
        {#if $page.url.pathname.split('/').includes('future-boss')}
            <Highlights data={data.content.body[0]} relations={relations} />
        {:else}
            <div class="duo-info">
                <div class="wrapper">
                    <h1 class="title">On a Good day half of the duo</h1>
                    <div class="bio-wrapper">
                        <div class="text">
                            <h3>On a bad day... anyway</h3>
                            <p>My name is Oscar and I’m a 26-year-old art director who loves doing copy.
                                When I was younger, I dreamed of becoming a film director and music producer.
                                But after a brief employment at Copenhagen Hospital, where I transported
                                dead people, I found my true calling—talking to people who don’t care.
                                And well, here we are.
                                <br><br>
                                Besides trying to save the world with groundbreaking ideas, I have a deep
                                passion for music, DJing, and playing the piano. And even though I love
                                dressing up as George Michael and lip-syncing his entire album Older,
                                my greatest love is cooking (and, well, eating) food.
                                Just ask Chris.
                            </p>
                        </div>
                        <div class="media">
                            <img src="http://unsplash.it/400/650?random&gravity=center" alt="">
                        </div>
                    </div>
                </div>
            </div>
        {/if}
</div>