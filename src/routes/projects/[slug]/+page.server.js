import { error } from '@sveltejs/kit'
import { PAYLOAD_URL } from '$env/static/private'

export const prerender = true

export const load = async ({ params, fetch }) => {
  const res = await fetch(
    `${PAYLOAD_URL}/api/projects?where[slug][equals]=${params.slug}&depth=2&limit=1`
  )

  if (!res.ok) throw error(404)

  const { docs } = await res.json()
  const project = docs?.[0]

  if (!project) throw error(404)

  return { project }
}

// Generer alle slugs til prerendering
export async function entries() {
  const res = await fetch(
    `${PAYLOAD_URL}/api/projects?limit=100&select=slug`
  )

  if (!res.ok) return []

  const { docs } = await res.json()

  return (docs ?? [])
    .filter((d) => d.slug)
    .map((d) => ({ slug: d.slug }))
}