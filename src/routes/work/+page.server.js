import { error } from '@sveltejs/kit'
import { PAYLOAD_URL } from '$env/static/private'

export const prerender = true

export const load = async ({ fetch }) => {
  const res = await fetch(`${PAYLOAD_URL}/api/globals/work?depth=2`)

  if (!res.ok) throw error(404)

  const work = await res.json()

  // featuredProjects er fuldt populated med depth=2
  const projects = work.featuredProjects ?? []

  return { work, projects }
}