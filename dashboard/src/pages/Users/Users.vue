<template>
	<div class="users-page">
		
		<ConfirmModal :obj="modalData" :modalState="confirmState" :modalMessage="confirmMessage" @reject="cancelDelete" @accept="deleteUser" />
		<CreateUserModal :modalState="userModalState" @reject="triggerUserModal" @accept="createUser" />
		
		<div class="space-between">
			<h1 class="page-title"><strong>Users</strong> Information</h1>
			<div><b-button variant="success" @click="triggerUserModal">Add new</b-button></div>
		</div>

		<b-tabs>
			<b-tab title="Users" active>
				<v-client-table class="silly__default-table" :data="usersData" :columns="columns" :options="options">
					<template slot="actions" slot-scope="props">
						<router-link :to="props.row.uri">
							<i class="edit-icon las la-edit"></i>
						</router-link>
						<i class="delete-icon las la-minus-circle" @click="triggerModal(props.row.id, props.row.username)"> </i>
					</template>
				</v-client-table>
			</b-tab>
			<b-tab title="Admins" >
				<v-client-table class="silly__default-table" :data="adminsData" :columns="columns" :options="options">
					<template slot="actions" slot-scope="props">
						<router-link :to="props.row.uri">
							<i class="edit-icon las la-edit"></i>
						</router-link>
						<i class="delete-icon las la-minus-circle" v-if="props.row.id !== loggedInId" @click="triggerModal(props.row.id, props.row.username)"> </i>
					</template>
				</v-client-table>
			</b-tab>
		</b-tabs>	

	</div>
</template>
<script>
import api from "@/mixins/api";
import ConfirmModal from "@/components/Modals/Confirm";
import CreateUserModal from "@/components/Modals/UserCreate";
export default {
	name: "Users",
	mixins: [api],
	components: { 
		ConfirmModal, 
		CreateUserModal 
	},
	data() {
		return {
			modalData: {},
			confirmState: false,
			confirmMessage: "",
			userModalState: false,

			columns: ["username", "email", "first_name", "last_name", "created_at", "actions"],
			usersData: [],
			adminsData: [],
			options: {
                sortable: ["username", "email", "first_name", "last_name", "created_at"],
                texts: {
                    filter: "Search:"
				},
			
			},
		};
	},
	computed: {
		loggedInId() {
			return this.$store.state.auth.user._id;
		},
	},
	created() {
		this.getTableData();
	},
	methods: {
		cancelDelete() {
			this.confirmState = false;
			this.confirmMessage = "";
		},
		triggerModal(id, username) {
			this.modalData.id = id;
			this.confirmState = true;
			this.confirmMessage = `Are your sure that you want to delete: ${username}`;
		},
		triggerUserModal(){
			this.userModalState = !this.userModalState;
		},
		async createUser(user){	
			const options = {
				data: user,
			};
			const result = await this.getData(this.ENDPOINTS.createUser, options);
			if(result){
				this.getTableData();
				this.$toasted.success("New user created!");
			}
		},
		async deleteUser(data) {
			const options = {
				params: [data.id],
			};
			const result = await this.getData(this.ENDPOINTS.deleteUser, options);
			if(result){
				this.getTableData();
				this.$toasted.success("User deleted!");
			}
		},
		async getTableData() {
			const options = {
				query: {
					fields: "_id,username,email,createdAt,profile.first_name,profile.last_name",
				},
			};
			const users = await this.getData(this.ENDPOINTS.getUsers, options);
			const admins = await this.getData(this.ENDPOINTS.getAdmins, options);

			if(users) this.usersData = this.formatData(users);
			if(admins) this.adminsData = this.formatData(admins);
		},
		formatData(data){
			const newData = [];
			data.forEach((elem) => {
				const obj = {
					id: elem._id,
					username: elem.username,
					email: elem.email,
					created_at: new Date(elem.createdAt).toLocaleString(),
					first_name: elem["profile.first_name"]["first_name"] || "",
					last_name: elem["profile.last_name"]["last_name"] || "",
					uri: `/user?id=${elem._id}`,
				};
				newData.push(obj);
			});

			return newData;
		},
	},
};
</script>
<style src="./Users.scss" lang="scss" scoped />
