<!-- Contact page -->
<script>
  import insta from '$lib/assets/svg/insta.svg'
  import linkedin from '$lib/assets/svg/linkedin.svg'

  export let data
  const { contact } = data
  console.log('Contact data:', contact)
</script>

<style>
  .duo-info { align-content: center; min-height: 100svh; padding: calc(var(--md) * 3) 0; }
  .duo-info .wrapper { width: 100%; }
  .duo-info .wrapper .title { width: fit-content; color: var(--color-white); font-weight: 900; line-height: 1; margin: auto; margin-bottom: var(--xl); }

  .duo-info .wrapper .contact-wrapper { display: flex; gap: var(--md); justify-content: center; flex-wrap: wrap; gap: var(--xl); width: 100%; margin: auto; }
  .duo-info .wrapper .contact-wrapper .links { display: flex; flex-direction: column; gap: var(--md); }
  .duo-info .wrapper .contact-wrapper .links .chris,
  .duo-info .wrapper .contact-wrapper .links .oscar { display: flex; flex-direction: column; gap: var(--xs); }
  .duo-info .wrapper .contact-wrapper .links .chris h2,
  .duo-info .wrapper .contact-wrapper .links .oscar h2 { color: var(--color-white); font-size: var(--text-md); font-weight: 600; line-height: 1; text-align: left; }
  .duo-info .wrapper .contact-wrapper .links .chris .social,
  .duo-info .wrapper .contact-wrapper .links .oscar .social { display: flex; flex-direction: row; gap: var(--2xs); }
  .duo-info .wrapper .contact-wrapper .links .chris a,
  .duo-info .wrapper .contact-wrapper .links .oscar a { display: flex; align-items: center; gap: var(--xs); color: var(--color-white); font-size: 14px; line-height: 1; }
  .duo-info .wrapper .contact-wrapper .links .chris a img,
  .duo-info .wrapper .contact-wrapper .links .oscar a img { width: var(--text-md); height: auto; margin: 0 2px; }
  .duo-info .wrapper .contact-wrapper .recognitions { max-width: 400px; width: fit-content; text-align: left; }
  .duo-info .wrapper .contact-wrapper .recognitions .title { color: var(--color-white); font-size: var(--text-md); font-weight: 600; line-height: 1; margin-bottom: var(--xs); width: 100%; }
  .duo-info .wrapper .contact-wrapper .recognitions .awards { color: var(--color-white); font-size: 14px; line-height: 1.2; }

  @media (max-width: 750px) {
    .duo-info .wrapper .contact-wrapper { gap: var(--lg); }
    .duo-info .wrapper .contact-wrapper .recognitions { max-width: none; }
  }
</style>

<div class="content profile-page-template">
  <div class="duo-info">
    <div class="wrapper">
      <h1 class="title">{contact?.title}</h1>
      <div class="contact-wrapper">
        <div class="links">
          <div class="chris">
            <h2>Chris</h2>
            <div class="social">
              {#if contact?.chris?.linkedin}
                <a href={contact.chris.linkedin} target="_blank" rel="noopener" class="linkedin">
                  <img src={linkedin} alt="LinkedIn">
                </a>
              {/if}
              {#if contact?.chris?.instagram}
                <a href={contact.chris.instagram} target="_blank" rel="noopener" class="instagram">
                  <img src={insta} alt="Instagram">
                </a>
              {/if}
            </div>
            {#if contact?.chris?.email}
              <a href="mailto:{contact.chris.email}">{contact.chris.email}</a>
            {/if}
          </div>
          <div class="oscar">
            <h2>Oscar</h2>
            <div class="social">
              {#if contact?.oscar?.linkedin}
                <a href={contact.oscar.linkedin} target="_blank" rel="noopener" class="linkedin">
                  <img src={linkedin} alt="LinkedIn">
                </a>
              {/if}
              {#if contact?.oscar?.instagram}
                <a href={contact.oscar.instagram} target="_blank" rel="noopener" class="instagram">
                  <img src={insta} alt="Instagram">
                </a>
              {/if}
            </div>
            {#if contact?.oscar?.email}
              <a href="mailto:{contact.oscar.email}">{contact.oscar.email}</a>
            {/if}
          </div>
        </div>
        {#if contact?.recognitions?.length}
          <div class="recognitions">
            <h3 class="title">Recognitions</h3>
            {#each contact.recognitions as recognition}
              <p class="awards">{recognition.text}</p>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>