<template>
	<b-modal ref="categoryModal" @hide="close" title="Change Category" v-model="state" body-bg-variant="white">
		<b-container>
			<b-row>
				<b-col xs="12" lg="12">
					<Widget class="categoryWidget">
						<form>
							<b-alert class="alert-sm" variant="danger" :show="!!errMessage">
								{{ errMessage }}
							</b-alert>
						</form>
					</Widget>
				</b-col>
			</b-row>
		</b-container>
        <template v-slot:modal-footer>
			<b-button variant="info" @click="$refs.categoryModal.hide()">Cancel</b-button>
			<b-button variant="success" @click="save">Save changes</b-button>

		</template>
	</b-modal>
</template>

<script>
export default {
    name: "CategoryModal",
    props: ["modalState"],
    watch: {
		modalState: function(newState) {
            this.state = newState;
		},
	},
    data(){
        return{
            state: false,
			errMessage: "",
        }
    },
    methods: {
        close() {
			this.state = false;
			this.errMessage = "";
			this.$emit("closed", false);
		},
		save() {
            this.errMessage = ''
			this.$emit("save", '');
            this.$refs.categoryModal.hide();
		},
    }
};
</script>

<style lang="scss" scoped></style>
