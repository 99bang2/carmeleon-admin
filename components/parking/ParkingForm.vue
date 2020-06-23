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
					<div class="uk-accordion-content">
						<form class="uk-grid-small uk-grid" data-uk-grid>
							<!--	siteType, name  -->
							<div class="uk-width-1-3">
								<select v-model="sendData.siteType" class="uk-select" required="required">
									<option value="" disabled="disabled">주차장 유형</option>
									<option value="0">하이파킹</option>
									<option value="1">제휴</option>
									<option value="2">일반</option>
								</select>
							</div>
							<div class="uk-width-2-3">
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
							<!--	최대 가용 대수 , 위도 경도  -->
							<div class="uk-width-1-3">
								<ScInput v-model="sendData.parkingLot" :error-state="$v.sendData.parkingLot.$error"
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
								</ul>
							</div>
							<div class="uk-width-1-3">
								<ScInput v-model="sendData.lat" :error-state="$v.sendData.lat.$error"
										 :validator="$v.sendData.lat">
									<label>
										위도
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip"
										  data-uk-icon="icon: location"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.lat.required">
										위도를 입력해주세요.
									</li>
								</ul>
							</div>
							<div class="uk-width-1-3">
								<ScInput v-model="sendData.lon" :error-state="$v.sendData.lon.$error"
										 :validator="$v.sendData.lon">
									<label>
										경도
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip"
										  data-uk-icon="icon: location"/>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.sendData.parkingLot.required">
										경도를 입력해주세요.
									</li>
								</ul>
							</div>
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
								<ScInput v-model="sendData.email" v-input-mask="{ 'alias': 'email' }">
									<label>
										이메일
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: mail"/>
								</ScInput>
							</div>
							<div class="uk-width-1-2">
								<ScInput v-model="sendData.manager">
									<label>
										담당자
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: user"/>
								</ScInput>
							</div>
							<!--	기준가격, 이용가능여부 -->
							<div class="uk-width-1-2">
								<ScInput v-model="sendData.price">
									<label>
										기준가격
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
								</ScInput>
							</div>
							<div class="uk-width-1-2">
								<input id="switch-css" v-model="sendData.isActive" type="checkbox"
									   class="sc-switch-input">
								<label for="switch-css" class="sc-switch-label"
									   style="margin-top:15px;margin-left:15px;">
									<span class="sc-switch-toggle-on">운영중</span>
									<span class="sc-switch-toggle-off">미운영</span>
								</label>
							</div>
							<!--    주소                    -->
							<div class="uk-width-1-1">
								<ScInput v-model="sendData.address">
									<label>
										주소
									</label>
									<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: home"/>
								</ScInput>
							</div>
							<hr>
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
							<hr>
							<!--    결제태그 제휴태그-->
							<div class="uk-width-1-3@s">
								<ul class="uk-list">
									<h6>결제태그</h6>
									<li v-for="tag in paymentTagOptions" :key="tag.id">
										<PrettyCheck v-model="sendData.paymentTags" :value="tag.val" class="p-icon">
											<i slot="extra" class="icon mdi mdi-check"></i>
											{{tag.name}}
										</PrettyCheck>
									</li>

									<h6>제휴태그</h6>
									<li v-for="tag in brandTagOptions" :key="tag.id">
										<PrettyCheck v-model="sendData.brandTags" :value="tag.val" class="p-icon">
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
									<li v-for="tag in productTagOptions" :key="tag.id">
										<PrettyCheck v-model="sendData.productTags" :value="tag.val" class="p-icon"
													 checked>
											<i slot="extra" class="icon mdi mdi-check"></i>
											{{tag.name}}
										</PrettyCheck>
									</li>

									<h6>차량태그</h6>
									<li v-for="tag in carTagOptions" :key="tag.id">
										<PrettyCheck v-model="sendData.carTags" :value="tag.val" class="p-icon">
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
									<li v-for="tag in optionTagOptions" :key="tag.id">
										<PrettyCheck v-model="sendData.optionTags" :value="tag.val" class="p-icon">
											<i slot="extra" class="icon mdi mdi-check"></i>
											{{tag.name}}
										</PrettyCheck>
									</li>
								</ul>
							</div>
							<hr>
							<!--    주차장 이미지           -->
							<div class="uk-width-1-1">
								<h4>주차장 이미지 등록</h4>
								<div style="display: flex; justify-content: center;">
									<vue-upload-multiple-image
										@upload-success="uploadImageSuccess"
										@before-remove="beforeRemove"
										@edit-image="editImage"
										:data-images="sendData.pictures"
										idUpload="myIdUpload"
										editUpload="myIdEdit"
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
				</ScCardBody>
			</ScCard>
		</Transition>
	</div>
</template>

<script>
	import ScCard from "@/components/card/components/Card";
	import ScInput from "@/components/Input";
	import ScTextarea from '~/components/Textarea'
	import VueUploadMultipleImage from 'vue-upload-multiple-image';
	import {validationMixin} from 'vuelidate'
	import PrettyCheck from 'pretty-checkbox-vue/check';
	import {required, minLength, minValue, sameAs, email, requiredIf} from 'vuelidate/lib/validators'


	export default {
		components: {ScInput, ScCard, ScTextarea, VueUploadMultipleImage, PrettyCheck},
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
					siteType: '',
					name: '',
					parkingLot: null,
					lat: null,
					lon: null,
					tel: '',
					phone: '',
					manager: '',
					isActive: true,
					price: 0,
					address: '',
					info: '',
					priceInfo: '',
					paymentTags: [],
					brandTags: [],
					productTags: [],
					optionTags: [],
					carTags: [],
					pictures: []
				},
				paymentTagOptions: [
					{
						id: '1',
						name: '카드결제',
						val: 'card',
					},
					{
						id: '2',
						name: '현금결제',
						val: 'cash'
					},
					{
						id: '3',
						name: '인앱결제',
						val: 'inApp'
					}
				],
				brandTagOptions: [
					{
						id: '1',
						name: '하이파킹',
						val: 'hiParking',
					},
					{
						id: '2',
						name: '서울시',
						val: 'cityOfSeoul'
					}
				],
				productTagOptions: [
					{
						id: '1',
						name: '시간권',
						val: 'timePass',
					},
					{
						id: '2',
						name: '당일권',
						val: 'dayPass'
					},
					{
						id: '3',
						name: '월정기권',
						val: 'monthPass'
					}
				],
				optionTagOptions: [
					{
						id: '1',
						name: '경차',
						val: 'cityCar',
					},
					{
						id: '2',
						name: '노약자',
						val: 'cityOfSeoul'
					},
					{
						id: '3',
						name: '장애인',
						val: 'disabled'
					},
					{
						id: '4',
						name: '임산부',
						val: 'pregnant'
					},
					{
						id: '5',
						name: '여성',
						val: 'female'
					},
					{
						id: '6',
						name: '전기차충전',
						val: 'elecCharge'
					},
					{
						id: '7',
						name: '기계식',
						val: 'mechanical'
					}
				],
				carTagOptions: [
					{
						id: '1',
						name: '버스',
						val: 'bus',
					},
					{
						id: '2',
						name: '화물',
						val: 'freight'
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
				}, parkingLot: {
					required
				}, lat: {
					required
				}, lon: {
					required
				},
			}
		},
		methods: {
			//multi image upload////////////////////////////////////////////////
			uploadImageSuccess(formData, index, fileList) {
				console.log('data', formData, index, fileList)
				// Upload image api
				// axios.post('http://your-url-upload', formData).then(response => {
				//   console.log(response)
				// })
			},
			beforeRemove(index, done, fileList) {
				console.log('index', index, fileList)
				var r = confirm("remove image")
				if (r == true) {
					done()
				} else {
				}
			},
			editImage(formData, index, fileList) {
				console.log('edit data', formData, index, fileList)
			},
			//multi image upload////////////////////////////////////////////////


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

	.sc-vue-errors li {
		font-size: 12px;
	}
</style>
