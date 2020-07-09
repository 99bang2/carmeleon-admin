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
								<draggable v-model="sendData.stepImages">
									<transition-group>
										<div v-for="(stepImage, index) in sendData.stepImages" :key="index" class="uk-card uk-width-1-6" style="min-height: 600px">
											<div class="uk-text-center uk-card-header sc-theme-bg-dark sc-light">
												<h3 class="uk-card-title">
													step{{index + 1}}
												</h3>
											</div>
											<div class="uk-card-body uk-margin" uk-margin>
												<div uk-form-custom="target: true">
													<input type="file" accept="image/*" ref="step5Image" @change="onChangeStepImageFile($event, index)">
													<input class="uk-input uk-form-width-medium" type="text" placeholder="Select file" disabled>
													<div class="uk-width-1-1 image-preview" v-if="stepImage">
														<img class="preview" :src="stepImage"/>
													</div>
												</div>
											</div>
										</div>
									</transition-group>
								</draggable>
							</form>
							<div class="uk-margin-top uk-text-center">
								<button class="sc-button sc-button-primary" @click.prevent="submit">
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
	import draggable from 'vuedraggable'

	export default {
		components: {ScCard,
			draggable},
		data() {
			return {
				sendData: {
					stepImages: new Array(5)
				},
				stepImageFiles: new Array(5)
			}
		},
		async created() {
			// 	let res= await this.$axios.$get(this.config.apiUrl + '/api/tutorials')
			//vm.settingForm()
			console.log(this.sendData.stepImages)

		},
		async beforeMount() {
		},
		methods: {
			onChangeStepImageFile(event, index) {
				let input = event.target;
				if (input.files && input.files[0]) {
					let reader = new FileReader();
					reader.onload = e => {
						this.$set(this.sendData.stepImages, index, e.target.result)
					}
					reader.readAsDataURL(input.files[0]);
				}
				this.stepImageFiles[index] = input.files[0]
			},

			submit() {
				console.log(this.sendData.stepImages)
			}
		}
	}
</script>

<style scoped>
</style>
