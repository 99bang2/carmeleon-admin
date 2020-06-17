<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="uk-grid" data-uk-grid>
				<div class="uk-width-2-3@l">
					<AccountList/>
				</div>
				<div class="uk-width-1-3@l">
					<AccountForm/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import AccountList from "@/components/account/AccountList"
	import AccountForm from "@/components/account/AccountForm"

	export default {
		//middleware: ['auth'],
		components: {
			AccountList,
			AccountForm,
		}
	}
</script>
