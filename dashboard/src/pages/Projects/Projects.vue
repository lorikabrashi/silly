<template>
	<div class="projects-page">
		<ConfirmModal :obj="modalData" :modalState="confirmState" :modalMessage="confirmMessage" @reject="cancelDelete" @accept="deleteProject" />
		<b-tabs>
			<b-tab v-for="(item, key, index) in projects" :key="index" :title="key.charAt(0).toUpperCase() + key.slice(1)" :active="index === 0">
				<v-client-table class="silly__default-table" :data="item" :columns="columns" :options="options">
					<template slot="actions" slot-scope="props">
						<router-link :to="url + props.row._id">
							<i class="edit-icon las la-edit"></i>
						</router-link>
						<i class="delete-icon las la-minus-circle" @click="triggerModal(props.row._id, props.row.name)"> </i>
					</template>
				</v-client-table>
			</b-tab>
		</b-tabs>
	</div>
</template>
<script>
import api from "@/mixins/api";
import ConfirmModal from "@/components/Modals/Confirm";
export default {
	name: "Projects",
	mixins: [api],
	components: {
		ConfirmModal,
	},
	data() {
		return {
			projectsData: null, //for debugging
			url: "/project?id=",
			modalData: {},
			confirmState: false,
			confirmMessage: "",

			projects: {
				initiation: [],
				planning: [],
				execution: [],
				closure: [],
			},
			columns: ["name", "project_creators", "categories", "license", "accepted_peers", "pending_peers", "open_positions", "close_positions", "topics", "createdAt", "actions"],
			options: {
				sortable: ["name", "project_creators", "categories", "license", "accepted_peers", "pending_peers", "open_positions", "close_positions", "topics", "createdAt"],
				texts: {
					filter: "Search:",
				},
				headings: {
					createdAt: "Created At",
				},
				templates: {
					createdAt(h, row) {
						return new Date(row.createdAt).toLocaleString();
					},
					project_creators(h, row) {
                        return row.created_from.username
                    },
					categories(h, row) {
						let categores = row.categories.map((e) => e.name);
						return categores.toString();
					},
					license(h, row) {
						return row.license.name;
					},
					accepted_peers(h, row) {
						return row.peers.filter((e) => e.status === "accepted").length;
					},
					pending_peers(h, row) {
						return row.peers.filter((e) => e.status === "pending").length;
					},
					open_positions(h, row) {
						return row.positions.filter((e) => e.status === "open").length;
					},
					close_positions(h, row) {
						return row.positions.filter((e) => e.status === "closed").length;
					},
					topics(h, row) {
						return row.qa.length;
					},
				},
			},
		};
    },
    async created() {
		this.getTableData();
	},
	methods: {
		triggerModal(id, name) {
			this.modalData.id = id;
			this.confirmState = true;
			this.confirmMessage = `Are your sure that you want to delete: ${name}`;
		},
		cancelDelete() {
			this.confirmState = false;
			this.confirmMessage = "";
		},
		async deleteProject(data) {
			const options = {
				params: [data.id],
			};
			const result = await this.getData(this.ENDPOINTS.deleteProject, options);
			if (result) {
				this.getTableData();
				this.$toasted.success("Project Deleted!");
			}
		},
		async getTableData() {
			const options = {
				query: {
					fields: "_id,stage,name,peers,categories,license,positions,qa,created_from,createdAt",
				},
			};
			const projects = await this.getData(this.ENDPOINTS.getProjects, options);
			if (projects) this.formatData(projects);
		},
		formatData(projects) {
            this.projectsData = projects;

			const projectsObj = {
				initiation: projects.filter((e) => e.stage === "initiation"),
				planning: projects.filter((e) => e.stage === "planning"),
				execution: projects.filter((e) => e.stage === "execution"),
				closure: projects.filter((e) => e.stage === "closure"),
			};

			this.projects = projectsObj;
		},
	},
};
</script>
<style src="./Projects.scss" lang="scss" />
