<template>
    <div class="auth-page">
		<b-container>
			<AuthLogo />
            <Widget class="widget-auth mx-auto" title="<h3 class='mt-0'>Forgot Password?</h3>"  customHeader>
                <p class="widget-auth-info">
                    That's okay, it happenens!<br>We just need your registered email address to send your the link to create a new one
                </p>
                <form class="mt" @submit.prevent="requestReset">
                    <b-alert class="alert-sm" :variant="messageType" :show="!!message">
                        {{ message }}
                    </b-alert>
                    <div v-if="!hideForm">
                        <div class="form-group">
                            <input class="form-control no-border" type="email" ref="email" required name="email" placeholder="Email" />
                        </div>
                        <b-button type="submit" size="sm" class="auth-btn mb-3" variant="inverse">Submit Request</b-button>
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
import { Api, ENDPOINTS } from "@/core/Api";

export default {
    name: "forgotPasswordPage",
    components: { 
		AuthLogo,
		Widget,
		AuthFooter
    },
    data() {
		return {
            message: null,
            messageType: '',
            hideForm: false
		};
    },
    methods: {
        async requestReset() {
            const email = this.$refs.email.value;
            const options = {
                data: { email }
            }
            const response = await Api.call(ENDPOINTS.forgotPassword, options);
            if(response.confirmation.toLowerCase() !== 'success'){
                this.messageType = 'danger';
                this.message = response.message
                return
            }
            this.messageType = 'success';
            this.message = 'Please check your email address!';
            this.hideForm = true;
        }
    },
}
</script>
<style lang="scss" scoped>
    .widget-auth-info{
        margin: 20px 0;
    }
</style>