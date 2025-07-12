<script lang="ts">
	export let data;
	let newListName = '';
</script>

<h1>Your Lists</h1>

<form method="POST" action="?/create">
	<input name="name" bind:value={newListName} placeholder="New list name" />
	<button type="submit">Create</button>
</form>

<ul>
	{#each data.lists as list}
		<li>{list.name}</li>
	{/each}
</ul>
