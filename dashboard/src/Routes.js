import Vue from "vue";
import store from "./store";
import Router from "vue-router";

import Layout from "@/components/Layout/Layout.vue"

import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";

import ErrorPage from "@/pages/Error/Error";

// Main
import DashboardPage from "@/pages/Dashboard/Dashboard";

//Users
import UsersPage from "@/pages/Users/Users";
import UserPage from "@/pages/Users/User";

//Projects
import ProjectsPage from "@/pages/Projects/Projects";
import ProjectPage from "@/pages/Projects/Project";

//Categories
import CategoriesPage from "@/pages/Categories/Categories"

Vue.use(Router);

const router = new Router({
	mode: "history",
	routes: [
		{
			path: "/register",
			name: "Register",
			component: Register,
			meta: {
				requiresAuth: false
			}
		},
		{
			path: "/login",
			name: "Login",
			component: Login,
			meta: {
				requiresAuth: false
			}
		},
		{
			path: "/forgot-password",
			name: "ForgotPassword",
			component: ForgotPassword,
			meta: {
				requiresAuth: false
			}
		},
		{
			path: "/reset-password",
			name: "ResetPassword",
			props: route => ({ code: route.query.code }),
			component: ResetPassword,
			meta: {
				requiresAuth: false
			}
		},
		{
			path: "/dashboard",
			name: "Layout",
			component: Layout,
			meta: {
				requiresAuth: true
			},
			children: [
				{
					path: "",
					name: "DashboardPage",
					component: DashboardPage
				}
			]
		},
		{
			path: "/user",
			name: "Layout",
			component: Layout,
			meta: {
				requiresAuth: true
			},
			children: [
				{
					path: "",
					name: "UserPage",
					props: route => ({ userId: route.query.id }),
					component: UserPage
				}
			]
		},
		{
			path: "/users",
			name: "Layout",
			component: Layout,
			meta: {
				requiresAuth: true
			},
			children: [
				{
					path: "",
					name: "UsersPage",
					component: UsersPage
				}
			]
		},
		{
			path: "/project",
			name: "Layout",
			component: Layout,
			meta: {
				requiresAuth: true
			},
			children: [
				{
					path: "",
					name: "ProjectPage",
					props: route => ({ projectId: route.query.id }),
					component: ProjectPage
				}
			]
		},
		{
			path: "/projects",
			name: "Layout",
			component: Layout,
			meta: {
				requiresAuth: true
			},
			children: [
				{
					path: "",
					name: "ProjectsPage",
					component: ProjectsPage
				}
			]
		},
		{
			path: "*",
			component: ErrorPage
		},
		{
			path: "/categories",
			name: "Layout",
			component: Layout,
			meta: {
				requiresAuth: true
			},
			children: [
				{
					path: "",
					name: "CategoriesPage",
					component: CategoriesPage
				}
			]
		},
		{
			path: "*",
			component: ErrorPage
		}
	]
});

router.beforeEach((to, from, next) => {
	const user_session = store.state.auth.accessToken;
	let path = null;

	if (to.path === "/") {
		if (!user_session) path = "/login";
		else path = "/dashboard";
	} else {
		to.matched.forEach(elem => {
			if (typeof elem.meta.requiresAuth !== "boolean") return;

			if (elem.meta.requiresAuth && !user_session) {
				path = "/login";
				return;
			}
			if (!elem.meta.requiresAuth && user_session) {
				path = "/dashboard";
				return;
			}
		});
	}
	if (!path) next();
	next({
		path,
		params: { nextUrl: to.fullPath }
	});
});

export default router;
