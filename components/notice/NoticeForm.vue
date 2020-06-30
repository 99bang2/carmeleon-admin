<template>
	<div>
		<Transition name="slide-bottom-medium">
			<ScCard v-if="!cardFormClosed" style="min-height: 745px">
				<ScCardHeader separator>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								<i class="mdi" :class="{ 'mdi-details' : sendData.uid, 'mdi-plus': !sendData.uid }"/>
								{{ sendData.uid ? '상세': '등록' }}
							</ScCardTitle>
						</div>
						<ScCardActions v-if="mode !== 'mypage'">
							<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close"
							   @click.prevent="closeForm"/>
						</ScCardActions>
					</div>
				</ScCardHeader>
				<ScCardBody style="padding-top:0px;">
					<div class="uk-accordion-content">
						<form class="uk-grid-small uk-grid" data-uk-grid>
							<div class="uk-width-1-1">
								<ScInput v-model="sendData.title" :error-state="$v.sendData.title.$error"
										 :validator="$v.sendData.title">
									<label>
										제목
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip"
										  data-uk-icon="icon: pencil"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.title.required">
										제목을 입력하세요.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-1 uk-margin-top">
								<ScTextarea
									v-model="sendData.content"
									:cols="30"
									:rows="9"
									:autosize="true"
									mode="outline"
									:error-state="$v.sendData.content.$error"
									:validator="$v.sendData.content"
								>
									<label>
										내용
									</label>
								</ScTextarea>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.content.required">
										내용을 입력하세요.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2@s">
								<Select2
									v-model="sendData.noticeType"
									:options="noticeOpts"
									:settings="{'width': '100%', 'placeholder':'공지사항 분류'}"
									:error-state="$v.sendData.noticeType.$error"
								/>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.noticeType.required">
										공지사항 분류를 선택하세요.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2@s">
								<input id="switch-css" v-model="sendData.isOpen" type="checkbox"
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
							{{ sendData.uid ? '수정': '등록' }}
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
	import ScInput from '~/components/Input'
	import ScTextarea from '~/components/Textarea'
	import Select2 from '~/components/Select2'

	export default {
		components: {
			ScInput,
			ScTextarea,
			Select2
		},
		mixins: [
			validationMixin,
		],
		props: {
			mode: {
				type: String,
				default: 'list'
			},
		},
		data() {
			return {
				noticeOpts:[
					{id: 0, text: '긴급'},
					{id: 1, text: '필수'},
					{id: 2, text: '일반'},
				],
				cardFormClosed: true,
				submitStatus: null,
				deleteStatus: null,
				sendData: {},
				defaultForm: {
					uid: null,
					accountUid: 0,
					title: '',
					content: '',
					noticeType: '',
					isOpen: false
				}
			}
		},
		validations: {
			sendData: {
				title: {
					required
				},
				content: {
					required
				},
				noticeType: {
					required
				}
			}
		},
		created() {

			let vm = this
			this.$nuxt.$on('open-notice-form', (data) => {
				vm.settingForm(data)
			})
			this.$nuxt.$on('close-notice-form', () => {
				vm.closeForm()
			})
		},
		beforeDestroy() {
			this.$nuxt.$off('open-notice-form')
			this.$nuxt.$off('close-notice-form')
		},
		async beforeMount() {
			this.sendData = this.defaultForm
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
				this.$nuxt.$emit('reset-notice-list')
			},
			deleteForm() {
				this.$axios.$delete(this.config.apiUrl + '/api/notices/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('삭제하였습니다.')
					this.$nuxt.$emit('fetch-notice-list', res.data.uid)
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
				this.sendData.accountUid = this.$auth.user.uid;
				this.$axios.$post(this.config.apiUrl + '/api/notices', this.sendData).then(async res => {
					this.callNotification('등록하였습니다.')
					this.$nuxt.$emit('fetch-notice-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
					this.cardFormClosed = true
				})
			},
			putForm() {
				this.$axios.$put(this.config.apiUrl + '/api/notices/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('수정하였습니다.')
					this.$nuxt.$emit('fetch-notice-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
		}
	}
</script>

<style lang="scss">
	.sc-vue-errors li {
		font-size: 12px;
	}
</style>
