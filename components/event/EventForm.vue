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
							<div class="uk-width-1-1@s">
							</div>
							<!--	bannerImg 이미지 1-->
							<div class="uk-width-1-2">
								<div data-uk-form-custom="target: true">
									<input type="file" accept="image/*" ref="bannerImg" @change="onChangeFile">
									<input class="uk-visible@s uk-input uk-form-width-medium" type="text" placeholder="Select file" disabled>
								</div>
							</div>
							<!--	mainImg	이미지 2-->
							<div class="uk-width-1-2">
								<div data-uk-form-custom="target: true">
									<input type="file" accept="image/*" ref="mainImg" @change="onChangeFile">
									<input class="uk-visible@s uk-input uk-form-width-medium" type="text" placeholder="Select file" disabled>
								</div>
							</div>
							<div class="uk-width-1-1@s">
							</div>
							<div class="uk-width-1-1@s">
								<div class="uk-grid-small uk-grid" data-uk-grid>
									<ScInput v-model="eventDate" v-flatpickr="dpRange" placeholder="이벤트 기간" mode="outline">
										<span slot="icon" class="uk-form-icon" data-uk-icon="calendar"></span>
									</ScInput>
								</div>
							</div>
							<div class="uk-width-1-1@s">
							</div>

							<div class="uk-width-1-2">
								<Select v-model="sendData.eventType" class="uk-select">
									<option value="">이벤트 종류</option>
									<option value="0">팝업적용</option>
									<option value="1">팝업미적용</option>
								</Select>
							</div>
							<div class="uk-width-1-2">
								<Select v-model="sendData.isOpen" class="uk-select">
									<option value="">공개여부</option>
									<option value=true>공개</option>
									<option value=false>비공개</option>
								</Select>
							</div>
						</form>
					</div>

					<div class="uk-margin-top uk-text-center">
						<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'"
								@click="submitForm">
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
	import ScInput from '~/components/Input'
	import confirmDatePlugin from "flatpickr/dist/plugins/confirmDate/confirmDate"
	if(process.client) {
		require('~/plugins/flatpickr');
	}

	export default {
		components: {
			ScInput,
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
				eventDate:'',
				defaultForm: {
					uid: null,
					title:'',
					bannerImg: '',
					mainImg: '',
					startDate:'',
					endDate: '',
					eventType:0,
					isOpen: false,
				}
			}
		},
		computed:{
			dpRange () {
				return {
					mode: "range",
					plugins: [confirmDatePlugin]
				}
			},
		},
		watch: {
			'eventDate': function(newVal) {
				if(newVal.includes("~")){
					this.sendData.startDate = newVal.split('~')[0].trim();
					this.sendData.endDate = newVal.split('~')[1].trim();
				}
			}
		},
		validations: {
			sendData: {
				title: {
					required
				},
			}
		},
		methods: {
			onChangeFile() {
				console.log(this.$refs);
				this.sendData.bannerImg = this.$refs.bannerImg.files[0];
				this.sendData.mainImg = this.$refs.mainImg.files[0];
			},


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
				this.$nuxt.$emit('reset-event-list')
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
				console.log(this.sendData)
				this.$axios.$post(this.config.apiUrl + '/api/events', this.sendData,{
					headers: {
						'Content-Type' : 'multipart/form-data'
					}
				}).then(async res => {
					this.callNotification('등록하였습니다.')
					this.$nuxt.$emit('fetch-event-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			putForm() {
				this.$axios.$put(this.config.apiUrl + '/api/events/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('수정하였습니다.')
					this.$nuxt.$emit('fetch-event-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
		},

		created() {
			let vm = this
			this.$nuxt.$on('open-event-form', (data) => {
				vm.settingForm(data)
			})
			this.$nuxt.$on('close-event-form', () => {
				vm.closeForm()
			})
		},
		async beforeMount() {
			this.sendData = this.defaultForm
		},
		beforeDestroy() {
			this.$nuxt.$off('open-event-form')
			this.$nuxt.$off('close-event-form')
		}
	}
</script>

<style lang="scss">
	.sc-vue-errors li {
		font-size: 12px;
	}
</style>
