<template>
	<b-modal ref="addCategoryModal" @hide="close" title="Add Category" v-model="state" body-bg-variant="white">
		<b-container>
			<b-row>
				<b-col xs="12" lg="12">
					<Widget class="categoryWidget">
						<form>

                        </form>
					</Widget>
				</b-col>
			</b-row>
		</b-container>
         <template v-slot:modal-footer>
			<b-button variant="info" @click="$refs.addCategoryModal.hide()">Cancel</b-button>
			<b-button variant="success" @click="addCategory">Add Category</b-button>
		</template>
	</b-modal>
</template>

<script>
export default {
	name: "AddCategory",
	data() {
		return {
            state: false,
        };
	},
	props: {
        modalState: Boolean
    },
	watch: {
        modalState: function(newVal) {
            this.state = newVal;
        },
    },
	methods: {
        close() {
            this.state = false;
            this.$emit("closed");
        },
        addCategory(){
            this.$emit("addCategory");
            this.$refs.categoryModal.hide();
        },
	},
};
</script>
<style lang="scss" scoped></style>
