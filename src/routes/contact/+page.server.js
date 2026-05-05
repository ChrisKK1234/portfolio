import { error } from '@sveltejs/kit'
import { PAYLOAD_URL } from '$env/static/private'

export const prerender = true

export const load = async ({ fetch }) => {
  const res = await fetch(`${PAYLOAD_URL}/api/globals/contact`)
  // if (!res.ok) throw error(404)
  const contact = await res.json()
  return { contact }
}