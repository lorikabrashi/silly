<template>
    <b-modal ref="addPermissionsModal" @hide="close" title="Add Role" v-model="state" body-bg-variant="white">
        <b-container>
            <b-row>
                <b-col xs="12" lg="12">
                    <Widget class="permissionsWidget">
                        <form>
                            <div class="col form-group abc-checkbox abc-checkbox-primary">
                                <div class="group" v-for="item in permssions" :key="item._id">
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
            <b-button variant="info" @click="$refs.addPermissionsModal.hide()">Cancel</b-button>
            <b-button variant="success" @click="addPermission">Add Role</b-button>
        </template>
    </b-modal>
</template>

<script>
export default {
    name: 'AddPermssions',
    data() {
        return {
            state: false,
            permssions: [],
        }
    },
    props: {
        modalState: Boolean,
        projectPermissions: Array,
        permissionsList: Array,
    },
    watch: {
        modalState: function(newVal) {
            this.state = newVal
        },
        permissionsList: function(newVal) {
            this.permssions = newVal
        },
    },
    methods: {
        close() {
            this.state = false
            this.$emit('closed')
        },
        addPermission() {
            const addedPermissions = this.permssions.filter((elem) => !elem.disabled && elem.onProject)
            this.$emit('addPermissions', addedPermissions)
            this.$refs.addPermissionsModal.hide()
        },
    },
}
</script>

<style></style>
