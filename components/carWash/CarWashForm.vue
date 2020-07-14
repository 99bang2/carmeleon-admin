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
						<ScCardAction v-if="mode !== 'mypage'">
							<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close" @click.prevent="closeForm"/>
						</ScCardAction>
					</div>
				</ScCardHeader>
				<ScCardBody style="padding-top:0px">
					<ul class="uk-child-width-expand" data-uk-tab v-show="sendData.uid">
						<li class="uk-active">
							<a href="javascript:void(0)">
								세차장 정보관리
							</a>
						</li>
						<li>
							<a href="javascript:void(0)" @click.prevent="openNewForm(sendData.uid)">
								세차장 리뷰보기
							</a>
						</li>
					</ul>
					<ul class="uk-switcher">
						<li>
							<div class="uk-accordion-content">
								<form class="uk-grid-small uk-grid" data-uk-grid>
									<!--	최대 가용 대수 , 가격  -->
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.carwshNm" :error-state="$v.sendData.carwshNm.$error" :validator="$v.sendData.carwshNm">
											<label>
												사업장명
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: pencil"/>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.carwshNm.required">
												사업장명을 입력하세요
											</li>
										</ul>
									</div>
									<div class="uk-width-1-2">
										<Select2
											v-model="sendData.carwshInduty"
											:options="industryOpts"
											:settings="{ 'width': '100%', 'placeholder': '사업장 업종명' }"
											:error-state="$v.sendData.carwshInduty.$error"
										/>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.carwshInduty.required">
												사업장 업종명을 선택하세요.
											</li>
										</ul>
									</div>
									<div class="uk-width-1-2">
										<Select2
											v-model="sendData.carwshType"
											:options="carwshTypeOpts"
											:settings="{ 'width': '100%', 'placeholder': '세차유형' }"
											:error-state="$v.sendData.carwshType.$error"
										/>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.carwshType.required">
												세차유형을 선택하세요.
											</li>
										</ul>
									</div>

									<!--	휴무일    -->
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.rstde">
											<label>
												휴무일
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: receiver"/>
										</ScInput>
									</div>

									<!-- 평일운영시간-->
									<div class="uk-width-1-1 uk-flex uk-flex-between" style="vertical-align: middle">
										<div class="uk-width-1-4">평일운영시간</div>

										<div class="uk-width-1-3">
											<ScInput v-model="sendData.weekdayOperOpenHhmm" v-flatpickr="timepicker24" placeholder="평일운영시작시간" mode="outline"></ScInput>
										</div>
										<span style="vertical-align: middle">~</span>
										<div class="uk-width-1-3">
											<ScInput v-model="sendData.weekdayOperCloseHhmm" v-flatpickr="timepicker24" placeholder="평일운영종료시간" mode="outline"></ScInput>
										</div>
									</div>

									<!--	휴일운영시간      -->
									<div class="uk-width-1-1">
										<div class="uk-width-1-2">
											<ScInput v-model="sendData.holidayOperOpenHhmm" v-flatpickr="timepicker24" placeholder="휴일운영시작시간" mode="outline"></ScInput>
										</div>
										<div class="uk-width-1-2">
											<ScInput v-model="sendData.holidayOperCloseHhmm" v-flatpickr="timepicker24" placeholder="휴일운영종료시간" mode="outline"></ScInput>
										</div>
									</div>
									<!-- 세차 요금정보 , 세차장 전화번호-->
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.carwshChrgeInfo" :error-state="$v.sendData.carwshChrgeInfo.$error" :validator="$v.sendData.carwshChrgeInfo">
											<label>
												세차요금정보
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.carwshChrgeInfo.required">
												세차요금정보를 입력하세요
											</li>
										</ul>
									</div>
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.phoneNumber" :error-state="$v.sendData.phoneNumber.$error" :validator="$v.sendData.phoneNumber">
											<label>
												세차장 전화번호
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: receiver"/>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.phoneNumber.required">
												전화번호를 입력하세요
											</li>
										</ul>
									</div>
									<div class="uk-width-1-1 uk-flex" style="justify-content: space-around; align-items: center">
										<div class="uk-width-5-6">
											<ScInput v-model="sendData.rdnmadr" class="uk-flex-1" :error-state="$v.sendData.rdnmadr.$error" :validator="$v.sendData.rdnmadr">
												<label>
													주소
												</label>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.sendData.rdnmadr.required">
													주소를 입력하세요.
												</li>
											</ul>
										</div>
										<a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline sc-button-large" @click.prevent="searchPlace(sendData.rdnmadr)">
											<span data-uk-icon="icon: search"></span>
										</a>
									</div>
									<div v-if="searchAddr" class="uk-width-1-1" style="margin: 15px; padding: 0px;">
										<ul class="uk-list uk-list-divider uk-list-collapse">
											<li class ="selectAddr" v-for="(item,index) in searchAddr" v-bind:key=index style="justify-content: space-between" type="button" @click="selectAddr(item)">
												<span v-html="item.title"></span>
												<span class="selectIcon" data-uk-icon="icon: check"></span>
											</li>
										</ul>
									</div>
									<!--    세차장 이미지           -->
									<div class="uk-width-1-1">
										<h6>세차장 이미지 등록</h6>
										<div style="display: flex; justify-content: center;">
											<vue-upload-multiple-image
												@upload-success="uploadImageSuccess"
												@before-remove="beforeRemove"
												@edit-image="editImage"
												@mark-is-primary="markIsPrimary"
												:data-images="tempImage"
												dragText="Drag Image"
												browseText="Browse Image"
												primaryText="Primary Image"
												markIsPrimaryText="Set Primary Image"
											></vue-upload-multiple-image>
										</div>
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
						</li>
						<li>
							<rating-list></rating-list>
						</li>
					</ul>
				</ScCardBody>
			</ScCard>
		</Transition>
	</div>
</template>

<script>
	import ScCard from "@/components/card/components/Card";
	import ScInput from "@/components/Input";
	import ScCardAction from "@/components/card/components/CardActions"
	import VueUploadMultipleImage from 'vue-upload-multiple-image';
	import {validationMixin} from 'vuelidate'
	import {required} from 'vuelidate/lib/validators'
	import RatingList from "@/components/carWash/RatingList"
	import Select2 from "@/components/Select2";
	if(process.client) {
		require('~/plugins/flatpickr');
	}
	if (process.client) {
		require('~/plugins/inputmask');
	}
	export default {
		components: {
			Select2,
			ScInput,
			ScCard,
			VueUploadMultipleImage,
			ScCardAction,
			RatingList,

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
				tempImage: [],
				searchAddr: [],
				defaultForm: {
					uid: null,
					carwshNm: '', //사업장명
					carwshInduty: '', //사업장업종명
					carwshType: '', //세차유형
					rdnmadr:'', //주소
					rstde:'', //휴무일
					weekdayOperOpenHhmm: '', //평일운영시작시간
					weekdayOperCloseHhmm:'',//평일운영종료시간
					holidayOperOpenHhmm:'', //주말운영시작시간
					holidayOperCloseHhmm:'',//주말운영종료시간
					carwshChrgeInfo:'', //세차요금정보
					phoneNumber:'', //전화번호
					lat: null, //위도
					lon: null, //경도
					picture: [],
					industryOpts:[],
					carwshTypeOpts:[]
				}
			}
		},
		computed: {
			timepicker24 () {
				return {
					enableTime: true,
					noCalendar: true,
					dateFormat: "H:i",
					time_24hr: true,
					defaultDate: this.$moment().format('HH:mm')
				}
			}
		},
		validations: {
			sendData: {
				carwshNm: {
					required
				},
				carwshInduty: {
					required
				},
				carwshType: {
					required
				},
				carwshChrgeInfo:{
					required
				},
				phoneNumber:{
					required
				},
				rdnmadr:{
					required
				}

			}
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-carWash-form', (data) => {
				vm.settingForm(data)
			})
			this.$nuxt.$on('close-carWash-form', () => {
				vm.closeForm()
			})
		},
		async beforeMount() {
			this.sendData = this.defaultForm
			let code = await this.$axios.$post(this.config.apiUrl + '/api/codes')
			this.industryOpts = code.data
			this.carwshTypeOpts = code.data
		},
		beforeDestroy() {
			this.$nuxt.$off('open-carWash-form')
			this.$nuxt.$off('close-carWash-form')
		},
		methods: {
			selectAddr(searchItem) {
				this.$axios.$post(this.config.apiUrl + '/api/searchLocal', {address: searchItem.rdnmadr}).then(async res => {
					this.callNotification("검색을 완료하였습니다.")
					this.sendData.rdnmadr = res.data.addresses[0].jibunAddress
					this.sendData.lat = res.data.addresses[0].x
					this.sendData.lon = res.data.addresses[0].y
					this.searchAddr=[]
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			searchPlace(searchString) {
				if (!searchString) {
					this.callAlertError("주소가 입력되지 않았습니다.")
				}else{
					this.$axios.$post(this.config.apiUrl + '/api/searchList', {keyword: searchString}).then(async res => {
						this.callNotification('목록을 가져왔습니다.')
						this.searchAddr = res.data.items
					}).finally(() => {
						this.submitStatus = 'OK'
					})
				}
			},
			openNewForm(siteUid) {
				this.$nuxt.$emit('open-rate-list', siteUid)
			},
			//multi image upload////////////////////////////////////////////////
			uploadImageSuccess(formData, index, fileList) {
				formData.append('dir', 'site')
				this.$axios.$post(this.config.apiUrl + '/api/uploads/', formData).then(response => {
					this.sendData.picture[index] = response.data;
				})
			},
			beforeRemove(index, done, fileList) {
				let r = confirm("remove image")
				if (r == true) {
					done()
					this.sendData.picture.splice(index, 1);
				} else {
				}
			},
			editImage(formData, index, fileList) {
				formData.append('dir', 'site')
				this.$axios.$post(this.config.apiUrl + '/api/uploads/', formData).then(response => {
					this.sendData.picture[index] = response.data;
				})
			},
			markIsPrimary(index, fileList){
				let temp = this.sendData.picture[0]
				this.sendData.picture[0] = this.sendData.picture[index]
				this.sendData.picture[index] = temp
			},
			//multi image upload////////////////////////////////////////////////

			settingForm(props) {
				this.$v.$reset()
				this.tempImage = []
				if (props) {
					this.sendData = JSON.parse(JSON.stringify(props.data))
					// vue-upload-multiple-image 패키지 사용
					// 주차장 상세보기 할 때, upload된 영역 불러올때 사용
					if (this.sendData.picture !== null) {
						for (let i = 0; i < this.sendData.picture.length; i++) {
							let img = {}
							if(i === 0){
								img.default = 1
								img.highlight=1
							}else{
								img.default = 0
								img.highlight=0
							}
							img.path = this.sendData.picture[i]
							this.tempImage[i] = img
						}
					}
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
				this.$nuxt.$emit('reset-carWash-list')
			},
			deleteForm() {
				this.$axios.$delete(this.config.apiUrl + '/api/carWashs/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('삭제하였습니다.')
					this.$nuxt.$emit('fetch-carWash-list', res.data.uid)
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
				this.$axios.$post(this.config.apiUrl + '/api/carWashs', this.sendData).then(async res => {
					this.callNotification('계정을 생성하였습니다.')
					this.$nuxt.$emit('fetch-carWash-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			putForm() {
				this.$axios.$put(this.config.apiUrl + '/api/carWashs/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('수정하였습니다.')
					this.$nuxt.$emit('fetch-carWash-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			}
		}
	}
</script>

<style lang="scss">
	@import 'assets/scss/vue/_pretty_checkboxes';

	.selectAddr {
		float: right !important;
	}
	.selectIcon{
		display: none;
	}
	.selectAddr:hover{
		cursor:pointer;
		background-color: #4db6ac;
	}
	.selectAddr:hover > .selectIcon{
		display: block;
	}
	.sc-vue-errors li {
		font-size: 12px;
	}
</style>
