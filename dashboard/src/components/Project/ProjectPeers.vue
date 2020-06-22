<template>
	<div class="Silly__project-peers">
		<v-client-table class="silly__default-table" :data="peers" :columns="columns" :options="options">
			<template slot="username" slot-scope="props">
				<router-link :to="`${userUrl + props.row.user._id}`">
					{{props.row.user.username}}
				</router-link>
			</template>
		</v-client-table>
	</div>
</template>

<script>
export default {
	name: "ProjectPeers",
	components: {},
	data() {
		return {
			userUrl: '/user?id=',
			peers: [],
			columns: ['status', 'username', 'title', 'description'],
			options: {
				username: ['Status', "Username", 'Title', 'Description'],
				sortable: ['status', "name", "title"],
				texts: {
					filter: "Search:"	
				},
			}
		};
	},
	props: {
		projectPeers: Array,
	},
	watch: {
		projectPeers: function(newVal) {
			this.peers = newVal;
		},
	},
	methods: {},
};
</script>

<style lang="scss" scoped></style>
