<template>
	<div class="Silly__project-categories">
		
		<ConfirmModal :obj="modalData" :modalState="confirmState" :modalMessage="confirmMessage" @reject="cancelDelete" @accept="removeCategories" />
		<AddCategoryModal :modalState="addCategoryModalState" :categoryList="categoryList" @closed="toggleAddCategoryModal" @addCategories="addCategories" />

		<div class="text-md-right mt-sm silly__add_remove-buttons">
			<b-button variant="success" @click="toggleAddCategoryModal">Add new</b-button>
			<b-button variant="danger" @click="removeCategoriesModal">Remove</b-button>
		</div>
		<v-client-table class="silly__default-table has_checkbox" :data="catTable.data" :columns="catTable.columns" :options="catTable.options" :key="renderTableKey">
			<template slot="h__select">
				<span><b-form-checkbox type="checkbox" @change="selectAll($event)"/></span>
			</template>
			<template slot="select" slot-scope="props">
				<b-form-checkbox :checked="catTable.allSelected" @id="{props.row._id}" @change="toggleSelect(props.row._id)" />
			</template>
			<template slot="actions" slot-scope="props">
				<b-button size="xs" variant="danger" @click="removeCategoryModal(props.row._id, props.row.name)">Remove</b-button>
			</template>
		</v-client-table>
	</div>
</template>
<script>
import ConfirmModal from "@/components/Modals/Confirm";
import AddCategoryModal from "@/components/Modals/AddCategory";
export default {
	name: "ProjectCategories",
	components: {
		ConfirmModal,
		AddCategoryModal
	},
	data() {
		return {
			renderTableKey: 0,
			confirmState: false,
			addCategoryModalState: false,
			confirmMessage: "",
			modalData: {},
			addCategoriesState: false,
			categoryList: [],
			catTable: {
				allSelected: false,
				data: [],
				columns: ["select", "name", "description", "actions"],
				options: {
					headings: ["select", "name", "description", "actions"],
					sortable: ["name", "description"],
					texts: {
						filter: "Search:",
					},
				},
			},
		};
	},
	props: {
		projectCategories: Array,
		projectId: String,
		categories: Array,
	},
	watch: {
		projectCategories: function(newVal) {
			this.catTable.data = newVal;
		},
		categories: function(newVal) {
			this.categoryList = newVal;
		},
	},
	methods: {
		async removeCategories(data) {
			const options = {
				data: { projectId: this.projectId },
			};
			let message = "";
			if ("ids" in data) {
				options.data.ids = data.ids;
				message = `Remove ${data.ids.length} categories`;
			} else {
				options.data.ids = [data.id];
				message = `Category removed`;
			}
			this.selectAll(false)
			this.forceRerenderTable()
			this.$emit("removeCategories", options, message);
		},
		cancelDelete() {
			this.confirmState = false;
			this.confirmMessage = "";
		},
		removeCategoryModal(id, name) {
			this.confirmMessage = `Are you sure you want to remove ${name}`;
			this.modalData = { id };
			this.confirmState = true;
		},
		removeCategoriesModal() {
			this.confirmMessage = `Are you sure you want to remove selected categories`;
			const ids = this.catTable.data.filter((e) => e.selected === true).map((e) => e._id);
			this.modalData.ids = ids;
			this.confirmState = true;
		},
		toggleAddCategoryModal() {
			this.addCategoryModalState = !this.addCategoryModalState;
		},
		addCategories(data) {
			const options = {
				data: { projectId: this.projectId },
			};
			let message = "";
			const ids = data.map((elem) => elem._id);
			if (ids.length) {
				options.data.ids = ids;
				message = "New categories added!";
				this.$emit("addCategories", options, message);
			}
		},
		selectAll(value) {
			this.catTable.data.forEach((elem) => {
				elem.selected = value;
			});
			this.catTable.allSelected = value;
		},
		toggleSelect(id) {
			const index = this.catTable.data.findIndex((elem) => elem._id === id);
			this.catTable.data[index].selected = !this.catTable.data[index].selected;
		},
		forceRerenderTable(){
			this.renderTableKey += 1
		}
	},
};
</script>
<style lang="scss" scoped>
</style>
