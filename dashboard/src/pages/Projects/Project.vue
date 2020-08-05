<template>
    <ErrorPage v-if="!projectId || !project" />
    <div class="project-page" v-else>
        <b-tabs>
            <b-tab title="Details">
                <b-table stacked :items="details"></b-table>
            </b-tab>
            <b-tab title="Categories">
                <ProjectCategories :projectId="projectId" :categories="categories" :projectCategories="projectCategories" @removeCategories="removeCategories" @addCategories="addCategories" />
            </b-tab>

            <b-tab title="Peers">
                <ProjectPeers :projectPeers="peers" />
            </b-tab>

            <b-tab title="Permissions" active>
                <Permissions :projectPermissions="projectPermissions" :permissions="permissions"  @removePermissions="removePermissions" />
            </b-tab>

            <b-tab title="Positions"> </b-tab>

            <b-tab title="Forum Actions">
                <!-- TODO RAPORTS -->
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
import ErrorPage from '@/pages/Error/Error'
import api from '@/mixins/api'
import ProjectCategories from '@/components/Project/ProjectCategories'
import ProjectPeers from '@/components/Project/ProjectPeers'
import Permissions from '@/components/Project/Permissions'

export default {
    name: 'Project',
    mixins: [api],
    components: {
        ErrorPage,
        ProjectCategories,
        ProjectPeers,
        Permissions,
    },
    data() {
        return {
            project: {}, //debugging
            details: [],
            projectCategories: [],
            categories: [],
			peers: [],
            projectPermissions: [],
            permissions: []
        }
    },
    props: ['projectId'],
    async created() {
        this.setupData()
    },
    methods: {
        async setupData() {
            await this.getProjectData()
            await this.getCategories()
            await this.getPermissions()
        },
        async removePermissions(options, message){
            const result = await this.getData(this.ENDPOINTS.removePermission, options)
            if (result) {
                this.$toasted.success(message)
                this.setupData()
            }
        },
        async addPermissions(options, message){
            const result = await this.getData(this.ENDPOINTS.addPermission, options)
            if (result) {
                this.$toasted.success(message)
                this.setupData()
            }
        },
        async getPermissions(){
            const options = {}
            const result = await this.getData(this.ENDPOINTS.getPermissions, options)
            if (result) {
                this.permissions = result
            }
        },
        async removeCategories(options, message) {
            const result = await this.getData(this.ENDPOINTS.removeCategory, options)
            if (result) {
                this.$toasted.success(message)
                this.setupData()
            }
        },
        async addCategories(options, message) {
            const result = await this.getData(this.ENDPOINTS.addCategory, options)
            if (result) {
                this.$toasted.success(message)
                this.setupData()
            }
        },
        async getCategories() {
            const options = {
                params: [true],
                query: {
                    fields: '_id,name,description',
                },
            }
            const result = await this.getData(this.ENDPOINTS.getCategories, options)
            if (result) {
                result.forEach((elem) => {
                    if (this.project.categories.some((e) => e._id === elem._id)) {
                        elem.onProject = true
                        elem.disabled = true
                        return
                    }
                    elem.onProject = false
                    elem.disabled = false
                })
                this.categories = result
            }
        },
        async getProjectData() {
            const options = {
                params: [this.projectId],
            }
            const project = await this.getData(this.ENDPOINTS.getProjects, options)

            this.setDetails(project)
            this.setProjectCategories(project)
            this.setPeers(project)
            this.setPermissions(project)
            this.setPositions()

            /* TODO */
            this.setForumActions()

            this.project = project
        },
        setDetails(project) {
            this.details = [
                {
                    project_Id: project._id,
                    stage: project.stage,
                    name: project.name,
                    descriptions: project.descriptions,
                    created_at: new Date(project.createdAt).toLocaleString(),
                    updated_at: new Date(project.updatedAt).toLocaleString(),
                },
            ]
        },
        setProjectCategories(project) {
            const categories = []
            project.categories.forEach((elem) => {
                categories.push({
                    _id: elem._id,
                    selected: false,
                    name: elem.name,
                    description: elem.description,
                })
            })
            this.projectCategories = categories
        },

        setPeers(project) {
            this.peers = project.peers
        },
        setPermissions(project) {
            this.projectPermissions = project.permissions
        },
        setPositions() {},
        /* TODO */
        setForumActions() {},
    },
}
</script>
<style src="./Projects.scss" lang="scss" />
