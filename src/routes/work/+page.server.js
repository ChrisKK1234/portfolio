import { error } from '@sveltejs/kit'
import { PAYLOAD_URL } from '$env/static/private'

export const prerender = true

export const load = async ({ fetch }) => {
  const res = await fetch(`${PAYLOAD_URL}/api/globals/work?depth=2`)
  if (!res.ok) throw error(404)

  const work = await res.json()
  let projects = work.featuredProjects ?? []

  projects = await Promise.all(projects.map(async (project) => {
    if (typeof project.backgroundMux === 'string') {
      const r = await fetch(`${PAYLOAD_URL}/api/mux-videos/${project.backgroundMux}`)
      if (r.ok) project.backgroundMux = await r.json()
    }
  if (typeof project.backgroundMux === 'string') {
  const r = await fetch(`${PAYLOAD_URL}/api/mux-videos/${project.backgroundMux}`)
  console.log('mux fetch status:', r.status, project.backgroundMux)
  if (r.ok) project.backgroundMux = await r.json()
}
    console.log('backgroundMux after fetch:', JSON.stringify(project.backgroundMux))
    console.log('backgroundType:', project.backgroundType)
    return project
}))

  return { work, projects }
}