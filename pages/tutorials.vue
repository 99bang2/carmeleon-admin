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
						<ScCardBody>
							<ScTransition
								group
								stagger
								:speed="20"
								origin="50% 50%"
								class="uk-child-width-1-5@xl uk-child-width-1-3@l uk-child-width-1-2@s uk-grid uk-grid-match uk-sortable"
								data-uk-grid
								data-uk-sortable
							>
								<div v-show="showWidgets" key="widgetA">
									<ScCard>
										<div class="uk-text-bold uk-text-primary md-bg-green-100 uk-flex uk-flex-center">
											1st STEP
										</div>
										<div>
											<ScCardBody>

											</ScCardBody>
										</div>
									</ScCard>
								</div>
								<div v-show="showWidgets" key="widgetB">
									<ScCard>
										<div class="uk-text-bold uk-text-primary md-bg-green-100 uk-flex uk-flex-center">
											2nd STEP
										</div>
										<div>
											<ScCardBody>

											</ScCardBody>
										</div>
									</ScCard>
								</div>
								<div v-show="showWidgets" key="widgetC">
									<ScCard>
										<div class="uk-text-bold uk-text-primary md-bg-green-100 uk-flex uk-flex-center">
											3rd STEP
										</div>
										<div>
											<ScCardBody>

											</ScCardBody>
										</div>
									</ScCard>
								</div>
								<div v-show="showWidgets" key="widgetD">
									<ScCard>
										<div class="uk-text-bold uk-text-primary md-bg-green-100 uk-flex uk-flex-center">
											4th STEP
										</div>
										<div>
											<ScCardBody>

											</ScCardBody>
										</div>
									</ScCard>
								</div>
								<div v-show="showWidgets" key="widgetE">
									<ScCard>
										<div class="uk-text-bold uk-text-primary md-bg-green-100 uk-flex uk-flex-center">
											5th STEP
										</div>
										<div>
											<ScCardBody>

											</ScCardBody>
										</div>
									</ScCard>
								</div>
							</ScTransition>
						</ScCardBody>
					</ScCard>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	export default {
		components: {
		},
		data: () => ({

			ramUsage: 82,
			showWidgets:false
		}),
		mounted () {
			this.$nextTick(() => {
				this.showWidgets = true;
			})
		},
		methods:{

		}
	}
</script>

<style scoped>

</style>
