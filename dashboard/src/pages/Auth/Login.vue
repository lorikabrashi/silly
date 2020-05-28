<template>
	<div class="auth-page">
		<b-container>
			<AuthLogo />
			<Widget class="widget-auth mx-auto" title="<h3 class='mt-0'>Login to Silly</h3>" customHeader>
				<p class="widget-auth-info">
					Use your email/username to sign in.
				</p>
				<form class="mt" @submit.prevent="login">
					<b-alert class="alert-sm" variant="danger" :show="!!errorMessage">
						{{ errorMessage }}
					</b-alert>
					<div class="form-group">
						<input class="form-control no-border" ref="email" required name="email" placeholder="Email/Username" />
					</div>
					<div class="form-group">
						<input class="form-control no-border" ref="password" required type="password" name="password" placeholder="Password" />
					</div>
					<b-button type="submit" size="sm" class="auth-btn mb-3" variant="inverse">Login</b-button>
					<small><router-link to="/forgot-password">Forgot Password</router-link></small>
				</form>
			</Widget>
		</b-container>
		<AuthFooter />
	</div>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import AuthLogo from "@/components/AuthComps/AuthLogo";
import AuthFooter from "@/components/AuthComps/AuthFooter";
import Validations from "@/core/Validations";
import { mapActions } from "vuex";

export default {
	name: "LoginPage",
	components: {
		AuthLogo,
		Widget,
		AuthFooter
	},
	data() {
		return {
			errorMessage: null
		};
	},
	methods: {
		...mapActions("auth", ["AUTH_LOGIN"]),
		login: async function() {
			const email = this.$refs.email.value;
			const password = this.$refs.password.value;
			const validateLogin = Validations.validateLogin(email, password);

			if (!validateLogin.isValid) {
				this.errorMessage = validateLogin.message;
				return;
			}
			let userKey = "username";
			if (email.includes("@")) {
				userKey = "email";
			}
			const options = {
				data: {
					[userKey]: email,
					password,
					type: process.env.VUE_APP_USER_TYPE
				}
			};
			const response = await this.AUTH_LOGIN(options);
			if (typeof response === 'boolean' && response) {
				this.$router.push("/dashboard");
			}
			else{
				this.errorMessage = response.message;
				return;
			}
			
		}
	}
};
</script>
