<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="uk-grid" data-uk-grid>
				<div class="uk-width-2-3@l">
					<ExampleList />
				</div>
				<div class="uk-width-1-3@l">
					<ExampleForm />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ExampleList from "@/components/example/ExampleList"
import ExampleForm from "@/components/example/ExampleForm"
export default {
	//middleware: ['auth'],
	components: {
		ExampleList,
		ExampleForm,
	}
}
</script>
