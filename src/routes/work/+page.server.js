import { error } from '@sveltejs/kit'
import { PAYLOAD_URL } from '$env/static/private'

export const prerender = true

export const load = async ({ fetch }) => {
  const [workRes, awardsRes] = await Promise.all([
    fetch(`${PAYLOAD_URL}/api/globals/work?depth=2`),
    fetch(`${PAYLOAD_URL}/api/globals/awards?depth=1`),
  ])

  if (!workRes.ok) throw error(404)

  const work = await workRes.json()
  const awardsData = awardsRes.ok ? await awardsRes.json() : null
  const awardTypes = awardsData?.types ?? []

  let projects = work.featuredProjects ?? []

  projects = await Promise.all(projects.map(async (project) => {
    if (typeof project.backgroundMux === 'string') {
      const r = await fetch(`${PAYLOAD_URL}/api/mux-videos/${project.backgroundMux}`)
      if (r.ok) project.backgroundMux = await r.json()
    }
    return project
  }))

  return { work, projects, awardTypes }
}