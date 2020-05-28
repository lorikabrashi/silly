<template>
	<ErrorPage v-if="!userId || !user" />
	<div class="user-page" v-else>
		<PasswordModal @closed="toggleModal" @save="changePassword" :modalState="pwdModal" />
		<b-container>
			<div class="space-between">
				<h1 class="page-title"><strong>User</strong> Info</h1>

				<div class="profile_info">
					<ul class="user-info_list">
						<li class="info_item">
							Verified: <strong>{{ user.verified }}</strong>
						</li>
						<li class="info_item">
							Role: <strong>{{ user.role }}</strong>
						</li>
						<template v-if="user.role !== 'admin'">
							<li class="info_item">Projects: <strong>35</strong></li>
						</template>
					</ul>
					<Avatar @save="avatarChanged" :avatar="user.profile.avatar" />
				</div>
			</div>
			<b-row>
				<b-col xs="12" lg="6">
					<Widget>
						<form class="" @submit.prevent="updateUser">
							<legend>
								<span><strong>Account</strong> information</span>
							</legend>

							<div role="group" class="form-row form-group" horizontal="" breakpoint="md">
								<label for="username" class="col-4 col-form-label text-md-right">Username</label>
								<div class="col">
									<input v-model="user.username" class="col form-control" :disabled="!isCurrentUser()" ref="username" type="text" name="username" />
								</div>
							</div>

							<div role="group" class="form-row form-group" horizontal="" breakpoint="md">
								<label for="email" class="col-4 col-form-label text-md-right">Email</label>
								<div class="col">
									<input v-model="user.email" class="col form-control" disabled ref="email" type="email" name="email" />
								</div>
							</div>

							<div role="group" class="form-row form-group" horizontal="" breakpoint="md">
								<label for="password" class="col-4 col-form-label text-md-right">Password</label>
								<div class="col">
									<button type="button" @click="toggleModal" class="btn mr-2 btn-sm btn-primary">Change</button>
								</div>
							</div>

							<legend>
								<strong>Personal</strong> information
								<div></div>
							</legend>

							<div role="group" class="form-row form-group" horizontal="" breakpoint="md">
								<label for="first_name" class="col-4 col-form-label text-md-right">First Name</label>
								<div class="col">
									<input v-model="user.profile.first_name" class="col form-control" ref="first_name" type="text" name="first_name" />
								</div>
							</div>
							<div role="group" class="form-row form-group" horizontal="" breakpoint="md">
								<label for="last_name" class="col-4 col-form-label text-md-right">Last Name</label>
								<div class="col">
									<input v-model="user.profile.last_name" class="col form-control" ref="last_name" type="text" name="last_name" />
								</div>
							</div>
							<div role="group" class="form-row form-group" horizontal="" breakpoint="md">
								<label for="phone_number" class="col-4 col-form-label text-md-right">Phone Number</label>
								<div class="col">
									<input v-model="user.profile.phone_number" class="col form-control" ref="phone_number" type="tel" name="phone_number" />
								</div>
							</div>

							<div class="text-md-right mt-sm">
								<button type="submit" class="btn mr-2 btn-danger">Update</button>
							</div>
						</form>
					</Widget>
				</b-col>

				<b-col xs="12" lg="12" v-if="user.role !== 'admin'">
					<ProjectDetailsModal @close="closeProjectDetails" :modalState="projectModal" :projectId="projectId" />

					<Widget class="silly__invite-responses-widget" title="<h2><strong>Invite</strong> Responses</h2>" customHeader>
						<v-client-table class="silly__default-table" :data="inviteDetails" :columns="columns" :options="options">
							<template slot="project" slot-scope="props">
								<button type="button" class="btn btn-xs btn-info" @click="openProjectDetails(props.row.project)">Details</button>
							</template>
						</v-client-table>
					</Widget>
				</b-col>

				<b-col xs="12" lg="12">
					<pre>{{ user }}</pre>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
import ErrorPage from "@/pages/Error/Error";
import PasswordModal from "@/components/Modals/PasswordChange";
import ProjectDetailsModal from "@/components/Modals/ProjectDetails";
import Avatar from "@/components/Avatar/Avatar";
import Validations from "@/core/Validations";
import api from "@/mixins/api";

export default {
	name: "UserPage",
	mixins: [api],
	components: {
		ErrorPage,
		PasswordModal,
		ProjectDetailsModal,
		Avatar,
	},
	props: ["userId"],
	computed: {
		loggedInId() {
			return this.$store.state.auth.user._id;
		},
	},
	data() {
		return {
			user: this.getDefaultModel(),
			pwdModal: false,
			projectModal: false,
			projectId: null,
			inviteDetails: [],
			columns: ["status", "project", "response_Text", "created_At", "updated_At"],
			options: {
				sortable: ["status", "created_At", "updated_At"],
				filterable: false,
			},
		};
	},
	async created() {
		await this.getUserData();
		this.setInviteDetails();
	},

	methods: {
		isCurrentUser() {
			return this.loggedInId === this.user._id;
		},
		async avatarChanged(file) {
			let formData = new FormData();
			formData.append("avatar", file);
			const options = {
				headers: { "Content-Type": "multipart/form-data" },
				params: [this.user._id],
				data: formData,
			};
			const response = await this.getData(this.ENDPOINTS.updateAvatar, options);
			if(response) this.$toasted.success("Avatar updated!");
		},
		async updateUser() {
			const validUser = Validations.validateEditUser(this.user);
			if (!validUser.isValid) {
				this.$toasted.error(validUser.message);
				return;
			}
			const options = {
				params: [this.user._id],
				data: {
					first_name: this.user.profile.first_name,
					last_name: this.user.profile.last_name,
					phone_number: this.user.profile.phone_number,
				},
			};
			if (this.isCurrentUser()) {
				options.data.username = this.user.username;
			}
			const response = await this.getData(this.ENDPOINTS.updateUser, options);
			if(response) this.$toasted.success("User updated!");
		},
		toggleModal() {
			return (this.pwdModal = !this.pwdModal);
		},
		async changePassword(password) {
			const options = {
				params: [this.user._id],
				data: { password },
			};
			const response = await this.getData(this.ENDPOINTS.updatePassword, options);
			if(response) this.$toasted.success("Password Changed!");
		},
		getDefaultModel() {
			return {
				profile: {},
				invites: [],
			};
		},
		async getUserData() {
			const options = {
				params: [this.userId],
			};
			const user = await this.getData(this.ENDPOINTS.getUser, options);
			if(user){
				if (!user.hasOwnProperty("profile")) user.profile = {};
				if (!("avatar" in user.profile)) {
					user.profile.avatar = require("../../assets/avatars/avatar1.jpg");
				} else {
					user.profile.avatar = process.env.VUE_APP_SERVER_URL + user.profile.avatar;
				}
			}
			this.user = user;
		},
		setInviteDetails() {
			const invites = [];
			this.user.invites.forEach((elem) => {
				const obj = {
					status: elem.status,
					project: elem.project,
					response_Text: elem.responseText,
					created_At: new Date(elem.createdAt).toLocaleString(),
					updated_At: new Date(elem.updatedAt).toLocaleString(),
				};
				invites.push(obj);
			});

			this.inviteDetails = invites;
		},
		openProjectDetails(projectId) {
			this.projectId = projectId;
			this.projectModal = true;
		},
		closeProjectDetails() {
			this.projectModal = false;
		},
	},
};
</script>
<style src="./Users.scss" lang="scss" scoped />
