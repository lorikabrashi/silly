<template>
	<ErrorPage v-if="!projectId || !project" />
	<div class="project-page" v-else>
		<b-tabs>
			<b-tab title="Details">
				<b-table stacked :items="details"></b-table>
			</b-tab>
			<b-tab title="Categories" active>
				<ProjectCategories :projectId="projectId" :categories="categories" @changed="refreshData"/>
			</b-tab>

			<b-tab title="Peers"> </b-tab>

			<b-tab title="Permissions"> </b-tab>

			<b-tab title="Positions"> </b-tab>

			<b-tab title="Forum Actions">
				<!-- TODO RAPORTS -->
			</b-tab>
		</b-tabs>
		<pre>
            {{ project }}
        </pre
		>
	</div>
</template>

<script>
import ErrorPage from "@/pages/Error/Error";
import api from "@/mixins/api";
import ProjectCategories from "@/components/Project/ProjectCategories"
export default {
	name: "Project",
	mixins: [api],
	components: {
		ErrorPage,
		ProjectCategories
	},
	props: ["projectId"],
	data() {
		return {
			project: {}, //debugging
			details: [],
			categories: [],
		};
	},
	async created() {
		await this.getProjectData();
	},
	methods: {
		async refreshData(){
			await this.getProjectData();
		},
		async getProjectData() {
			const options = {
				params: [this.projectId],
			};
			const project = await this.getData(this.ENDPOINTS.getProjects, options);

			this.setDetails(project);
			this.setCategories(project);
			this.setPeers();
			this.setPermissions();
			this.setPositions();

			/* TODO */
			this.setForumActions();

			this.project = project;
		},
		setDetails(project) {
			this.details = [ {
					project_Id: project._id,
					stage: project.stage,
					name: project.name,
					descriptions: project.descriptions,
					created_at: new Date(project.createdAt).toLocaleString(),
					updated_at: new Date(project.updatedAt).toLocaleString(),
				},
			];
		},
		setCategories(project) {
			const categories = [];
			project.categories.forEach((elem) => {
				categories.push({
					_id: elem._id,
					selected: false,
					name: elem.name,
					description: elem.description,
				});
			});
			this.categories = categories;
		},

		setPeers() {},
		setPermissions() {},
		setPositions() {},
		/* TODO */
		setForumActions() {},
	},
};
</script>
<style src="./Projects.scss" lang="scss" scoped />
