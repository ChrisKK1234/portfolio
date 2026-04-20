<script>
    import { isMobile, isTouch } from "$lib/store/device";
    import { goto } from "$app/navigation";
    import { onMount, onDestroy } from "svelte";

    export let data;
    export let relations;
    console.log(relations)

    // ---------- BACKGROUND ----------
    let activeProject = relations?.[0] ?? null;
    let slots = [
        { src: getProjectBackground(relations?.[0] ?? null), visible: true },
        { src: '', visible: false }
    ];
    let activeSlot = 0;
    let fadeTimer;
    let hoverDelayTimer;
    const HOVER_SWITCH_DELAY = 200;

    $: projectTitle = getProjectTitle(activeProject);
    $: projectSlug = activeProject?.full_slug ? `/${activeProject.full_slug}` : '#';

    function getProjectBackground(project) {
        return project?.content?.backgroundMedia?.filename
            ? `${project.content.backgroundMedia.filename}/m/1800x1200/filters:format(webp):quality(80)`
            : '';
    }

    function getProjectTitle(project) {
        return project?.content?.title || project?.name || 'Top 5 Projects';
    }

    function switchBackground(project) {
        const nextSrc = getProjectBackground(project);
        activeProject = project ?? null;
        if (!nextSrc || nextSrc === slots[activeSlot].src) return;
        const prevSlot = activeSlot;
        const nextSlot = activeSlot === 0 ? 1 : 0;
        slots[nextSlot].src = nextSrc;
        slots[nextSlot].visible = true;
        slots = slots;
        activeSlot = nextSlot;
        clearTimeout(fadeTimer);
        fadeTimer = setTimeout(() => {
            slots[prevSlot].visible = false;
            slots = slots;
        }, 0);
    }

    function scheduleBackgroundSwitch(project) {
        clearTimeout(hoverDelayTimer);
        hoverDelayTimer = setTimeout(() => switchBackground(project), HOVER_SWITCH_DELAY);
    }

    function clearScheduledBackgroundSwitch() {
        clearTimeout(hoverDelayTimer);
    }

    // ---------- MOBILE JS SLIDER ----------
    let sliderContainer;
    let track;
    let items = [];

    let raf;
    let ro;

    // motion
    let current = 0;
    let target = 0;

    // gesture
    let isDown = false;
    let start = 0;
    let moveAccum = 0;
    let lastMove = 0;
    let hasTriggered = false;
    let gestureStartTarget = 0;

    // layout
    let itemSize = 0;
    let gap = 0;
    let offset = 0;
    let min = 0;
    let max = 0;

    // state
    let currentIndex = 0;
    let visibleIndex = 0;

    onMount(() => {
        if (!$isMobile) return;

        items = [...track.children];
        measure();
        requestAnimationFrame(() => goToIndex(0, true));
        loop();

        ro = new ResizeObserver(() => {
            measure();
            goToIndex(currentIndex, true);
            current = target;
        });
        ro.observe(sliderContainer);

        setTimeout(() => sliderContainer.classList.toggle('visible', true), 300);
    });

    onDestroy(() => {
        if (ro) ro.disconnect();
        if (raf) cancelAnimationFrame(raf);
    });

    function loop() {
        current += (target - current) * 0.08;
        if (track) track.style.transform = `translateX(${current}px)`;
        const step = itemSize + gap;
        const progress = (-(current - offset)) / step;
        visibleIndex = Math.round(progress);
        raf = requestAnimationFrame(loop);
    }

    function measure() {
        const first = track?.children[0];
        if (!first || first.offsetWidth === 0) return;
        itemSize = first.offsetWidth;
        gap = parseFloat(getComputedStyle(track).gap) || 0;
        offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--md')) || 16;
        const step = itemSize + gap;
        max = offset;
        min = -((items.length - 1) * step) + offset;
    }

    function goToIndex(i, immediate = false) {
        const step = itemSize + gap;
        currentIndex = i;
        target = -(i * step) + offset;
        if (immediate) current = target;
    }

    function onPointerDown(e) {
        isDown = true;
        target = current;
        start = e.clientX;
        moveAccum = 0;
        lastMove = 0;
        hasTriggered = false;
        gestureStartTarget = current;
        sliderContainer.setPointerCapture(e.pointerId);
    }

    function onPointerMove(e) {
        if (!isDown) return;
        const dx = e.clientX - start;
        start = e.clientX;

        target += dx;

        const step = itemSize + gap;
        if (target > gestureStartTarget + step) target = gestureStartTarget + step;
        if (target < gestureStartTarget - step) target = gestureStartTarget - step;
        if (target > max) target = max + (target - max) * 0.5;
        if (target < min) target = min + (target - min) * 0.5;

        if (hasTriggered) return;
        moveAccum += dx;
        const accel = Math.abs(dx) - Math.abs(lastMove);
        lastMove = dx;

        if (accel > 2 || Math.abs(moveAccum) > 40) {
            currentIndex = dx < 0
                ? Math.min(currentIndex + 1, items.length - 1)
                : Math.max(currentIndex - 1, 0);
            goToIndex(currentIndex);
            switchBackground(relations[currentIndex]);
            hasTriggered = true;
        }
    }

    function onPointerUp(e) {
        if (!isDown) return;
        isDown = false;
        sliderContainer.releasePointerCapture(e.pointerId);
        goToIndex(currentIndex);

        if (!hasTriggered) {
            const el = items[currentIndex];
            if (!el) return;
            const rect = el.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                const link = relations[currentIndex]?.full_slug;
                if (link) goto(`/${link}`);
            }
        }
    }
</script>

<style>
    .top-five-module { position: absolute; top: 0; left: 0; width: 100%; height: 100svh; display: flex; flex-direction: column; justify-content: end; gap: var(--sm); text-align: left; overflow: hidden; }
    .top-five-module .background-media { position: absolute; inset: 0; z-index: -2; overflow: hidden; }
    .top-five-module .background-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 450ms ease; will-change: opacity; }
    .top-five-module .background-media img.is-visible { opacity: 1; }
    .top-five-module .bottom-shadow { position: absolute; bottom: 0; left: 0; z-index: -1; width: 100%; height: 50%; background: linear-gradient(to top, var(--color-darkest) 0%, transparent 100%); pointer-events: none; }
    .top-five-module .project-title { padding: 0 var(--md); }
    .top-five-module .project-title h2 { font-family: 'geologica-variable', sans-serif; text-transform: uppercase; font-weight: 700; color: var(--color-white); font-size: clamp(var(--text-xl), 10vw, 128px); line-height: 0.9; }
    .top-five-module .project-title .more-info { display: block; width: fit-content; font-family: 'geologica-variable', sans-serif; font-size: var(--text-sm); font-weight: 700; text-transform: uppercase; border: none; outline: none; border-radius: 12px; background-color: rgba(255, 255, 255, 0.3); color: var(--color-white); padding: 2px 20px; padding-bottom: 4px; margin-top: var(--sm); transition: background-color 0.3s; }
    .top-five-module .projects-list-container { display: flex; flex-direction: column; gap: var(--sm); }
    .top-five-module .projects-list-container .sub-title { padding: 0 var(--md); line-height: 1; }

    /* ---- Desktop: CSS scroll ---- */
    .list { display: flex; flex-direction: row; justify-content: space-between; gap: var(--sm); width: 100%; height: 206px; box-sizing: content-box; padding: var(--sm) 0; overflow-x: auto; overflow-y: hidden; }
    .list .padding-x { padding: 0 var(--md); display: flex; gap: var(--sm); }
    .list .project { position: relative; height: 100%; display: flex; flex-direction: row; align-items: end; }
    .list .project .number { width: 100%; height: 62%; font-family: 'geologica-variable', sans-serif; font-size: 275px; line-height: 0; font-weight: 700; -webkit-text-stroke: 2px var(--color-white); color: transparent; pointer-events: none; transition: -webkit-text-stroke 0.3s; }
    .list .project .media { display: block; width: 140px; flex-shrink: 0; height: 98%; border-radius: 8px; overflow: hidden; transform-origin: left center; transform: translate(-40px, -2px); transition: transform 0.3s; }    
    .list .project .media img { width: 100%; height: 100%; display: block; object-fit: cover; }

    /* ---- Mobile: JS slider ---- */
    .slider-container { width: 100%; height: 206px; margin-top: var(--sm); margin-bottom: var(--md); overflow: hidden; cursor: grab; opacity: 0; }
    .slider-container.visible { opacity: 1; transition: opacity 0.3s ease; }
    .slider-container:active { cursor: grabbing; }
    .slider-container .track { display: flex; gap: var(--lg); will-change: transform; height: 100%; user-select: none; }
    .slider-container .track .project { position: relative; width: 275px; flex-shrink: 0; height: 100%; display: flex; flex-direction: row; align-items: end; }
    .slider-container .track .project .number { width: 100%; height: 62%; font-family: 'geologica-variable', sans-serif; font-size: 275px; line-height: 0; font-weight: 700; -webkit-text-stroke: 2px var(--color-white); color: transparent; pointer-events: none; }
    .slider-container .track .project .media { display: block; width: 140px; flex-shrink: 0; height: 98%; border-radius: 8px; overflow: hidden; transform-origin: left center; transform: translate(-40px, -2px);  }
    .slider-container .track .project .media img { width: 100%; height: 100%; object-fit: cover; }

    @media (min-width: 750.5px) {
        .top-five-module .project-title .more-info:hover { background-color: rgba(255, 255, 255, 0.5); }
        .list .project:hover .number { -webkit-text-stroke: 4px var(--color-white); }
        .list .project:hover .media { transform: translate(-40px, -2px) scale(1.1); }
    }
</style>

<div class="highlights">
    {#each data.blocks as block}
        {#if block.component === 'top-five-projects'}
        <div class="top-five-module">
            <div class="background-media">
                {#each slots as slot}
                    {#if slot.src}
                        <img
                            draggable="false"
                            src={slot.src}
                            alt="Project background"
                            class:is-visible={slot.visible}
                        />
                    {/if}
                {/each}
            </div>
            <span class="bottom-shadow"></span>
            <div class="project-title">
                <h2>{projectTitle}</h2>
                <a class="more-info" href={projectSlug}>More info</a>
            </div>
            <div class="projects-list-container">
                <h3 class="sub-title">Top 5 picks for you</h3>

                {#if $isMobile}
                    <!-- Mobile: JS-drevet slider -->
                    <div
                        class="slider-container"
                        class:visible={relations && relations.length > 0}
                        bind:this={sliderContainer}
                        aria-label="carousel"
                        role="region"
                        on:pointerdown={onPointerDown}
                        on:pointermove={onPointerMove}
                        on:pointerup={onPointerUp}
                        on:pointerleave={onPointerUp}
                        on:pointercancel={onPointerUp}
                    >
                        <div class="track" bind:this={track}>
                            {#each relations as project, index}
                                <div class="project">
                                    <div class="number"><span>{index + 1}</span></div>
                                    <div class="media">
                                        <img src={project.content.thumbnail.filename + "/m/0x200/filters:format(webp):quality(80)"} alt="">
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {:else}
                    <!-- Desktop: plain CSS scroll -->
                    <div class="list">
                        <div class="padding-x">
                            {#each relations as project, index}
                                <div
                                    role="button"
                                    tabindex="0"
                                    on:mouseenter={() => scheduleBackgroundSwitch(project)}
                                    on:mouseleave={clearScheduledBackgroundSwitch}
                                >
                                    <div class="project">
                                        <div class="number"><span>{index + 1}</span></div>
                                        <div class="media">
                                            <img src={project.content.thumbnail.filename + "/m/0x200/filters:format(webp):quality(80)"} alt="">
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

            </div>
        </div>
        {/if}
    {/each}
</div>