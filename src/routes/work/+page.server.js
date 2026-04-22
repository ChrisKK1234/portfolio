import { error } from '@sveltejs/kit'
import { PAYLOAD_URL } from '$env/static/private'

export const prerender = true

export const load = async ({ fetch }) => {
  const res = await fetch(`${PAYLOAD_URL}/api/globals/work?depth=2`)
  if (!res.ok) throw error(404)

  const work = await res.json()
  let projects = work.featuredProjects ?? []

  // Populate backgroundMux manuelt
  projects = await Promise.all(projects.map(async (project) => {
    if (typeof project.backgroundMux === 'string') {
      const muxRes = await fetch(`${PAYLOAD_URL}/api/mux-videos/${project.backgroundMux}`)
      if (muxRes.ok) project.backgroundMux = await muxRes.json()
    }
    // Populate mediaMux i fields blocks også
    if (project.fields) {
      project.fields = await Promise.all(project.fields.map(async (block) => {
        if (block.blockType === 'simpleMedia' && typeof block.mediaMux === 'string') {
          const muxRes = await fetch(`${PAYLOAD_URL}/api/mux-videos/${block.mediaMux}`)
          if (muxRes.ok) block.mediaMux = await muxRes.json()
        }
        return block
      }))
    }
    return project
  }))

  return { work, projects }
}