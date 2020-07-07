<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed" style="min-height: 745px">
				<ScCardHeader separator>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								<i class="mdi"
								   :class="{ 'mdi-file-document' : sendData.uid, 'mdi-file-plus': !sendData.uid }"/>
								리뷰템플릿{{ sendData.uid ? '상세': '생성' }}
							</ScCardTitle>
						</div>
						<ScCardActions>
							<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close"
							   @click.prevent="closeForm"/>
						</ScCardActions>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<div class="uk-accordion-content">
						<form class="uk-grid-small uk-grid" data-uk-grid>
							<div class="uk-width-1-1@s">
								<Select2
									v-model="sendData.reviewType"
									:options="reviewTypeOpts"
									:settings="{ 'width': '100%', 'placeholder': '리뷰유형선택' }"
									:error-state="$v.sendData.reviewType.$error"
								/>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.reviewType.required">
										리뷰유형을 선택하세요.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-1@s">
								<ScTextarea v-model="sendData.review" :error-state="$v.sendData.review.$error"
										 :validator="$v.sendData.review"
											:rows="10"
											:autosize="true"
											mode="outline">
									<label>
										리뷰템플릿입력
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: file-text"/>
								</ScTextarea>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.review.required">
										리뷰템플릿을 입력하세요.
									</li>
									<li v-if="!$v.sendData.review.minMaxCheck">
										5~50자로 작성해주세요.
									</li>
								</ul>
							</div>
						</form>
					</div>
					<div class="uk-margin-top uk-text-center">
						<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'"
								@click="submitForm">
							{{ sendData.uid ? '수정': '생성' }}
						</button>
						<button v-if="sendData.uid" class="sc-button sc-button-primary"
								:disabled="submitStatus === 'PENDING'"
								@click="deleteForm">
							삭제
						</button>
					</div>
				</ScCardBody>
			</ScCard>
		</Transition>
	</div>
</template>

<script>
	import Select2 from "@/components/Select2";
	// import ScInput from "@/components/Input";
	import {required} from 'vuelidate/lib/validators'
	import customValidators from '@/plugins/vuelidateValidators'
	import {validationMixin} from 'vuelidate'
	import ScTextarea from "@/components/Textarea";
	export default {
		components: {ScTextarea,  Select2},
		mixins: [
			validationMixin,
		],
		props: {
			mode: {
				type: String,
				default: 'list'
			}
		},
		data() {
			return {
				cardFormClosed: true,
				submitStatus: null,
				reviewTypeOpts: [
					{id: 0, text: '아주좋은리뷰'},
					{id: 1, text: '좋은리뷰'},
					{id: 2, text: '나쁜리뷰'},
					{id: 3, text: '아주나쁜리뷰'},
				],
				sendData: {},
				defaultForm: {
					uid: null,
					reviewType: '',
					review: '',
				},
			}
		},
		validations: {
			sendData: {
				reviewType: {
					required
				},
				review:{
					required,
					minMaxCheck: customValidators.minMaxCheck(5,50)
				}
			}
		},
		methods: {
			settingForm(props) {
				this.$v.$reset()
				if (props) {
					this.sendData = JSON.parse(JSON.stringify(props.data))
				} else {
					this.sendData = JSON.parse(JSON.stringify(this.defaultForm))
				}
				this.cardFormClosed = true
				setTimeout(() => {
					this.cardFormClosed = false
				}, 100)
			},
			closeForm() {
				this.cardFormClosed = true
				this.$nuxt.$emit('reset-reviewTemplate-list')
			},
			deleteForm() {
				this.$axios.$delete(this.config.apiUrl + '/api/reviewTemplates/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('삭제하였습니다.')
					this.$nuxt.$emit('fetch-reviewTemplate-list', res.data.uid)
				}).finally(() => {
					this.deleteStatus = 'OK'
					this.cardFormClosed = true
				})
			},
			submitForm(e) {
				e.preventDefault()
				this.$v.$touch()

				if (this.$v.$invalid) {
					this.submitStatus = 'ERROR'
				} else {
					this.submitStatus = 'PENDING'
					if (this.sendData.uid) {
						this.putForm()
					} else {
						this.postForm()
					}
				}
			},
			postForm() {
				this.$axios.$post(this.config.apiUrl + '/api/reviewTemplates', this.sendData).then(async res => {
					this.callNotification('계정을 생성하였습니다.')
					this.$nuxt.$emit('fetch-reviewTemplate-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			putForm() {
				this.$axios.$put(this.config.apiUrl + '/api/reviewTemplates/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('수정하였습니다.')
					this.$nuxt.$emit('fetch-reviewTemplate-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-reviewTemplate-form', (data) => {
				vm.settingForm(data)
			})
			this.$nuxt.$on('close-reviewTemplate-form', () => {
				vm.closeForm()
			})
		},
		async beforeMount() {
			this.sendData = this.defaultForm
		},
		beforeDestroy() {
			this.$nuxt.$off('open-reviewTemplate-form')
			this.$nuxt.$off('close-reviewTemplate-form')
		}
	}
</script>

<style scoped>

</style>
