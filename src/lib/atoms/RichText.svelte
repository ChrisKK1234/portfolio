<script>
  export let content

  function renderNode(node) {
    if (!node) return ''

    if (node.type === 'text') {
      let text = node.text ?? ''
      if (node.format & 1) text = `<strong>${text}</strong>`
      if (node.format & 2) text = `<em>${text}</em>`
      return text
    }

    if (node.type === 'linebreak') return '<br>'

    const children = (node.children ?? []).map(renderNode).join('')

    if (node.type === 'heading') return `<${node.tag}>${children}</${node.tag}>`
    if (node.type === 'paragraph') return `<p>${children}</p>`

    return children
  }

  $: html = content?.root?.children
    ? content.root.children.map(renderNode).join('')
    : ''
</script>

{@html html}