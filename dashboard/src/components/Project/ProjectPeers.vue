<template>
	<div class="Silly__project-peers">
		<div class="peers_info">
			<ul class="user-info_list">
				<li class="info_item">
					<span>Peers:</span><strong>{{ peersInfo.accepted }}</strong>
				</li>
				<li class="info_item">
					<span>Rejected:</span><strong>{{ peersInfo.rejected }}</strong>
				</li>
				<li class="info_item">
					<span>Pending:</span><strong>{{ peersInfo.pending }}</strong>
				</li>
			</ul>
		</div>
		<v-client-table class="silly__default-table" :data="peers" :columns="columns" :options="options">
			<template slot="username" slot-scope="props">
				<router-link :to="`${userUrl + props.row.user._id}`">
					{{ props.row.user.username }}
				</router-link>
			</template>
		</v-client-table>
	</div>
</template>

<script>
export default {
	name: "ProjectPeers",
	data() {
		return {
			userUrl: "/user?id=",
			peers: [],
			columns: ["status", "username", "title", "description"],
			options: {
				sortable: ["status", "username", "title"],
				texts: {
					filter: "Search:",
				},
			},
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
	computed: {
		peersInfo: function() {
			return {
				accepted: this.peers.filter((e) => e.status === "accepted").length,
				rejected: this.peers.filter((e) => e.status === "rejected").length,
				pending: this.peers.filter((e) => e.status === "pending").length,
			};
		},
	},
};
</script>

<style lang="scss" scoped>
.peers_info {
	display: flex;
	justify-content: flex-end;
	margin-right: 10px;
}
.user-info_list {
	text-align: end;
}
.info_item span {
	margin-right: 10px;
}
</style>
