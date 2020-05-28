<template>
	<b-modal ref="confirmModal" @hide="close" title="Confirm" v-model="state" body-bg-variant="white">
		<b-container>
			<b-row>
				<b-col xs="12" lg="12">
					{{message}}
				</b-col>
			</b-row>
		</b-container>
		<template v-slot:modal-footer>
			<b-button variant="primary" @click="$refs.confirmModal.hide()">Cancel</b-button>
			<b-button variant="danger" @click="confirm">Confirm</b-button>
		</template>
	</b-modal>
</template>

<script>
export default {
    name: 'ConfirmModal',
    data(){
		return {
            state: false,
            message: ''
		}
	},
	props: { 
        modalState: Boolean, 
        modalMessage: String, 
        obj: Object
    },
	watch: { 
		modalState: function(newState){
			this.state = newState
        },
        modalMessage: function(newMessage){
            this.message = newMessage
        }
    },
    methods: {
        close() {
			this.state = false;
            this.message = '';
            this.$emit('reject', this.obj)
        },
        confirm() {
            this.$emit('accept', this.obj)
            this.$refs.confirmModal.hide()
        }
    }
}
</script>

<style lang="scss" scoped>
.btn-danger{
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545;
    &:hover{
        background-color: #c82333;
        border-color: #bd2130;
    }
}

</style>