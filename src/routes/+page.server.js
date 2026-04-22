import { error } from '@sveltejs/kit'
import { PAYLOAD_URL } from '$env/static/private'

export const prerender = true

export const load = async ({ fetch }) => {
  const [profilesRes, workRes] = await Promise.all([
    fetch(`${PAYLOAD_URL}/api/profiles?limit=100&depth=1`),
    fetch(`${PAYLOAD_URL}/api/globals/work`),
  ])

  if (!profilesRes.ok) throw error(500)

  const { docs: profiles } = await profilesRes.json()
  const work = workRes.ok ? await workRes.json() : null

  // Byg ordnet liste baseret på profileOrder fra Work
  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]))
  const order = work?.profileOrder ?? []

  let orderedItems = []

  if (order.length > 0) {
    orderedItems = order
      .map(item => {
        if (item.type === 'work') {
          return { type: 'work', data: work }
        }
        if (item.type === 'profile' && item.id && profileMap[item.id]) {
          return { type: 'profile', data: profileMap[item.id] }
        }
        return null
      })
      .filter(Boolean)
  } else {
    // Fallback: work først, derefter profiler
    orderedItems = [
      { type: 'work', data: work },
      ...(profiles ?? []).map(p => ({ type: 'profile', data: p })),
    ]
  }

  return { orderedItems }
}