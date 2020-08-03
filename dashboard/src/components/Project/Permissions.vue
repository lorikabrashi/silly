<template>
    <div class="Silly__project-permissions">
        <pre class="code_snippet">
            {{ permissionsTable.data }}
        </pre>
        <div class="text-md-right mt-sm silly__add_remove-buttons">
            <b-button variant="success" @click="addPermissions">Add new</b-button>
            <b-button variant="danger" @click="removePermissions">Remove</b-button>
        </div>
    </div>
</template>
<script>
export default {
    name: '',
    components: {},
    data() {
        return {
            permissionsTable: {
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
        }
    },
    props: {
        projectPermissions: Array,
    },
    watch: {
        projectPermissions: function(newVal) {
			this.permissionsTable.data = newVal;
		},
    },
    methods: {
        addPermissions() {},
        removePermissions() {},
    },
}
</script>
<style lang="scss" scoped></style>
