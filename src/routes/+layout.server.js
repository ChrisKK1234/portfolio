import { PAYLOAD_URL } from '$env/static/private'

export const prerender = true

export const load = async ({ fetch }) => {
  const [profilesRes, workRes, navRes] = await Promise.all([
    fetch(`${PAYLOAD_URL}/api/profiles?limit=100&sort=name&depth=1`),
    fetch(`${PAYLOAD_URL}/api/globals/work`),
    fetch(`${PAYLOAD_URL}/api/globals/nav`),
  ])

  const { docs: profiles } = profilesRes.ok ? await profilesRes.json() : { docs: [] }
  const work = workRes.ok ? await workRes.json() : null
  const nav = navRes.ok ? await navRes.json() : null

  return {
    profiles: profiles ?? [],
    work,
    nav,
  }
}