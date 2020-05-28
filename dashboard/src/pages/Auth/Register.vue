<template>
	<div class="auth-page">
		<b-container>
			<AuthLogo />
			<Widget class="widget-auth mx-auto" title="<h3 class='mt-0'>First Time Registration</h3>"  customHeader>
				<p class="widget-auth-info">
					Use your email/username to sign in.
				</p>
				<form class="mt" @submit.prevent="register">
					<b-alert class="alert-sm" variant="danger" :show="!!errorMessage">
						{{ errorMessage }}
					</b-alert>
					<div class="form-group">
						<input class="form-control no-border" ref="username" required name="username" placeholder="Username" />
					</div>
                    <div class="form-group">
						<input class="form-control no-border" type="email" ref="email" required name="email" placeholder="Email" />
					</div>
					<div class="form-group">
						<input class="form-control no-border" ref="password" required type="password" name="password" placeholder="Password" />
					</div>
					<b-button type="submit" size="sm" class="auth-btn mb-3" variant="inverse">Register</b-button>
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
import { Api, ENDPOINTS } from "@/core/Api";

export default {
    name: "RegisterPage",
    components: { 
		Widget,
		AuthLogo,
		AuthFooter
	},
    data() {
		return {
			errorMessage: null
		};
    },
    methods: {
        async register() {
            const username = this.$refs.username.value;
            const email = this.$refs.email.value;
            const password = this.$refs.password.value;

            const validateRegister = Validations.validateRegister(username, email, password);
            if(!validateRegister.isValid){
                this.errorMessage = validateRegister.message;
				return
            }
            const options = {
                data: {
                    username,
                    email,
                    password 
                }
            }
            const response = await Api.call(ENDPOINTS.register, options);
            if(response.confirmation.toLowerCase() !== 'success'){
                this.errorMessage = response.message;
                return
            }
            this.$router.push("/login");
        }
    },
    async created(){
        const response = await Api.call(ENDPOINTS.hasAdmin);
        if(response.results){
            this.$router.push("/login");
        }
    }
}
</script>
