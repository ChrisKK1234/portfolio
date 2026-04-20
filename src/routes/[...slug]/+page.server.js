import { error } from '@sveltejs/kit';
import { CMS_TOKEN } from '$env/static/private';

export const prerender = true;
export const trailingSlash = 'always';


export const load = async ({ params, fetch }) => {
	const slug = params.slug || '';
	if (slug === '') return { story: null };
	
	const res = await fetch(
		`https://api.storyblok.com/v2/cdn/stories/${slug}?version=published&token=${CMS_TOKEN}&cv=${Date.now()}`
	);
	
	if (!res.ok) throw error(404);
	
	const { story } = await res.json();

	// Collect all project UUIDs from highlights blocks to fetch them in one go
	let relations = [];
	const template = story.content.component;
	if (template === 'profile-page') {
		const uuids = collectHighlightProjectUUIDs(story);
		
		if (uuids.length) {
			const res = await fetch(
			`https://api.storyblok.com/v2/cdn/stories?by_uuids=${uuids.join(',')}&token=${CMS_TOKEN}&cv=${Date.now()}`
			)

			const json = await res.json()
			relations = json.stories
		}
	}

  return { story, relations };
};

function collectHighlightProjectUUIDs(story) {
  const uuids = []

  story.content.body?.forEach(block => {
    if (block.component === 'highlights') {
      block.blocks?.forEach(m => {
		if (m.component === 'top-five-projects') {
			m.projects?.forEach(project => {
				if (typeof project === 'string') uuids.push(project)
			})
		}
      })
    }
  })

  return uuids
}

// Generate all possible slugs for prerendering - Never try to render invalid slugs
export async function entries() {
	const links = await getLinks();

	return Object.values(links)
		.filter(
			(l) =>
				!l.is_folder &&
				l.published === true
		)
		.map((l) => ({
			slug: l.slug === l.slug ? l.slug : ''
		}));
}

async function getLinks() {
	const res = await fetch(
		`https://api.storyblok.com/v2/cdn/links?token=${CMS_TOKEN}`
	);
	const data = await res.json();
	return data.links;
}
