<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="uk-grid" data-uk-grid>
				<div class="uk-width-1-1@l">
					<ScCard>
						<ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
							<div class="uk-flex-1">
								<ScCardTitle>
									<slot><i class="mdi mdi-book-open-page-variant"/> 튜토리얼관리</slot>
								</ScCardTitle>
							</div>
						</ScCardHeader>
						<ScCardBody style="min-height: 745px">
							<form class="uk-flex uk-flex-center uk-flex-between">
								<div class="uk-card uk-width-1-6" style="min-height: 600px">
									<div class="uk-text-center uk-card-header sc-theme-bg-dark sc-light">
										<h3 class="uk-card-title">
											step1
										</h3>
									</div>
									<div class="uk-card-body uk-margin" uk-margin>
										<div uk-form-custom="target: true">
											<input type="file">
											<input class="uk-input uk-background-muted uk-padding uk-panel" type="text"
												   placeholder="Select file" disabled>
										</div>
										<img data-src="" width="" height="" alt="" uk-img>
									</div>
								</div>
								<div class="uk-card uk-width-1-6" style="min-height: 600px">
									<div class="uk-text-center uk-card-header sc-theme-bg-dark sc-light">
										<h3 class="uk-card-title">
											step2
										</h3>
									</div>
									<div class="uk-card-body uk-margin" uk-margin>
										<div uk-form-custom="target: true">
											<input type="file">
											<input class="uk-input uk-form-width-medium" type="text"
												   placeholder="Select file" disabled>
										</div>
									</div>
								</div>
								<div class="uk-card uk-width-1-6" style="min-height: 600px">
									<div class="uk-text-center uk-card-header sc-theme-bg-dark sc-light">
										<h3 class="uk-card-title">
											step3
										</h3>
									</div>
									<div class="uk-card-body uk-margin" uk-margin>
										<div uk-form-custom="target: true">
											<input type="file">
											<input class="uk-input uk-form-width-medium" type="text"
												   placeholder="Select file" disabled>
										</div>
									</div>
								</div>
								<div class="uk-card uk-width-1-6" style="min-height: 600px">
									<div class="uk-text-center uk-card-header sc-theme-bg-dark sc-light">
										<h3 class="uk-card-title">
											step4
										</h3>
									</div>
									<div class="uk-card-body uk-margin" uk-margin>
										<div uk-form-custom="target: true">
											<input type="file">
											<input class="uk-input uk-form-width-medium" type="text"
												   placeholder="Select file" disabled>
										</div>
									</div>
								</div>
								<div class="uk-card uk-width-1-6" style="min-height: 600px">
									<div class="uk-text-center uk-card-header sc-theme-bg-dark sc-light">
										<h3 class="uk-card-title">
										step5
										</h3>
									</div>
									<div class="uk-card-body uk-margin" uk-margin>
										<div uk-form-custom="target: true">
											<input type="file">
											<input class="uk-input uk-form-width-medium" type="text"
												   placeholder="Select file" disabled>
										</div>
									</div>
								</div>
							</form>
							<div class="uk-margin-top uk-text-center">
								<button class="sc-button sc-button-primary">
									등록
								</button>
							</div>
						</ScCardBody>
					</ScCard>
				</div>
			</div>
		</div>
	</div>
</template>
<script>

	import ScCard from "@/components/card/components/Card";

	export default {
		components: {ScCard}
	}
</script>

<style scoped>
</style>
