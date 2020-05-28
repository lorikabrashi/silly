<template>
	<div class="error-page">
		<b-container>
			<div class="errorContainer mx-auto">
				<h1 class="errorCode">404</h1>
				<p class="errorInfo">
					Opps, it seems that this page does not exist.
				</p>
			</div>
			<footer class="pageFooter">
				2020 &copy; Silly Admin Dashboard.
			</footer>
		</b-container>
	</div>
</template>

<script>
export default {
	name: "ErrorPage"
};
</script>

<style src="./Error.scss" lang="scss" scoped />
