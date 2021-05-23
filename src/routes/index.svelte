<script lang="ts">
import {categories} from '$lib/data/categories';
</script>

{#each categories as category}
<a class="category" href="/game/{category.slug}">{category.name}</a>
{/each}

<style>
.category {
    display: block;
    padding: 3rem;
    background: #aaa;
    color: black;
    text-decoration: none;
}
</style>