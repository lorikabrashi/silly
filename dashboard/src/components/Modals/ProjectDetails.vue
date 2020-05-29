<template>
	<b-modal ref="projectDetails" size="lg" @hide="close" title="Project Overview" v-model="state" body-bg-variant="white">
		<p>
			Go to project details page
			<router-link :to="projectUrl">
				Project
			</router-link>
		</p>

		<b-table stacked :items="items"></b-table>
		<pre>
            {{ projectData }}
        </pre
		>
		<template v-slot:modal-footer>
			<b-button variant="info" @click="$refs.projectDetails.hide()">Close</b-button>
		</template>
	</b-modal>
</template>
<script>
import api from "@/mixins/api";
export default {
	name: "ProjectDetailsModal",
	mixins: [api],
	data() {
		return {
			state: false,
			id: null,
			projectData: null, //For debugging
			items: null,
			projectUrl: null,
		};
	},
	props: {
		modalState: Boolean,
		projectId: String,
	},
	watch: {
		modalState: function(newValue) {
			this.state = newValue;
		},
		projectId: function(newValue) {
			this.id = newValue;
			this.projectUrl = `/project?id=${newValue}`;
			this.getProjectData();
		},
	},
	methods: {
		close() {
			this.state = false;
			this.$emit("close");
		},
		async getProjectData() {
			const options = {
				params: [this.id],
			};

			const projectData = await this.getData(this.ENDPOINTS.getProjects, options);
			if (projectData) {
				// "created_from" field in db
				const creators_obj = projectData.peers.filter((e) => e.title === "Ideator");

				const details = {
					name: projectData.name,
					description: projectData.description,
					stage: projectData.stage,
					categories: projectData.categories.map((e) => e.name).toString(),

					project_creators: creators_obj.map((e) => e.user).toString(), //check this

					license: projectData.license.name,
					accepted_peers: projectData.peers.filter((e) => e.status === "accepted").length,
					pending_peers: projectData.peers.filter((e) => e.status === "pending").length,
					open_positions: projectData.positions.filter((e) => e.status === "open").length,
					close_positions: projectData.positions.filter((e) => e.status === "closed").length,
					topics: projectData.qa.length,
					created_At: new Date(projectData.createdAt).toLocaleString(),
				};
				this.items = [details];
			}
			this.projectData = projectData;
		},
	},
};
</script>

<style lang="scss" scoped></style>
