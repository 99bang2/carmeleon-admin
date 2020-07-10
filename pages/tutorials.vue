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
							<form>
								<draggable tag="ul" v-model="sendData.stepImages" v-bind="dragOptions"
										   @start="drag = true" @end="drag = false">
									<transition-group class="uk-flex uk-flex-center uk-flex-between" type="transition"
													  :name="!drag ? 'flip-list' : null">
										<li v-for="(stepImage, index) in sendData.stepImages" :key="index"
											class="uk-card uk-width-1-6" style="min-height: 550px">
											<div class="uk-text-center uk-card-header sc-theme-bg-dark sc-light">
												<h3 class="uk-card-title">
													step{{index + 1}}
												</h3>
											</div>
											<div class="uk-card-body uk-margin" style="min-height: 350px" uk-margin>
												<div uk-form-custom="target: true">
													<input type="file" accept="image/*"
														   @change="onChangeStepImageFile($event, index)">
													<button class="uk-button uk-button-default uk-form-width-medium">
														Select File
													</button>
													<div class="uk-width-1-1 image-preview" v-if="stepImage">
														<img class="preview" :src="stepImage"/>
													</div>
												</div>
											</div>
											<button @click.prevent="refresh(index)" class="uk-button uk-button-danger uk-width-1-2 uk-button-small uk-align-center">
												삭제
											</button>
										</li>
									</transition-group>
								</draggable>
							</form>
							<div class="uk-margin-top uk-text-center">
								<button v-if="flag" class="sc-button sc-button-primary"
										@click.prevent="postForm">
									등록
								</button>
								<button v-else class="sc-button sc-button-primary" @click.prevent="putForm">
									수정
								</button>
								<button class="sc-button sc-button-secondary" @click.prevent="reset">
									초기화
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
		components: {
			ScCard,
			draggable
		},
		data() {
			return {
				sendData: {
					stepImages: new Array(5)
				},
				drag: false,
				flag: false
			}
		},
		async created() {
			let vm = this
			vm.fetchData()
		},
		methods: {
			async fetchData(input) {
				this.flag=false
				let res = await this.$axios.$get(this.config.apiUrl + '/api/tutorials')
				if (res.data) {
					this.sendData.stepImages = res.data
				}
				for (let stepImage of this.sendData.stepImages) {
					if (stepImage === null || typeof stepImage == 'undefined') {
						this.flag = true
					}
				}
			},
			onChangeStepImageFile(event, index) {
				let formData = new FormData()
				let input = event.target;
				if (input.files && input.files[0]) {
					let reader = new FileReader();
					reader.onload = e => {
						this.$set(this.sendData.stepImages, index, e.target.result)
					}
					reader.readAsDataURL(input.files[0]);
					formData.append('file', input.files[0])
					formData.append('dir', 'tutorial')
					this.$axios.$post(this.config.apiUrl + '/api/uploads/', formData).then(response => {
						this.sendData.stepImages[index] = response.data;
					})
				}
			},
			async postForm() {
				let flag = false
				for (let stepImage of this.sendData.stepImages) {
					if (stepImage === null  || typeof stepImage == 'undefined') {
						flag = true
					}
				}
				if (!flag) {
					await this.$axios.$post(this.config.apiUrl + '/api/tutorials', this.sendData).then(response => {
						this.callNotification('튜토리얼을 등록했습니다.')
						this.fetchData("eeeee")
					})
				} else {
					this.callNotification('값이 비어있습니다')
				}
			},
			async putForm() {
				let flag = false
				for (let stepImage of this.sendData.stepImages) {
					if (stepImage === null || typeof stepImage == 'undefined') {
						flag = true
					}
				}
				if (!flag) {
					await this.$axios.$post(this.config.apiUrl + '/api/tutorials', this.sendData).then(response => {
						this.callNotification('튜토리얼을 수정했습니다.')
						this.fetchData()
					})
				} else {
					this.callNotification('값이 비어있습니다')
				}
			},
			async reset() {
				this.sendData.stepImages = new Array(5)
				await this.$axios.$post(this.config.apiUrl + '/api/tutorials', this.sendData).then(response => {
					this.callNotification('튜토리얼을 초기화했습니다.')
					this.fetchData()
				})
			},
			async refresh(index){
				this.sendData.stepImages[index] = undefined
				this.$forceUpdate()
			}
		},
		computed: {
			dragOptions() {
				return {
					animation: 200,
					group: "description",
					disabled: false,
					ghostClass: "ghost"
				};
			}
		}
	}
</script>

<style scoped>
	ul {
		list-style: none;
		padding-left: 0px;
	}

	.image-preview {
		text-align: center;
		vertical-align: middle;
		height: auto;
		padding: 20px;
	}

	img.preview {
		height: auto;
		width: auto;
		max-height: 150px;
		max-width: 150px;
		background-color: white;
		border: 1px solid #DDD;
		padding: 2px;
	}
</style>
