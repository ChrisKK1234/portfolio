<!-- Work page -->
<script>
    import { isMobile } from "$lib/store/device";
    import { goto } from "$app/navigation";
    import { onMount, onDestroy } from "svelte";
    import MuxVideo from "$lib/components/MuxVideo.svelte";

    export let data;
    const { projects } = data;

    let videoMuted = true;

    let activeProject = projects?.[0] ?? null;
    let slots = [
        { src: getProjectBackground(projects?.[0] ?? null), visible: true },
        { src: '', visible: false }
    ];
    let activeSlot = 0;
    let fadeTimer;
    let hoverDelayTimer;
    const HOVER_SWITCH_DELAY = 200;

    $: projectTitle = activeProject?.title ?? 'Projects';
    $: projectSlug = activeProject?.slug ? `/projects/${activeProject.slug}` : '#';
    $: isMuxBackground = activeProject?.backgroundType === 'mux' && activeProject?.backgroundMux?.playbackId;

    function getProjectBackground(project) {
        if (!project || project.backgroundType === 'mux') return '';
        const url = project.backgroundMedia?.cloudinary?.secure_url ?? project.backgroundMedia?.url;
        if (!url) return '';
        return url.includes('/upload/') ? url.replace('/upload/', '/upload/w_1800,h_1200,c_fill,f_webp,q_80/') : url;
    }

    function getThumbnailUrl(project) {
        if (!project?.thumbnail) return '';
        const url = project.thumbnail?.cloudinary?.secure_url ?? project.thumbnail?.url;
        if (!url) return '';
        return url.includes('/upload/') ? url.replace('/upload/', '/upload/h_200,c_fill,f_webp,q_80/') : url;
    }

    function switchBackground(project) {
        activeProject = project ?? null;
        if (project?.backgroundType === 'mux') return;
        const nextSrc = getProjectBackground(project);
        if (!nextSrc || nextSrc === slots[activeSlot].src) return;
        const prevSlot = activeSlot;
        const nextSlot = activeSlot === 0 ? 1 : 0;
        slots[nextSlot].src = nextSrc;
        slots[nextSlot].visible = true;
        slots = slots;
        activeSlot = nextSlot;
        clearTimeout(fadeTimer);
        fadeTimer = setTimeout(() => { slots[prevSlot].visible = false; slots = slots; }, 0);
    }

    function scheduleBackgroundSwitch(project) {
        clearTimeout(hoverDelayTimer);
        hoverDelayTimer = setTimeout(() => switchBackground(project), HOVER_SWITCH_DELAY);
    }

    function clearScheduledBackgroundSwitch() {
        clearTimeout(hoverDelayTimer);
    }

    let sliderContainer, track;
    let items = [], raf, ro;
    let current = 0, target = 0, isDown = false, start = 0;
    let moveAccum = 0, lastMove = 0, hasTriggered = false, gestureStartTarget = 0;
    let itemSize = 0, gap = 0, offset = 0, min = 0, max = 0;
    let currentIndex = 0, visibleIndex = 0;

    onMount(() => {
        if (!$isMobile) return;
        console.log('onMount', track, sliderContainer);
        items = [...track.children];
        measure();
        requestAnimationFrame(() => goToIndex(0, true));
        loop();
        ro = new ResizeObserver(() => { measure(); goToIndex(currentIndex, true); current = target; });
        ro.observe(sliderContainer);
        setTimeout(() => sliderContainer.classList.toggle('visible', true), 300);
    });

    onDestroy(() => { if (ro) ro.disconnect(); if (raf) cancelAnimationFrame(raf); });

    function loop() {
        current += (target - current) * 0.08;
        if (track) track.style.transform = `translateX(${current}px)`;
        const step = itemSize + gap;
        visibleIndex = Math.round((-(current - offset)) / step);
        raf = requestAnimationFrame(loop);
    }

    function measure() {
        const first = track?.children[0];
        if (!first || first.offsetWidth === 0) return;
        itemSize = first.offsetWidth;
        gap = parseFloat(getComputedStyle(track).gap) || 0;
        offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--md')) || 16;
        max = offset;
        min = -((items.length - 1) * (itemSize + gap)) + offset;
    }

    function goToIndex(i, immediate = false) {
        currentIndex = i;
        target = -(i * (itemSize + gap)) + offset;
        if (immediate) current = target;
    }

    function onPointerDown(e) {
        isDown = true; target = current; start = e.clientX;
        moveAccum = 0; lastMove = 0; hasTriggered = false; gestureStartTarget = current;
        sliderContainer.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
        if (!isDown) return;
        const dx = e.clientX - start; start = e.clientX; target += dx;
        const step = itemSize + gap;
        if (target > gestureStartTarget + step) target = gestureStartTarget + step;
        if (target < gestureStartTarget - step) target = gestureStartTarget - step;
        if (target > max) target = max + (target - max) * 0.5;
        if (target < min) target = min + (target - min) * 0.5;
        if (hasTriggered) return;
        moveAccum += dx;
        const accel = Math.abs(dx) - Math.abs(lastMove); lastMove = dx;
        if (accel > 2 || Math.abs(moveAccum) > 40) {
            currentIndex = dx < 0 ? Math.min(currentIndex + 1, items.length - 1) : Math.max(currentIndex - 1, 0);
            goToIndex(currentIndex); switchBackground(projects[currentIndex]); hasTriggered = true;
        }
    }

    function onPointerUp(e) {
        if (!isDown) return;
        isDown = false; sliderContainer.releasePointerCapture(e.pointerId); goToIndex(currentIndex);
        if (!hasTriggered) {
            const el = items[currentIndex]; if (!el) return;
            const rect = el.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
                const slug = projects[currentIndex]?.slug; if (slug) goto(`/projects/${slug}`);
            }
        }
    }
</script>

<style>
    .top-five-module { position: absolute; top: 0; left: 0; width: 100%; height: 100svh; display: flex; flex-direction: column; justify-content: end; gap: var(--sm); text-align: left; overflow: hidden; }
    .top-five-module .background-media { position: absolute; inset: 0; z-index: -2; overflow: hidden; }
    .top-five-module .background-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 450ms ease; will-change: opacity; }
    .top-five-module .background-media img.is-visible { opacity: 1; }
    .top-five-module .background-media .mux-bg { position: absolute; inset: 0; }
    .top-five-module .bottom-shadow { position: absolute; bottom: 0; left: 0; z-index: -1; width: 100%; height: 50%; background: linear-gradient(to top, var(--color-darkest) 0%, transparent 100%); pointer-events: none; }
    .top-five-module .project-title { padding: 0 var(--md); pointer-events: none; user-select: none; }
    .top-five-module .project-title h2 { font-family: 'geologica-variable', sans-serif; text-transform: uppercase; font-weight: 700; color: var(--color-white); font-size: clamp(var(--text-xl), 10vw, 128px); line-height: 0.9; }
    .top-five-module .project-title .more-info { display: block; width: fit-content; pointer-events: auto; cursor: pointer; font-family: 'geologica-variable', sans-serif; font-size: var(--text-sm); font-weight: 700; text-transform: uppercase; border: none; outline: none; border-radius: 12px; background-color: rgba(255, 255, 255, 0.3); color: var(--color-white); padding: 2px 20px; padding-bottom: 4px; margin-top: var(--sm); transition: background-color 0.3s; }
    .top-five-module .projects-list-container { display: flex; flex-direction: column; gap: var(--sm); }
    .top-five-module .projects-list-container .sub-title { padding: 0 var(--md); line-height: 1; }
    .list { display: flex; flex-direction: row; justify-content: space-between; gap: var(--sm); width: 100%; height: 206px; box-sizing: content-box; padding: var(--sm) 0; overflow-x: auto; overflow-y: hidden; }
    .list .padding-x { padding: 0 var(--md); display: flex; gap: var(--sm); }
    .list .project { position: relative; height: 100%; display: flex; flex-direction: row; align-items: end; }
    .list .project .number { width: 100%; height: 62%; font-family: 'geologica-variable', sans-serif; font-size: 275px; line-height: 0; font-weight: 700; -webkit-text-stroke: 2px var(--color-white); color: transparent; pointer-events: none; transition: -webkit-text-stroke 0.3s; }
    .list .project .media { display: block; width: 140px; flex-shrink: 0; height: 98%; border-radius: 8px; overflow: hidden; transform-origin: left center; transform: translate(-40px, -2px); transition: transform 0.3s ease-in-out; }    
    .list .project .media img { width: 100%; height: 100%; display: block; object-fit: cover; }
    .slider-container { width: 100%; height: 206px; margin-top: var(--sm); margin-bottom: var(--md); overflow: hidden; cursor: grab; opacity: 0; touch-action: none; }
    .slider-container.visible { opacity: 1; transition: opacity 0.3s ease; }
    .slider-container:active { cursor: grabbing; }
    .slider-container .track { display: flex; gap: var(--xs); will-change: transform; height: 100%; user-select: none; }
    .slider-container .track .project { position: relative; width: 275px; flex-shrink: 0; height: 100%; display: flex; flex-direction: row; align-items: end; }
    .slider-container .track .project .number { width: 100%; height: 62%; font-family: 'geologica-variable', sans-serif; font-size: 275px; line-height: 0; font-weight: 700; -webkit-text-stroke: 2px var(--color-white); color: transparent; pointer-events: none; }
    .slider-container .track .project .media { display: block; width: 140px; flex-shrink: 0; height: 98%; border-radius: 8px; overflow: hidden; transform-origin: left center; transform: translate(-40px, -2px); }
    .slider-container .track .project .media img { width: 100%; height: 100%; object-fit: cover; }

    .mute-btn { position: absolute; top: 50%; right: 12px; width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer; pointer-events: auto; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
    .mute-btn:hover { background: rgba(0,0,0,0.75); }
    @media (min-width: 750.5px) {
        .top-five-module .project-title .more-info:hover { background-color: rgba(255, 255, 255, 0.5); }
        .list .project:hover .number { -webkit-text-stroke: 4px var(--color-white); }
        .list .project:hover .media { transform: translate(-40px, -2px) scale(1.1); }
    }
</style>

<div class="top-five-module">
    {#if isMuxBackground && !activeProject.backgroundMuted}
        <button class="mute-btn" on:click={() => videoMuted = !videoMuted} aria-label={videoMuted ? 'Slå lyd til' : 'Slå lyd fra'}>
            {#if videoMuted}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
            </svg>
            {:else}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
            {/if}
        </button>
    {/if}
    <div class="background-media">
        {#if isMuxBackground}
            <div class="mux-bg">
                <MuxVideo
                    playbackId={activeProject.backgroundMux.playbackId}
                    hasAudio={!activeProject.backgroundMuted}
                    cover={true}
                    bind:muted={videoMuted}
                />
            </div>
        {:else}
            {#each slots as slot}
                {#if slot.src}
                    <img draggable="false" src={slot.src} alt="Project background" class:is-visible={slot.visible} />
                {/if}
            {/each}
        {/if}
    </div>
    <span class="bottom-shadow"></span>
    <div class="project-title">
        <h2>{projectTitle}</h2>
        <a class="more-info" href={projectSlug}>More info</a>
    </div>
    <div class="projects-list-container">
        <h3 class="sub-title">Top 5 picks for you</h3>
        {#if $isMobile}
            <div class="slider-container" class:visible={projects && projects.length > 0} bind:this={sliderContainer} aria-label="carousel" role="region" on:pointerdown={onPointerDown} on:pointermove={onPointerMove} on:pointerup={onPointerUp} on:pointerleave={onPointerUp} on:pointercancel={onPointerUp}>
                <div class="track" bind:this={track}>
                    {#each projects as project, index}
                        <div class="project">
                            <div class="number"><span>{index + 1}</span></div>
                            <div class="media"><img src={getThumbnailUrl(project)} alt={project.title} draggable="false"/></div>
                        </div>
                    {/each}
                </div>
            </div>
        {:else}
            <div class="list">
                <div class="padding-x">
                    {#each projects as project, index}
                        <button role="button" tabindex="0" aria-label="button" on:click={() => goto(`/projects/${project.slug}`)} on:mouseenter={() => scheduleBackgroundSwitch(project)} on:mouseleave={clearScheduledBackgroundSwitch}>
                            <div class="project">
                                <div class="number"><span>{index + 1}</span></div>
                                <div class="media"><img src={getThumbnailUrl(project)} alt={project.title} draggable="false"/></div>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>