<template>
    <ErrorPage v-if="!code" />
    <div class="auth-page" v-else>
		<b-container>
			<AuthLogo />
			<Widget class="widget-auth mx-auto" title="<h3 class='mt-0'>Reset Password</h3>"  customHeader>
				<p class="widget-auth-info">
					Enter new password
				</p>
				<form class="mt" @submit.prevent="reset">
					<b-alert class="alert-sm" :variant="messageType" :show="!!message">
						{{ message }}
					</b-alert>
                    <div v-if="messageType === 'success'">
                        Continue to the <router-link to="/login">login</router-link>
                    </div>
                    <div v-if="!hideForm">
                        <div class="form-group">
                            <input class="form-control no-border" ref="password" required type="password" name="password" placeholder="Password" />
                        </div>
                        <b-button type="submit" size="sm" class="auth-btn mb-3" variant="inverse">Reset Password</b-button>
                    </div>
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
import ErrorPage from '@/pages/Error/Error'
import { Api, ENDPOINTS } from "@/core/Api";
export default {
    name: 'resetPasswordPage',
    props: ['code'],
    components: { 
		AuthLogo,
		Widget,
        AuthFooter,
        ErrorPage
    },
    data() {
        return{
            message: null,
            messageType: '',
            hideForm: false
        }
    },
    methods: {
        async reset(){
            const password = this.$refs.password.value;
            const validPasword = Validations.validatePassword(password);
            if(!validPasword.isValid){
                this.messageType = 'danger';
                this.message = validPasword.message;
				return
            }
            const options = {
                data: {
                    password
                },
                params: [ this.code ],
            } 
            const response = await Api.call(ENDPOINTS.resetPassword, options);
            if(response.confirmation.toLowerCase() !== 'success'){
                this.messageType = 'danger';
                this.message = response.message;
                return
            }
            this.messageType = 'success';
            this.message = 'Your password has been successfully updated';
            this.hideForm = true;
        }
    },
}
</script>