import { error } from '@sveltejs/kit'
import { PAYLOAD_URL } from '$env/static/private'

export const prerender = true

export const load = async ({ params, fetch }) => {
  const [projectRes, awardsRes] = await Promise.all([
    fetch(`${PAYLOAD_URL}/api/projects?where[slug][equals]=${params.slug}&depth=2&limit=1`),
    fetch(`${PAYLOAD_URL}/api/globals/awards?depth=1`),
  ])

  if (!projectRes.ok) throw error(404)

  const { docs } = await projectRes.json()
  const project = docs?.[0]

  if (!project) throw error(404)

  const awardsData = awardsRes.ok ? await awardsRes.json() : null
  const awardTypes = awardsData?.types ?? []

  return { project, awardTypes }
}

export async function entries() {
  const res = await fetch(`${PAYLOAD_URL}/api/projects?limit=100`)
  if (!res.ok) return []
  const { docs } = await res.json()
  return (docs ?? []).filter((d) => d.slug).map((d) => ({ slug: d.slug }))
}