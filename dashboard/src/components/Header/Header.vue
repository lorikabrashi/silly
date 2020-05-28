<template>
	<b-navbar class="header d-print-none app-header">
		<b-nav>
			<b-nav-item>
				<a class="d-md-down-none px-2" href="#" @click="toggleSidebarMethod" id="barsTooltip">
					<i class="la la-bars la-lg" />
				</a>
				<a class="fs-lg d-lg-none" href="#" @click="switchSidebarMethod">
					<i class="la la-bars la-lg" />
				</a>
			</b-nav-item>
		</b-nav>
		<a class="navbarBrand d-md-none">
			<h5 class="mobile-logo">
				<i class="fa fa-circle text-primary"></i>
				Silly
				<i class="fa fa-circle text-danger"></i>
			</h5>
		</a>
		<b-nav class="ml-auto">
			<b-nav-item-dropdown class="settingsDropdown d-sm-down-none" right>
				<template slot="button-content">
					<span class="small">{{ username }}</span>
				</template>
				<b-dropdown-item>
					<router-link :to="accountUrl"> <i class="la la-user" /> My Account </router-link>
				</b-dropdown-item>
				<b-dropdown-divider />
				<b-dropdown-item-button @click="logout"> <i class="la la-sign-out" /> Log Out </b-dropdown-item-button>
			</b-nav-item-dropdown>
		</b-nav>
	</b-navbar>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
	name: "Header",
	computed: {
		...mapState("layout", ["sidebarClose", "sidebarStatic"]),
		...mapState("auth", ["user"]),
	},
	data() {
		return {
			username: "",
			accountUrl: "",
		};
	},
	created() {
		(this.username = this.user.username), (this.accountUrl = `/user?id=${this.user._id}`);
	},
	methods: {
		...mapActions("layout", ["toggleSidebar", "switchSidebar", "changeSidebarActive"]),
		...mapActions("auth", ["AUTH_LOGOUT"]),

		switchSidebarMethod() {
			if (!this.sidebarClose) {
				this.switchSidebar(true);
				this.changeSidebarActive(null);
			} else {
				this.switchSidebar(false);
				const paths = this.$route.fullPath.split("/");
				paths.pop();
				this.changeSidebarActive(paths.join("/"));
			}
		},
		toggleSidebarMethod() {
			if (this.sidebarStatic) {
				this.toggleSidebar();
				this.changeSidebarActive(null);
			} else {
				this.toggleSidebar();
				const paths = this.$route.fullPath.split("/");
				paths.pop();
				this.changeSidebarActive(paths.join("/"));
			}
		},
		async logout() {
			const response = await this.AUTH_LOGOUT();
			if (typeof response !== "boolean") {
				this.$toasted.error(response.message);
			}
		},
	},
};
</script>

<style src="./Header.scss" lang="scss"></style>
