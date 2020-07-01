<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="uk-grid" data-uk-grid>
				<div class="uk-width-2-3@l">
					<ReviewTemplateList />
				</div>
				<div class="uk-width-1-3@l">
					<ReviewTemplateForm />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import ReviewTemplateList from "@/components/reviewTemplate/ReviewTemplateList"
	import ReviewTemplateForm from "@/components/reviewTemplate/ReviewTemplateForm"
	export default {
		middleware: ['auth'],
		components: {
			ReviewTemplateList,
			ReviewTemplateForm
		}
	}
</script>

<style scoped>

</style>
