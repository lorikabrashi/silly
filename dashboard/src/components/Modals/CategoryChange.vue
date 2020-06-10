<template>
	<b-modal ref="categoryModal" @hide="close" title="Update Category" v-model="state" body-bg-variant="white">
		<b-container>
			<b-row>
				<b-col xs="12" lg="12">
					<Widget class="categoryWidget">
						<form>
                            <div class="col">
                                <label for="name" class="col-4 col-form-label pl-0">Name</label>
                                <input v-model="category.name" class="col form-control" ref="name" type="text" name="name" />
                            </div>
                            <div class="col">
                                <label for="description" class="col-4 col-form-label pl-0">Description</label>
                                <b-textarea v-model="category.description" class="col form-control" ref="description" name="description" />
                            </div>
                            <div class="col">
                                <label for="parent" class="col-4 col-form-label pl-0">Parent</label>
                                <b-select v-model="category.parent" :options="filtredCategories" name="parent" />
                            </div>
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
    props: {
       modalState: Boolean,
       categoryObj: Object,
       categoryList: Array
    },
    watch: {
		modalState: function(newVal) {
            this.state = newVal;
        },
        categoryObj: function(newVal){
            this.category = newVal
            this.filterList()
        },
        categoryList: {
            immediate: true,
            deep: true,
            handler(newVal){
                this.categories = newVal
            } 
        }
	},
    data(){
        return{
            state: false,
            category: {},
            categories: [],
            filtredCategories: []
        }
    },
    methods: {
        filterList(){
            const removeChildren = (obj, excludeCategories) => {
                if(obj.children && obj.children.length){
                    obj.children.forEach(elem => {
                        excludeCategories.push(elem._id);
                        removeChildren(elem, excludeCategories);
                    })
                }
            };
            const excludeCategories = [];
            this.categories.forEach(elem => {
                if(elem.value == this.category._id){
                    excludeCategories.push(elem.value);
                    removeChildren(elem, excludeCategories)
                }
            })
            this.filtredCategories = this.categories.filter( el => !excludeCategories.includes(el.value) ); 
        },
        close() {
			this.state = false;
            this.$emit("closed");
		},
		save() {
            this.$emit("save", this.category);
            this.$refs.categoryModal.hide();
		},
    }
};
</script>

<style lang="scss" scoped></style>
