<template>
    <b-container>
        <ConfirmModal :obj="modalData" :modalState="confirmState" :modalMessage="confirmMessage" @reject="cancelDelete" @accept="deletePermission" />
        <b-row>
            <b-col xs="12" lg="4">
                <Widget>
                    <form @submit.prevent="createPermission">
                        <legend>
                            <span> <strong>Create</strong> Permission </span>
                        </legend>
                        <div class="col">
                            <label for="name" class="col-4 col-form-label pl-0">Name</label>
                            <input v-model="permissionForm.name" class="col form-control" ref="name" type="text" name="name" />
                        </div>
                        <div class="col">
                            <label for="description" class="col-4 col-form-label pl-0">Description</label>
                            <b-textarea v-model="permissionForm.description" class="col form-control" ref="description" name="description" />
                        </div>
                        <div class="col">
                            <label for="description" class="col-4 col-form-label pl-0">Permissions</label>
                            <div class="group abc-checkbox abc-checkbox-primary" v-for="(value, name) in permissionForm.permissions" :key="name">
                                <input v-model="permissionForm.permissions[name]" :value="value" type="checkbox" :id="name" />
                                <label :for="name">{{ formatName(name) }}</label>
                            </div>
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
                    <v-client-table class="silly__default-table" :data="permissions" :columns="tableCoumns" :options="tableOptions">
                        <template slot="child_row" slot-scope="props">
                            <div class="silly__default-table-description">
                                <div class="desc">
                                    <strong>Description:</strong>
                                    <span>{{ props.row.description }}</span>
                                </div>
                                <div class="permissions">
                                    <ul>
                                        <li v-for="(value, name) in props.row.permissions" :key="name">
                                            <strong>{{ formatName(name) }}:</strong>
                                            <span>{{ value.toString().toUpperCase() }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </template>
                        <template slot="actions" slot-scope="props">
                            <i class="edit-icon las la-edit" @click="triggerChangeModal(props.row)"></i>

                            <i class="delete-icon las la-minus-circle" @click="triggerDeleteModal(props.row._id, props.row.name)"></i>
                        </template>
                    </v-client-table>
                </Widget>
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
import api from '@/mixins/api'
import ConfirmModal from '@/components/Modals/Confirm'
export default {
    name: 'Permissions',
    mixins: [api],
    components: {
        ConfirmModal,
    },
    data() {
        return {
            confirmState: false,
            modalData: {},
            confirmMessage: '',
            permissionModal: false,

            permissionForm: this.setDefaultForm(),

            permissions: [],
            tableCoumns: ['name', 'createdAt', 'actions'],
            tableOptions: {
                uniqueKey: '_id',
                sortable: ['name', 'createdAt'],
                headings: {
                    createdAt: 'Created At',
                },
                texts: {
                    filter: 'Search:',
                },
                templates: {
                    createdAt(h, row) {
                        return new Date(row.createdAt).toLocaleString()
                    },
                },
            },
        }
    },
    async created() {
        await this.getPermissions()
    },
    methods: {
        formatName(name) {
            return name
                .split('_')
                .join(' ')
                .toUpperCase()
        },
        setDefaultForm() {
            return {
                name: '',
                description: '',
                permissions: {
                    invite_peers: false,
                    qa: false,
                    stage: false,
                    categories: false,
                    positions: false,
                },
            }
        },
        async getPermissions() {
            const options = {}
            const result = await this.getData(this.ENDPOINTS.getPermissions, options)
            if (result) {
                this.permissions = result
            }
        },
        triggerDeleteModal(id, name) {
            this.modalData.id = id
            this.confirmMessage = `Are your sure that you want to delete: ${name}`
            this.confirmState = true
        },
        triggerChangeModal(permission) {
            this.modalData = permission
            this.permissionModal = true
        },
        cancelDelete() {
            this.confirmState = false
            this.modalData = {}
            this.confirmMessage = ``
        },
        async deletePermission(data) {
            const options = {
                params: [data.id],
            }
            const result = await this.getData(this.ENDPOINTS.deletePermission, options)
            if (result) {
                await this.getPermissions()
                this.$toasted.success('Permission Deleted')
            }
        },
        async createPermission() {
            const options = {
                data: this.permissionForm,
            }
            const result = await this.getData(this.ENDPOINTS.createPermission, options)
            if (result) {
                await this.getPermissions()
                this.permissionForm = this.setDefaultForm()
                this.$toasted.success('Category created')
            }
        },
    },
}
</script>

<style src="./Permissions.scss" lang="scss" scoped />
