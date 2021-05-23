
<script lang="ts" context="module">
	import {categories} from '$lib/data/categories'
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		const slug = page.params.categorySlug
        const category = categories.find(d => d.slug === slug)
        if (!category) {
            return {
                status: 404,
                error: new Error(`Category ${slug} could not be found`)
            }
        }

		return {
      props: {
        category
      }
    };
	}
</script>
<script lang="ts">
	import Game from '$lib/components/Game.svelte'
	export let category;
</script>
<Game category={category} />
