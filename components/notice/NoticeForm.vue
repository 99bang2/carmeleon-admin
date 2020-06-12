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
							<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close" @click.prevent="closeForm"/>
						</ScCardActions>
					</div>
				</ScCardHeader>
				<ScCardBody style="padding-top:0px;">
					<div class="uk-accordion-content">
						<form class="uk-grid-small uk-grid" data-uk-grid>
							<div class="uk-width-1-1">
								<ScInput v-model="sendData.name" :error-state="$v.sendData.name.$error" :validator="$v.sendData.name">
									<label>
										명칭
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.name.required">
										명칭을 입력하세요.
									</li>
								</ul>
							</div>
						</form>
					</div>
					<div class="uk-margin-top uk-text-center">
						<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" @click="submitForm">
							{{ sendData.uid ? '수정': '등록' }}
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
import customValidators from '~/plugins/vuelidateValidators'
import ScInput from '~/components/Input'
import ScTextarea from '~/components/Textarea'
import Select2 from '~/components/Select2'
import moment from '~/plugins/moment'

export default {
	components: {
		ScInput,
		//ScTextarea,
		//Select2
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
			cardFormClosed: true,
			submitStatus: null,
			sendData: {},
			defaultForm: {
				uid: null,
				name: '',
			}
		}
	},
	validations: {
		sendData: {
			name: {
				required
			},
		}
	},
	created() {
		let vm = this
		this.$nuxt.$on('open-example-form', (data) => {
			vm.settingForm(data)
		})
		this.$nuxt.$on('close-example-form', () => {
			vm.closeForm()
		})
	},
	beforeDestroy() {
		this.$nuxt.$off('open-example-form')
		this.$nuxt.$off('close-example-form')
	},
	async beforeMount() {
		this.sendData = this.defaultForm
	},
	methods: {
		settingForm(props){
			this.$v.$reset()
			if(props) {
				this.sendData = JSON.parse(JSON.stringify(props.data))
			}else {
				this.sendData = JSON.parse(JSON.stringify(this.defaultForm))
			}
			this.cardFormClosed = true
			setTimeout(() => {
				this.cardFormClosed = false
			}, 100)
		},
		closeForm() {
			this.cardFormClosed = true
			this.$nuxt.$emit('reset-example-list')
		},
		submitForm(e) {
			e.preventDefault()
			this.$v.$touch()
			if (this.$v.$invalid) {
				console.log(this.$v.sendData.admin.id)
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
			this.$axios.$post(this.config.apiUrl + '/api/examplees', this.sendData).then(async res => {
				this.callNotification('등록하였습니다.')
				this.$nuxt.$emit('fetch-example-list', res.data.uid)
			}).finally(() => {
				this.submitStatus = 'OK'
			})
		},
		putForm() {
			this.$axios.$put(this.config.apiUrl + '/api/examplees/' + this.sendData.uid, this.sendData).then(async res => {
				this.callNotification('수정하였습니다.')
				this.$nuxt.$emit('fetch-example-list', res.data.uid)
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
