<template>
	<b-container>
		<ConfirmModal :obj="modalData" :modalState="confirmState" :modalMessage="confirmMessage" @reject="cancelDelete" @accept="deleteCategory" />
		<CategoryChange :categoryObj="modalData" :categoryList="categoryList" :modalState="categoryModal"  @closed="closeChangeModal" @save="changeCategory" />
		<b-row>
			<b-col xs="12" lg="4">
				<Widget>
					<form @submit.prevent="createCategory">
						<legend>
							<span><strong>Create</strong> Category</span>
						</legend>
						<div class="col">
							<label for="name" class="col-4 col-form-label pl-0">Name</label>
							<input v-model="categoryForm.name" class="col form-control" ref="name" type="text" name="name" />
						</div>
						<div class="col">
							<label for="description" class="col-4 col-form-label pl-0">Description</label>
							<b-textarea v-model="categoryForm.description" class="col form-control" ref="description" name="description" />
						</div>
						<div class="col">
							<label for="parent" class="col-4 col-form-label pl-0">Parent</label>
							<b-select v-model="categoryForm.parent" :options="categoryList" name="parent" />
						</div>
						<div class="col text-md-right">
							<div class="mt-3">
								<button type="submit" class="btn btn-success">Create</button>
							</div>
						</div>
					</form>
				</Widget>
			</b-col>
			<b-col xs="12" lg="8">
				<Widget>
					<v-client-table class="silly__default-table" :data="categories" :columns="tableCoumns" :options="tableOptions">
						<template slot="child_row" slot-scope="props">
							<div class="silly__default-table-description">
								<strong>Description:</strong>
								{{ props.row.description }}
							</div>
						</template>
						<template slot="actions" slot-scope="props">
							<i class="edit-icon fa fa-edit" @click="triggerChangeModal(props.row)"></i>

							<i class="delete-icon fa fa-trash" @click="triggerDeleteModal(props.row._id, props.row.name)"> </i>
						</template>
					</v-client-table>
				</Widget>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import api from "@/mixins/api";
import ConfirmModal from "@/components/Modals/Confirm";
import CategoryChange from "@/components/Modals/CategoryChange";
export default {
	name: "Categories",
	mixins: [api],
	components: {
		ConfirmModal,
		CategoryChange,
	},
	data() {
		return {
			confirmState: false,
			modalData: {},
			confirmMessage: "",

			categoryModal: false,

			categories: [],
			tableCoumns: ["name", "createdAt", "actions"],
			tableOptions: {
				uniqueKey: "_id",
				sortable: ["name", "createdAt"],
				headings: {
					createdAt: "Created At",
				},
				texts: {
					filter: "Search:",
				},
				templates: {
					createdAt(h, row) {
						return new Date(row.createdAt).toLocaleString();
					},
				},
			},
			categoryForm: this.setDefaultForm(),
			categoryList: this.setDefaultList(),
		};
	},
	async created() {
        await this.getCategories();
        console.log(window);
	},
	methods: {
		setDefaultForm() {
			return {
				name: "",
				description: "",
				parent: null,
			};
		},
		setDefaultList() {
			return [{ value: null, text: "Please select an option" }];
		},
		triggerDeleteModal(id, name) {
			this.modalData.id = id;
			this.confirmMessage = `Are your sure that you want to delete: ${name}`;
			this.confirmState = true;
		},
		triggerChangeModal(category) {
            this.modalData = category
            this.categoryModal = true
        },
        closeChangeModal(modal) {
            this.categoryModal = false
            this.modalData = {};
        },
		cancelDelete() {
			this.confirmState = false;
			this.modalData = {};
			this.confirmMessage = ``;
		},
		async deleteCategory(data) {
			const options = {
				params: [data.id],
			};
			const result = await this.getData(this.ENDPOINTS.deleteCategory, options);
			if (result) {
				await this.getCategories();
				this.$toasted.success("Category Deleted");
			}
        },
        async changeCategory(category){
            alert(JSON.stringify(category))
            
        },
		async getCategories() {
			const options = {
				params: [true],
			};
			const result = await this.getData(this.ENDPOINTS.getCategories, options);
			if (result) {
				this.setParentList(result);
                this.categories = result;
			}
		},
		async createCategory() {
			const options = {
				data: this.categoryForm,
			};
			const result = await this.getData(this.ENDPOINTS.createCategory, options);
			if (result) {
				await this.getCategories();
				this.categoryForm = this.setDefaultForm();
				this.$toasted.success("Category created");
			}
		},
		setParentList(categories) {
			const categoryList = [];
			categories.forEach((elem) => {
				categoryList.push({
					value: elem._id,
					text: elem.name,
				});
			});
			this.categoryList = [...this.setDefaultList(), ...categoryList];
		},
	},
};
</script>
<style src="./Categories.scss" lang="scss" scoped />
