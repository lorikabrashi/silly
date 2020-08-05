<template>
    <div class="Silly__project-permissions">
        <ConfirmModal :obj="modalData" :modalState="confirmState" :modalMessage="confirmMessage" @reject="cancelDelete" @accept="removePermissions" />
        <div class="text-md-right mt-sm silly__add_remove-buttons">
            <b-button variant="success" @click="addPermissions">Add new</b-button>
            <b-button variant="danger" @click="removePermissionsModal">Remove</b-button>
        </div>
        <v-client-table class="silly__default-table has_checkbox" :data="permissionsTable.data" :columns="permissionsTable.columns" :options="permissionsTable.options" :key="renderTableKey">
            <template slot="h__select">
                <span class="VueTables__heading">Check All </span>
                <span class="pull-right"><b-form-checkbox type="checkbox" @change="selectAll($event)"/></span>
            </template>
            <template slot="select" slot-scope="props">
                <b-form-checkbox :checked="permissionsTable.allSelected" @id=";`${props.row._id}`" @change="toggleSelect(props.row._id)" />
            </template>
            <template slot="actions" slot-scope="props">
                <b-button size="xs" variant="danger" @click="removePermissionModal(props.row._id, props.row.name)">Remove</b-button>
            </template>
        </v-client-table>
		<pre class="codeSnippet">{{defaultPermissions}}</pre>
    </div>
</template>
<script>
import ConfirmModal from '@/components/Modals/Confirm'
export default {
    name: '',
    components: {
        ConfirmModal,
    },
    data() {
        return {
            renderTableKey: 0,
            confirmState: false,
			confirmMessage: '',
			defaultPermissions: [],
            modalData: {},
            permissionsTable: {
                allSelected: false,
                data: [],
                columns: ['select', 'name', 'description', 'invite_peers', 'qa', 'stage', 'categories', 'positions', 'createdAt', 'actions'],
                options: {
                    sortable: ['name', 'description'],
                    texts: {
                        filter: 'Search:',
					},
					headings: {
						createdAt: "Created At",
						qa: "Q&A",
						positions: 'Job Position'
					},
					templates: {
						createdAt(h, row) {
							return new Date(row.createdAt).toLocaleString();
						},
						invite_peers(h, row){
							return row.permissions.invite_peers ? "Enabled" : 'Disabled'
						},
						qa(h, row){
							return row.permissions.qa ? "Enabled" : 'Disabled'
						},
						stage(h, row){
							return row.permissions.stage ? "Enabled" : 'Disabled'
						},
						categories(h, row){
							return row.permissions.categories ? "Enabled" : 'Disabled'
						},
						positions(h, row){
							return row.permissions.positions ? "Enabled" : 'Disabled'
						}
					},
                },
            },
        }
    },
    props: {
		projectPermissions: Array,
		permissions: Array
    },
    watch: {
        projectPermissions: function(newVal) {
            this.permissionsTable.data = newVal
		},
		permissions: function(newVal){
			this.defaultPermissions = newVal
		}
    },
    methods: {
        addPermissions() {},

        removePermissions(data) {
            const options = {
                data: { projectId: this.projectId },
            }
            let message = ''
            if ('ids' in data) {
                options.data.ids = data.ids
                message = `Remove ${data.ids.length} permissions`
            } else {
                options.data.ids = [data.id]
                message = `Permission removed`
            }
            this.forceRerenderTable()
            this.$emit('removePermissions', options, message)
        },
        cancelDelete() {
            this.confirmState = false
            this.confirmMessage = ''
        },
        selectAll(value) {
            this.permissionsTable.data.forEach((elem) => {
                elem.selected = value
            })
            this.permissionsTable.allSelected = value
        },
        toggleSelect(id) {
            const index = this.permissionsTable.data.findIndex((elem) => elem._id === id)
            this.permissionsTable.data[index].selected = !this.permissionsTable.data[index].selected
        },
        removePermissionModal(id, name) {
            this.confirmMessage = `Are you sure you want to remove ${name}`
            this.modalData = { id }
            this.confirmState = true
        },
        removePermissionsModal() {
            this.confirmMessage = `Are you sure you want to remove selected permissions`
            const ids = this.permissionsTable.data.filter((e) => e.selected === true).map((e) => e._id)
            this.modalData.ids = ids
            this.confirmState = true
        },
        forceRerenderTable() {
            this.renderTableKey += 1
        },
    },
}
</script>
<style lang="scss" scoped></style>
