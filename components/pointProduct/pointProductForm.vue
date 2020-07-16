<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed" style="min-height: 745px">
				<ScCardHeader separator>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								<i class="mdi" :class="{ 'mdi-coin' : sendData.uid, 'mdi-shape-circle-plus': !sendData.uid }"/>
								포인트상품{{ sendData.uid ? '상세': '생성' }}
							</ScCardTitle>
						</div>
						<ScCardActions>
							<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close" @click.prevent="closeForm"/>
						</ScCardActions>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<div class="uk-accordion-content">
						<form class="uk-grid-small uk-grid" data-uk-grid>
							<div class="uk-width-1-1@s">
								<ScInput v-model="sendData.point" :error-state="$v.sendData.point.$error" :validator="$v.sendData.point">
									<label>
										포인트입력
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: database"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.point.required">
										포인트를 입력하세요.
									</li>
									<li v-if="!$v.sendData.point.integer">
										올바른 형식이 아닙니다.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-1@s">
								<ScInput v-model="sendData.price" :error-state="$v.sendData.price.$error" :validator="$v.sendData.price">
									<label>
										가격입력
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.price.required">
										가격을 입력하세요.
									</li>
									<li v-if="!$v.sendData.price.integer">
										올바른 형식이 아닙니다.
									</li>
								</ul>
							</div>
						</form>
					</div>
					<div class="uk-margin-top uk-text-center">
						<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" @click="submitForm">
							{{ sendData.uid ? '수정': '생성' }}
						</button>
						<button v-if="sendData.uid" class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" @click="deleteForm">
							삭제
						</button>
					</div>
				</ScCardBody>
			</ScCard>
		</Transition>
	</div>
</template>

<script>
	import {required, integer} from 'vuelidate/lib/validators'
	import {validationMixin} from 'vuelidate'
	import ScInput from "@/components/Input";
	export default {
		components: {ScInput},
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
				sendData: {},
				defaultForm: {
					uid: null,
					point: null,
					price: null,
					addPoint:null,
					addPointPercent: null,
				},
			}
		},
		validations: {
			sendData: {
				point: {
					required,
					integer
				},
				price:{
					required,
					integer
				}
			}
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-pointProduct-form', (data) => {
				vm.settingForm(data)
			})
			this.$nuxt.$on('close-pointProduct-form', () => {
				vm.closeForm()
			})
		},
		async beforeMount() {
			this.sendData = this.defaultForm
		},
		beforeDestroy() {
			this.$nuxt.$off('open-pointProduct-form')
			this.$nuxt.$off('close-pointProduct-form')
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
				this.$nuxt.$emit('reset-pointProduct-list')
			},
			deleteForm() {
				this.$axios.$delete(this.config.apiUrl + '/pointProducts/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('삭제하였습니다.')
					this.$nuxt.$emit('fetch-pointProduct-list', res.data.uid)
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
				this.$axios.$post(this.config.apiUrl + '/pointProducts', this.sendData).then(async res => {
					this.callNotification('상품을 생성하였습니다.')
					this.$nuxt.$emit('fetch-pointProduct-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			putForm() {
				this.$axios.$put(this.config.apiUrl + '/pointProducts/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('수정하였습니다.')
					this.$nuxt.$emit('fetch-pointProduct-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
		}
	}
</script>

<style scoped>

</style>
