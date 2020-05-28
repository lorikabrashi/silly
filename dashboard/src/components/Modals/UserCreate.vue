<template>
	<b-modal ref="UserModal" @hide="close" title="Create User" v-model="state" body-bg-variant="white">
		<b-container>
			<b-row>
				<b-col xs="12" lg="12">
					<Widget class="create-user">
						<form>
							<b-alert class="alert-sm" variant="danger" :show="!!errMessage" v-html="errMessage" />

							<div role="group" class="form-row content-center form-group" horizontal="" breakpoint="md">
								<label for="email" class="col-6 col-form-label text-md-right">Email:</label>
								<div class="col">
									<input v-model="email" class="col-12 form-control" ref="email" type="email" placeholder="email" name="email" />
								</div>
							</div>
							<div role="group" class="form-row content-center form-group" horizontal="" breakpoint="md">
								<label for="username" class="col-6 col-form-label text-md-right">Username:</label>
								<div class="col">
									<input v-model="username" class="col-12 form-control" ref="username" type="text" placeholder="username" name="username" />
								</div>
							</div>
							<div role="group" class="form-row content-center form-group" horizontal="" breakpoint="md">
								<label for="role" class="col-6 col-form-label text-md-right">Role:</label>
								<div class="col">
									<b-form-select name="role" v-model="role" :options="options"></b-form-select>
								</div>
							</div>
							<div role="group" class="form-row content-center form-group" horizontal="" breakpoint="md">
								<label for="password" class="col-6 col-form-label text-md-right">New Password:</label>
								<div class="col">
									<input v-model="password" class="col-12 form-control" ref="password" type="password" placeholder="password" name="password" />
								</div>
							</div>
							<div role="group" class="form-row form-group" horizontal="" breakpoint="md">
								<label for="conf_password" class="col-6 col-form-label text-md-right">Confirm Password:</label>
								<div class="col">
									<input v-model="confPassword" class="col-12 form-control" ref="conf_password" type="password" placeholder="password" name="conf_password" />
								</div>
							</div>
						</form>
					</Widget>
				</b-col>
			</b-row>
		</b-container>
		<template v-slot:modal-footer>
			<b-button variant="secondary" @click="$refs.UserModal.hide()">Cancel</b-button>
			<b-button variant="primary" @click="create">Create</b-button>
		</template>
	</b-modal>
</template>

<script>
import Validations from "@/core/Validations";
export default {
	name: "CreateUserModal",
	data() {
		return {
			role: "user",
			options: [
				{ value: "user", text: "User" },
				{ value: "admin", text: "Admin" },
			],
			email: "",
			username: "",
			password: "",
			confPassword: "",
			state: false,
			errMessage: "",
		};
	},
	props: {
		modalState: Boolean,
	},
	watch: {
		modalState: function(newState) {
			this.state = newState;
		},
	},
	methods: {
		close() {
			this.username = "";
			this.email = "";
			this.role = "user";
			this.password = "";
			this.confPassword = "";
			this.errMessage = "";
			this.state = false;
			this.$emit("reject");
		},
		create() {
			const user = {
				email: this.email,
				username: this.username,
				role: this.role,
				password: this.password,
				confPassword: this.confPassword,
			};

			const validUser = Validations.validateCreateUser(user);
			if (!validUser.isValid) {
				this.errMessage = validUser.message;
				return;
			}
			delete user["confPassword"];

			this.$emit("accept", user);
			this.$refs.UserModal.hide();
		},
	},
};
</script>

<style lang="scss" scoped>
.create-user {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 90%;
	margin: 10px 0 0 0; // reset bottom
}
</style>
