<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed" style="min-height: 745px">
				<ScCardHeader>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								<i class="mdi"
								   :class="{ 'mdi-account-card-details-outline' : sendData.uid, 'mdi-account-plus': !sendData.uid }"/>
								계정{{ sendData.uid ? '상세': '생성' }}
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
							<div class="uk-width-1-2@s">
								<select v-model="sendData.grade" class="uk-select" :error-state="$v.sendData.grade.$error" >
									<option value="">등급 선택</option>
									<option value="0">최고 관리자</option>
									<option value="1">일반 관리자</option>
								</select>

								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.grade.required">
										등급을 선택하세요.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-1">
								<ScInput v-model="sendData.id" :error-state="$v.sendData.id.$error"
										 :validator="$v.sendData.id" :read-only="!!sendData.uid">
									<label>
										아이디
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: user"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.id.required">
										아이디를 입력하세요.
									</li>
									<li v-if="!$v.sendData.id.idFormatCheck">
										3~20자의 영문소문자, 숫자만 사용 가능합니다.
									</li>
									<li v-if="!$v.sendData.id.isUnique">
										이미 사용중인 아이디입니다.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2@s">
								<ScInput v-model="sendData.password" type="password"
										 :error-state="$v.sendData.password.$error" :validator="$v.sendData.password">
									<label>
										비밀번호
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip"
										  data-uk-icon="icon: lock"></span>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.password.required">
										비밀번호를 입력하세요.
									</li>
									<li v-if="!$v.sendData.password.passwordFormatCheck">
										4~20자의 영문 대소문자, 숫자, 특수문자만 사용 가능합니다.
									</li>
								</ul>
								<span v-if="sendData.uid" class="uk-form-help-block">* 비밀번호는 변경시에만 입력</span>
							</div>
							<div class="uk-width-1-2@s">
								<ScInput v-model="sendData.passwordConfirm" type="password"
										 :error-state="$v.sendData.passwordConfirm.$error"
										 :validator="$v.sendData.passwordConfirm">
									<label>
										비밀번호확인
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip"
										  data-uk-icon="icon: lock"></span>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.passwordConfirm.sameAsPassword">
										비밀번호가 일치하지 않습니다.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2@s">
								<ScInput v-model="sendData.name" :error-state="$v.sendData.name.$error"
										 :validator="$v.sendData.name">
									<label>
										이름
									</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.name.required">
										이름을 입력하세요.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2@s">
								<input id="switch-css" v-model="sendData.isActive" type="checkbox"
									   class="sc-switch-input">
								<label for="switch-css" class="sc-switch-label"
									   style="margin-top:15px;margin-left:15px;">
									<span class="sc-switch-toggle-on">활성</span>
									<span class="sc-switch-toggle-off">비활성</span>
								</label>
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
	import {validationMixin} from 'vuelidate'
	import {required, minLength, minValue, sameAs, email, requiredIf} from 'vuelidate/lib/validators'
	import customValidators from '@/plugins/vuelidateValidators'
	import ScInput from '~/components/Input'

	export default {
		components: {
			ScInput
		},
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
					id: '',
					password: '',
					passwordConfirm: '',
					name: '',
					grade: 0,
					isActive: true
				},
			}
		},
		validations: {
			sendData: {
				id: {
					required,
					idFormatCheck: customValidators.idFormatCheck(),
					async isUnique(value) {
						if (value === '') return true
						if (this.sendData.uid) return true
						let res = await this.$axios.$get(`/api/account/unique/${value}`)
						return Boolean(res.data)
					}
				},
				password: {
					required: requiredIf(function (nestedModel) {
						return !nestedModel.uid
					}),
					passwordFormatCheck: customValidators.passwordFormatCheck()
				},
				passwordConfirm: {
					sameAsPassword: sameAs('password')
				},
				name: {
					required
				},
				grade: {
					required
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
				this.$nuxt.$emit('reset-account-list')
			},
			deleteForm() {
				this.$axios.$delete(this.config.apiUrl + '/api/accounts/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('삭제하였습니다.')
					this.$nuxt.$emit('fetch-account-list', res.data.uid)
				}).finally(() => {
					this.deleteStatus = 'OK'
					this.cardFormClosed = true
				})
			},
			submitForm(e) {
				console.log(this.sendData.uid)
				e.preventDefault()
				this.$v.$touch()

				if (this.$v.$invalid) {
					console.log(this.$v)
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
				console.log(this.sendData)
				this.$axios.$post(this.config.apiUrl + '/api/accounts', this.sendData).then(async res => {
					this.callNotification('계정을 생성하였습니다.')
					this.$nuxt.$emit('fetch-account-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			putForm() {
				this.$axios.$put(this.config.apiUrl + '/api/accounts/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('수정하였습니다.')
					this.$nuxt.$emit('fetch-account-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-account-form', (data) => {
				vm.settingForm(data)
			})
			this.$nuxt.$on('close-account-form', () => {
				vm.closeForm()
			})
		},
		async beforeMount() {
			this.sendData = this.defaultForm
		},
		beforeDestroy() {
			this.$nuxt.$off('open-account-form')
			this.$nuxt.$off('close-account-form')
		}
	}
</script>

<style lang="scss">
	.sc-vue-errors li {
		font-size: 12px;
	}
</style>
