// Load data for all pages + content for home page
import { CMS_TOKEN } from '$env/static/private';

export const load = async ({ params, fetch }) => {
console.log(params)

  const res = await fetch(
    `https://api.storyblok.com/v2/cdn/stories?version=published&token=${CMS_TOKEN}`
  );
  const link = await fetch(
    `https://api.storyblok.com/v2/cdn/links?token=${CMS_TOKEN}`
  );

  return { content: await res.json(), links: await link.json() };
};
