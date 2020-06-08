<template>
	<b-modal ref="passwordModal" @hide="close" title="Change Password" v-model="state" body-bg-variant="white">
		<b-container>
			<b-row>
				<b-col xs="12" lg="12">
					<Widget class="passwordWidget">
						<form>
							<b-alert class="alert-sm" variant="danger" :show="!!errMessage">
								{{ errMessage }}
							</b-alert>
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
			<b-button variant="info" @click="$refs.passwordModal.hide()">Cancel</b-button>
			<b-button variant="success" @click="save">Save changes</b-button>
		</template>
	</b-modal>
</template>

<script>
import Validations from "@/core/Validations";
export default {
	name: "PasswordModal",
	data() {
		return {
			state: false,
			errMessage: "",
			password: "",
			confPassword: "",
		};
	},
	props: ["modalState"],
	watch: {
		modalState: function(newVal) {
			this.state = newVal;
		},
	},
	methods: {
		close() {
			this.state = false;
			this.errMessage = "";
			this.password = "";
			this.confPassword = "";
			this.$emit("closed", false);
		},
		save() {
			const validPasword = Validations.validatePassword(this.password, this.confPassword);
			if (!validPasword.isValid) {
				this.errMessage = validPasword.message;
				return;
			}
			this.errMessage = "";
			this.$emit("save", this.password);
			this.$refs.passwordModal.hide();
		},
	},
};
</script>

<style lang="scss" scoped>
.passwordWidget {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 90%;
	margin: 10px 0 0 0; // reset bottom
}
</style>
