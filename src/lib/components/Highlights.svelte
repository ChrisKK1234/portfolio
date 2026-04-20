<script>
    export let data;
    export let relations;
    let activeProject = relations?.[0] ?? null;
    let currentBackground = getProjectBackground(activeProject);
    let previousBackground = '';
    const HOVER_SWITCH_DELAY = 160;
    let fadeTimer;
    let hoverDelayTimer;

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

    function setBackgroundOnHover(project) {
        const nextBackground = getProjectBackground(project);

        activeProject = project ?? null;

        if (!nextBackground || nextBackground === currentBackground) return;
        previousBackground = currentBackground;
        currentBackground = nextBackground;
        clearTimeout(fadeTimer);
        fadeTimer = setTimeout(() => {
            previousBackground = '';
        }, 450);
    }

    function scheduleBackgroundSwitch(project) {
        clearTimeout(hoverDelayTimer);
        hoverDelayTimer = setTimeout(() => {
            setBackgroundOnHover(project);
        }, HOVER_SWITCH_DELAY);
    }

    function clearScheduledBackgroundSwitch() {
        clearTimeout(hoverDelayTimer);
    }

    
</script>

<div class="highlights">
    {#each data.blocks as block}
        {#if block.component === 'top-five-projects'}
        <div class="top-five-module">
            <div class="background-media">
                {#if previousBackground}
                    <img
                        class="is-previous"
                        draggable="false"
                        src={previousBackground}
                        alt=""
                        aria-hidden="true"
                    />
                {/if}
                {#if currentBackground}
                    {#key currentBackground}
                        <img
                            class="is-current"
                            draggable="false"
                            src={currentBackground}
                            alt="Project background"
                        />
                    {/key}
                {/if}
            </div>
            <span class="bottom-shadow"></span>
            <div class="project-title">
                <h2>{projectTitle}</h2>
                <a class="more-info" href={projectSlug}>More info</a>
            </div>
            <div class="projects-list-container">
                <h3 class="sub-title">Top 5 picks for you</h3>
                <div class="list">
                    {#each relations as project, index}
                        <div
                            on:mouseenter={() => scheduleBackgroundSwitch(project)}
                            on:mouseleave={clearScheduledBackgroundSwitch}
                        >
                            <div class="project">
                                <div class="number">
                                    <span>{index + 1}</span>
                                </div>
                                <div class="media">
                                    <img src={project.content.thumbnail.filename + "/m/0x200/filters:format(webp):quality(80)"} alt="">
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
        {/if}
    {/each}
</div>