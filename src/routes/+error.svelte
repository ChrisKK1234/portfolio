<script>
  import { page } from '$app/state';
</script>

{#if page.status === 404}
  <div class="error-status">
    <h1>404</h1>
  </div>
  <div class="error-message">
    <p>Den side findes ikke</p>
    <a href="/">Gå til forsiden</a>
  </div>
{:else}
  <div class="error-message">
    <h1>Der opstod en fejl</h1>
  </div>
  <div class="error-message">
    <a href="/">Gå til forsiden</a>
  </div>
{/if}