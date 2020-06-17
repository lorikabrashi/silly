<template>
	<b-modal ref="addCategoryModal" @hide="close" title="Add Category" v-model="state" body-bg-variant="white">
		<b-container>
			<b-row>
				<b-col xs="12" lg="12">
					<Widget class="categoryWidget">
						<form>
							<div class="col form-group  abc-checkbox abc-checkbox-primary">
								<div class="group" v-for="item in categories" :key="item._id">
									<input :disabled="item.disabled" v-model="item.onProject" :value="item._id" type="checkbox" :id="item._id" />
									<label :for="item._id">{{ item.name }}</label>
								</div>
							</div>
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
			categories: [],
		};
	},
	props: {
		modalState: Boolean,
		projectCategories: Array,
		categoryList: Array
	},
	watch: {
		modalState: function(newVal) {
			this.state = newVal;
		},
		categoryList: function(newVal) {
			this.categories = newVal;
		},
	},
	methods: {
		close() {
			this.state = false;
			this.$emit("closed");
		},
		addCategory() {
			const addedCategories = this.categories.filter(elem => !elem.disabled && elem.onProject);
			this.$emit("addCategories", addedCategories);
			this.$refs.addCategoryModal.hide();
		},
	},
};
</script>
<style lang="scss" scoped></style>
