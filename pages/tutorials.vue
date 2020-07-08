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
											<input type="file" accept="image/*" ref="step1Image" @change="onChangeStep1ImageFile">
											<input class="uk-input uk-background-muted uk-padding uk-panel" type="text"
												   placeholder="Select file" disabled>
										</div>
										<div class="uk-width-1-1 image-preview" v-if="sendData.step1Image">
											<img class="preview" :src="step1Image"/>
										</div>
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
											<input type="file" accept="image/*" ref="step2Image" @change="onChangeStep2ImageFile">
											<input class="uk-input uk-form-width-medium" type="text"
												   placeholder="Select file" disabled>
										</div>
										<div class="uk-width-1-1 image-preview" v-if="sendData.step2Image">
											<img class="preview" :src="step2Image"/>
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
											<input type="file" accept="image/*" ref="step3Image" @change="onChangeStep3ImageFile">
											<input class="uk-input uk-form-width-medium" type="text"
												   placeholder="Select file" disabled>
										</div>
										<div class="uk-width-1-1 image-preview" v-if="sendData.step3Image">
											<img class="preview" :src="step3Image"/>
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
											<input type="file" accept="image/*" ref="step4Image" @change="onChangeStep4ImageFile">
											<input class="uk-input uk-form-width-medium" type="text"
												   placeholder="Select file" disabled>
										</div>
										<div class="uk-width-1-1 image-preview" v-if="sendData.step4Image">
											<img class="preview" :src="step4Image"/>
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
											<input type="file" accept="image/*" ref="step5Image" @change="onChangeStep5ImageFile">
											<input class="uk-input uk-form-width-medium" type="text"
												   placeholder="Select file" disabled>
										</div>
										<div class="uk-width-1-1 image-preview" v-if="sendData.step5Image">
											<img class="preview" :src="step5Image"/>
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
		components: {ScCard},
		data(){
			return{
				sendData:{},
				defaultForm:{
					step1Image:'',
					step2Image:'',
					step3Image:'',
					step4Image:'',
					step5Image:''
				}
			}
		},
		async created() {
			let vm = this
		// 	let res= await this.$axios.$get(this.config.apiUrl + '/api/tutorials')
			vm.settingForm()
		},
		methods:{
			settingForm(props){
				this.step1Image =''
				this.step2Image =''
				this.step3Image =''
				this.step4Image =''
				this.step5Image =''
				if(props){
					this.sendData = JSON.parse(JSON.stringify(props))
				}else {
					this.sendData = JSON.parse(JSON.stringify(this.defaultForm))
				}
			},
			onChangeStep1ImageFile(event) {
				var input = event.target;
				if(input.files && input.files[0]){
					var reader = new FileReader();
					reader.onload = e => {
						this.step1Image = e.target.result;
					}
					reader.readAsDataURL(input.files[0]);
				}
				this.sendData.step1Image = this.$refs.step1Image.files[0];
			},
			onChangeStep2ImageFile(event) {
				var input = event.target;
				if(input.files && input.files[0]){
					var reader = new FileReader();
					reader.onload = e => {
						this.step2Image = e.target.result;
					}
					reader.readAsDataURL(input.files[0]);
				}
				this.sendData.step2Image = this.$refs.step2Image.files[0];
			},
			onChangeStep3ImageFile(event) {
				var input = event.target;
				if(input.files && input.files[0]){
					var reader = new FileReader();
					reader.onload = e => {
						this.step3Image = e.target.result;
					}
					reader.readAsDataURL(input.files[0]);
				}
				this.sendData.step3Image = this.$refs.step3Image.files[0];
			},
			onChangeStep4ImageFile(event) {
				var input = event.target;
				if(input.files && input.files[0]){
					var reader = new FileReader();
					reader.onload = e => {
						this.step4Image = e.target.result;
					}
					reader.readAsDataURL(input.files[0]);
				}
				this.sendData.step4Image = this.$refs.step4Image.files[0];
			},
			onChangeStep5ImageFile(event) {
				var input = event.target;
				if(input.files && input.files[0]){
					var reader = new FileReader();
					reader.onload = e => {
						this.step5Image = e.target.result;
					}
					reader.readAsDataURL(input.files[0]);
				}
				this.sendData.step5Image = this.$refs.step5Image.files[0];
			},
		}
	}
</script>

<style scoped>
</style>
