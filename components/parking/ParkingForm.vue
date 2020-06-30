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
							<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close"
							   @click.prevent="closeForm"/>
						</ScCardAction>
					</div>
				</ScCardHeader>
				<ScCardBody style="padding-top:0px">
					<ul class="uk-child-width-expand" data-uk-tab v-show="sendData.uid">
						<li class="uk-active">
							<a href="javascript:void(0)">
								주차장 정보관리
							</a>
						</li>
						<li>
							<a href="javascript:void(0)" @click.prevent="openNewForm(sendData.uid)">
								주차장 리뷰보기
							</a>
						</li>
					</ul>
					<ul class="uk-switcher">
						<li>
							<div class="uk-accordion-content">
								<form class="uk-grid-small uk-grid" data-uk-grid>
									<!--	siteType, name , isActive -->
									<div class="uk-width-1-3">
										<Select2
											v-model="sendData.siteType"
											:options="siteOpts"
											:settings="{ 'width': '100%', 'placeholder': '주차장 유형' }"
											:error-state="$v.sendData.siteType.$error"
										/>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.siteType.required">
												주차장 유형을 선택하세요.
											</li>
										</ul>
									</div>
									<div class="uk-width-2-5">
										<ScInput v-model="sendData.name" :error-state="$v.sendData.name.$error"
												 :validator="$v.sendData.name">
											<label>
												주차장 이름
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip"
												  data-uk-icon="icon: pencil"/>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.name.required">
												주차장 이름을 입력하세요.
											</li>
										</ul>
									</div>
									<div class="uk-width-1-5">
										<input id="switch-css" v-model="sendData.isActive" type="checkbox"
											   class="sc-switch-input">
										<label for="switch-css" class="sc-switch-label"
											   style="margin-top:15px;margin-left:15px;">
											<span class="sc-switch-toggle-on">운영중</span>
											<span class="sc-switch-toggle-off">미운영</span>
										</label>
									</div>
									<!--	최대 가용 대수 , 가격  -->
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.parkingLot"
												 :error-state="$v.sendData.parkingLot.$error"
												 :validator="$v.sendData.parkingLot">
											<label>
												최대가용대수
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip"
												  data-uk-icon="icon: pencil"/>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.parkingLot.required">
												최대가용대수를 입력하세요.
											</li>
											<li v-if="!$v.sendData.parkingLot.integerFormatCheck">
												올바른 형식이 아닙니다.
											</li>
										</ul>
									</div>
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.price" :error-state="$v.sendData.price.$error"
												 :validator="$v.sendData.price">
											<label>
												기준가격
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip"
												  data-uk-icon="icon: tag"/>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.price.required">
												가격을 입력해주세요.
											</li>
											<li v-if="!$v.sendData.price.integerFormatCheck">
												올바른 형식이 아닙니다.
											</li>
										</ul>
									</div>
									<!--									<div class="uk-width-1-3">-->
									<!--										<ScInput v-model="sendData.lat" :error-state="$v.sendData.lat.$error"-->
									<!--												 :validator="$v.sendData.lat">-->
									<!--											<label>-->
									<!--												위도-->
									<!--											</label>-->
									<!--											<span slot="icon" class="uk-form-icon uk-form-icon-flip"-->
									<!--												  data-uk-icon="icon: location"/>-->
									<!--										</ScInput>-->
									<!--										<ul class="sc-vue-errors">-->
									<!--											<li v-if="!$v.sendData.lat.required">-->
									<!--												위도를 입력해주세요.-->
									<!--											</li>-->
									<!--										</ul>-->
									<!--									</div>-->
									<!--									<div class="uk-width-1-3">-->
									<!--										<ScInput v-model="sendData.lon" :error-state="$v.sendData.lon.$error"-->
									<!--												 :validator="$v.sendData.lon">-->
									<!--											<label>-->
									<!--												경도-->
									<!--											</label>-->
									<!--											<span slot="icon" class="uk-form-icon uk-form-icon-flip"-->
									<!--												  data-uk-icon="icon: location"/>-->
									<!--										</ScInput>-->
									<!--										<ul class="sc-vue-errors">-->
									<!--											<li v-if="!$v.sendData.parkingLot.required">-->
									<!--												경도를 입력해주세요.-->
									<!--											</li>-->
									<!--										</ul>-->
									<!--									</div>-->
									<!--	연락처, 휴대전화        -->
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.tel">
											<label>
												연락처
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip"
												  data-uk-icon="icon: receiver"/>
										</ScInput>
									</div>
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.phone">
											<label>
												휴대전화
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip"
												  data-uk-icon="icon: phone"/>
										</ScInput>
									</div>
									<!--	이메일, 담당자이름      -->
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.email" :error-state="$v.sendData.email.$error"
												 :validator="$v.sendData.email">
											<label>
												이메일
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip"
												  data-uk-icon="icon: mail"/>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.email.email">
												올바른 이메일 형식이 아닙니다.
											</li>
										</ul>
									</div>
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.manager">
											<label>
												담당자
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip"
												  data-uk-icon="icon: user"/>
										</ScInput>
									</div>
									<!--	주소입력 -->
									<div class="uk-width-1-1 uk-flex"
										 style="justify-content: space-around; align-items: center">
										<div class="uk-width-5-6">
											<ScInput v-model="sendData.address" class="uk-flex-1"
													 :error-state="$v.sendData.address.$error"
													 :validator="$v.sendData.address">
												<label>
													주소
												</label>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.sendData.address.required">
													주소를 입력하세요.
												</li>
											</ul>
										</div>
										<a href="javascript:void(0)"
										   class="sc-button sc-button-icon sc-button-outline sc-button-large"
										   @click.prevent="searchPlace(sendData.address)">
											<span data-uk-icon="icon: search"></span>
										</a>
									</div>
									<div v-if="searchAddr" class="uk-width-1-1" style="margin: 15px; padding: 0px;">
										<ul class="uk-list uk-list-divider uk-list-collapse">
											<li class ="selectAddr" v-for="(item,index) in searchAddr" v-bind:key=index
												style="justify-content: space-between" type="button"
												@click="selectAddr(item)">
												<span v-html="item.title"></span>
												<span class="selectIcon" data-uk-icon="icon: check"></span>
											</li>
										</ul>
									</div>

									<!--									<div class="uk-width-1-1">-->
									<!--										<ScInput v-model="sendData.address">-->
									<!--											<label>-->
									<!--												주소입력-->
									<!--											</label>-->
									<!--											<span slot="icon" class="uk-form-icon uk-form-icon-flip"-->
									<!--												  data-uk-icon="icon: location"/>-->
									<!--										</ScInput>-->
									<!--									</div>-->
									<!--    주차장 안내             -->
									<div class="uk-width-1-1">
										<ScTextarea
											v-model="sendData.info"
											:cols="30"
											:rows="4"
											:autosize="true"
											mode="outline"
										>
											<label>주차장 안내 입력</label>
										</ScTextarea>
									</div>
									<!--    요금 안내               -->
									<div class="uk-width-1-1">
										<ScTextarea
											v-model="sendData.priceInfo"
											:cols="30"
											:rows="4"
											:autosize="true"
											mode="outline"
										>
											<label>요금 안내 입력</label>
										</ScTextarea>
									</div>
									<!--    결제태그 제휴태그-->
									<div class="uk-width-1-3@s">
										<ul class="uk-list">
											<h6>결제태그</h6>
											<li v-for="tag in paymentTag" :key="tag.id">
												<PrettyCheck v-model="sendData.paymentTag" :value="tag.value"
															 class="p-icon">
													<i slot="extra" class="icon mdi mdi-check"></i>
													{{tag.name}}
												</PrettyCheck>
											</li>

											<h6>제휴태그</h6>
											<li v-for="tag in brandTag" :key="tag.id">
												<PrettyCheck v-model="sendData.brandTag" :value="tag.value"
															 class="p-icon">
													<i slot="extra" class="icon mdi mdi-check"></i>
													{{tag.name}}
												</PrettyCheck>
											</li>
										</ul>
									</div>
									<!--   	상품태그  차량태그-->
									<div class="uk-width-1-3@s">
										<ul class="uk-list">
											<h6>상품태그</h6>
											<li v-for="tag in productTag" :key="tag.id">
												<PrettyCheck v-model="sendData.productTag" :value="tag.value"
															 class="p-icon">
													<i slot="extra" class="icon mdi mdi-check"></i>
													{{tag.name}}
												</PrettyCheck>
											</li>

											<h6>차량태그</h6>
											<li v-for="tag in carTag" :key="tag.id">
												<PrettyCheck v-model="sendData.carTag" :value="tag.value"
															 class="p-icon">
													<i slot="extra" class="icon mdi mdi-check"></i>
													{{tag.name}}
												</PrettyCheck>
											</li>
										</ul>
									</div>
									<!--    옵션태그-->
									<div class="uk-width-auto">
										<ul class="uk-list">
											<h6>옵션태그</h6>
											<li v-for="tag in optionTag" :key="tag.id">
												<PrettyCheck v-model="sendData.optionTag" :value="tag.value"
															 class="p-icon">
													<i slot="extra" class="icon mdi mdi-check"></i>
													{{tag.name}}
												</PrettyCheck>
											</li>
										</ul>
									</div>
									<!--    주차장 이미지           -->
									<div class="uk-width-1-1">
										<h4>주차장 이미지 등록</h4>
										<div style="display: flex; justify-content: center;">
											<vue-upload-multiple-image
												@upload-success="uploadImageSuccess"
												@before-remove="beforeRemove"
												@edit-image="editImage"
												:data-images="tempImage"
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
	import ScTextarea from '~/components/Textarea'
	import ScCardAction from "@/components/card/components/CardActions"
	import VueUploadMultipleImage from 'vue-upload-multiple-image';
	import {validationMixin} from 'vuelidate'
	import PrettyCheck from 'pretty-checkbox-vue/check';
	import {required, email} from 'vuelidate/lib/validators'
	import RatingList from "@/components/parking/RatingList"
	import Select2 from "@/components/Select2";
	import customValidators from "@/plugins/vuelidateValidators";

	if (process.client) {
		require('~/plugins/inputmask');
	}
	export default {
		components: {
			Select2,
			ScInput,
			ScCard,
			ScTextarea,
			VueUploadMultipleImage,
			PrettyCheck,
			ScCardAction,
			RatingList
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
				siteOpts: [
					{id: 0, text: "하이파킹"},
					{id: 1, text: "제휴"},
					{id: 2, text: "일반"},

				],
				cardFormClosed: true,
				submitStatus: null,
				sendData: {},
				tempImage: [],
				searchAddr: [],
				defaultForm: {
					uid: null,
					siteType: '',
					name: '',
					parkingLot: null,
					lat: null,
					lon: null,
					tel: '',
					phone: '',
					manager: '',
					isActive: true,
					price: null,
					address: '',
					info: '',
					priceInfo: '',
					paymentTag: [],
					brandTag: [],
					productTag: [],
					optionTag: [],
					carTag: [],
					picture: [],
				},
				paymentTag: [
					{
						id: '11',
						name: '카드결제',
						value: 'card',
					},
					{
						id: '12',
						name: '현금결제',
						value: 'cash',
					},
					{
						id: '13',
						name: '인앱결제',
						value: 'inApp',
					}
				],
				brandTag: [
					{
						id: '21',
						name: '하이파킹',
						value: 'hiParking',
					},
					{
						id: '22',
						name: '서울시',
						value: 'cityOfSeoul',
					}
				],
				productTag: [
					{
						id: '31',
						name: '시간권',
						value: 'timePass',
					},
					{
						id: '32',
						name: '당일권',
						value: 'dayPass',
					},
					{
						id: '33',
						name: '월정기권',
						value: 'monthPass',
					}
				],
				optionTag: [
					{
						id: '41',
						name: '경차',
						value: 'cityCar',
					},
					{
						id: '42',
						name: '노약자',
						value: 'cityOfSeoul',
					},
					{
						id: '43',
						name: '장애인',
						value: 'disabled',
					},
					{
						id: '44',
						name: '임산부',
						value: 'pregnant',
					},
					{
						id: '45',
						name: '여성',
						value: 'female',
					},
					{
						id: '46',
						name: '전기차충전',
						value: 'elecCharge',
					},
					{
						id: '47',
						name: '기계식',
						value: 'mechanical',
					}
				],
				carTag: [
					{
						id: '51',
						name: '버스',
						value: 'bus',
					},
					{
						id: '52',
						name: '화물',
						value: 'freight',
					}
				],
			}
		},
		validations: {
			sendData: {
				siteType: {
					required
				}, name: {
					required
				}, address: {
					required
				},
				parkingLot: {
					required,
					integerFormatCheck: customValidators.integerFormatCheck()
				}, price: {
					required,
					integerFormatCheck: customValidators.integerFormatCheck()
				},
				lat: {
					required
				}, lon: {
					required
				}, email: {
					email
				}
			}
		},
		methods: {
			selectAddr(searchItem) {
				this.$axios.$post(this.config.apiUrl + '/api/searchLocal', {address: searchItem.address}).then(async res => {
					this.callNotification("검색을 완료하였습니다.")
					console.log(res.data.addresses[0])
					this.sendData.address = res.data.addresses[0].jibunAddress
					this.sendData.lat = res.data.addresses[0].x
					this.sendData.lon = res.data.addresses[0].y
					this.searchAddr=[]
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			searchPlace(searchString) {
				if (!searchString) this.callAlertError("주소가 입력되지 않았습니다.")
				this.$axios.$post(this.config.apiUrl + '/api/searchList', {keyword: searchString}).then(async res => {
					this.callNotification('목록을 가져왔습니다.')
					this.searchAddr = res.data.items
				}).finally(() => {
					this.submitStatus = 'OK'
				})
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
				this.$nuxt.$emit('reset-parking-list')
			},
			deleteForm() {
				this.$axios.$delete(this.config.apiUrl + '/api/parkings/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('삭제하였습니다.')
					this.$nuxt.$emit('fetch-parking-list', res.data.uid)
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
				this.$axios.$post(this.config.apiUrl + '/api/parkings', this.sendData).then(async res => {
					this.callNotification('계정을 생성하였습니다.')
					this.$nuxt.$emit('fetch-parking-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			putForm() {
				this.$axios.$put(this.config.apiUrl + '/api/parkings/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('수정하였습니다.')
					this.$nuxt.$emit('fetch-parking-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-parking-form', (data) => {
				vm.settingForm(data)
			})
			this.$nuxt.$on('close-parking-form', () => {
				vm.closeForm()
			})
		},
		async beforeMount() {
			this.sendData = this.defaultForm
		},
		beforeDestroy() {
			this.$nuxt.$off('open-parking-form')
			this.$nuxt.$off('close-parking-form')
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
