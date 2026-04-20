<script>
    export let content;
    // console.log(component);
</script>

<!-- Supports
    - paragraph
    - bold
    - italic
    - link
    - hard_break
    - heading (levels 1-6)
-->
<div class="rich-text">
    {#each content.text.content as element}
        {#if element.type === 'paragraph'}
            <p>
            {#each element.content as textNode}
                {#if textNode.marks}
                    {#if textNode.marks.some(mark => mark.type === 'bold') && textNode.marks.some(mark => mark.type === 'italic')}
                        <strong><em>{textNode.text}</em></strong>
                    {:else if textNode.marks.some(mark => mark.type === 'bold')}
                        <strong>{textNode.text}</strong>
                    {:else if textNode.marks.some(mark => mark.type === 'italic')}
                        <em>{textNode.text}</em>
                    {:else if textNode.marks.some(mark => mark.type === 'link')}
                        {#each textNode.marks.filter(mark => mark.type === 'link') as linkMark}
                            <a
                              href={linkMark.attrs.href}
                              {...(linkMark.attrs.target && linkMark.attrs.target !== "_self"
                                ? { target: linkMark.attrs.target, rel: "noopener" }
                                : {})}
                            >
                              {textNode.text}
                            </a>
                        {/each}
                    {:else}
                        {textNode.text}
                    {/if}
                {:else if textNode.type === 'hard_break'}
                    <br />
                {:else}
                    {textNode.text}
                {/if}
            {/each}
            </p>
        {:else if element.type === 'heading'}
            {#if element.attrs.level === 1}
                <h1>{element.content[0].text}</h1>
            {:else if element.attrs.level === 2}
                <h2>{element.content[0].text}</h2>
            {:else if element.attrs.level === 3}
                <h3>{element.content[0].text}</h3>
            {:else if element.attrs.level === 4}
                <h4>{element.content[0].text}</h4>
            {:else if element.attrs.level === 5}
                <h5>{element.content[0].text}</h5>
            {:else if element.attrs.level === 6}
                <h6>{element.content[0].text}</h6>
            {/if}
        {/if}
    {/each}
</div>