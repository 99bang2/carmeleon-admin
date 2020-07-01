<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="uk-grid" data-uk-grid>
				<div class="uk-width-2-3@l">
					<PointProductList />
				</div>
				<div class="uk-width-1-3@l">
					<PointProductForm />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import PointProductList from "@/components/pointProduct/PointProductList"
	import PointProductForm from "@/components/pointProduct/PointProductForm"
	export default {
		middleware: ['auth'],
		components: {
			PointProductList,
			PointProductForm
		}
	}
</script>

<style scoped>

</style>
