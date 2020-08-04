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
								주유소 정보관리
							</a>
						</li>
						<li>
							<a href="javascript:void(0)" @click.prevent="openNewForm(sendData.uid, 1)">
								주유소 리뷰보기
							</a>
						</li>
					</ul>
					<ul class="uk-switcher">
						<li>
							<div class="uk-accordion-content">
								<form class="uk-grid-small uk-grid" data-uk-grid>
									<!--	최대 가용 대수 , 가격  -->
									<h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
										주유소 정보
									</h5>
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.gasStationName" :error-state="$v.sendData.gasStationName.$error" :validator="$v.sendData.gasStationName">
											<label>
												주유소명
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: pencil"/>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.gasStationName.required">
												주유소명을 입력하세요
											</li>
										</ul>
									</div>
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.gasStationUid" :error-state="$v.sendData.gasStationUid.$error" :validator="$v.sendData.gasStationUid">
											<label>
												주유소 ID
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: pencil"/>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.gasStationUid.required">
												주유소ID를 입력하세요
											</li>
										</ul>
									</div>
									<div class="uk-width-1-1">
										<ScInput v-model="sendData.tel" :error-state="$v.sendData.tel.$error" :validator="$v.sendData.tel">
											<label>
												주유소 전화번호
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: receiver"/>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.tel.required">
												전화번호를 입력하세요
											</li>
											<li v-if="!$v.sendData.tel.integer">
												올바른 형식이 아닙니다.
											</li>
										</ul>
									</div>
									<div class="uk-width-1-2">
										<Select2
											v-model="sendData.brandCode"
											:options="brandCodeOpts"
											:settings="{ 'width': '100%', 'placeholder': '브랜드 코드명' }"
											:error-state="$v.sendData.brandCode.$error"
										/>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.brandCode.required">
												브랜드 코드명을 선택하세요.
											</li>
										</ul>
									</div>
									<div class="uk-width-1-2">
										<Select2
											v-model="sendData.gasStationType"
											:options="gasStationTypeOpts"
											:settings="{ 'width': '100%', 'placeholder': '업종구분' }"
											:error-state="$v.sendData.gasStationType.$error"
										/>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.gasStationType.required">
												업종구분을 선택하세요.
											</li>
										</ul>
									</div>
									<div class="uk-width-1-3@s">
										<PrettyCheck v-model="sendData.isCarWash" class="p-switch">
											{{sendData.isCarWash?"세차장 있음":"세차장 없음"}}
										</PrettyCheck>
									</div>
									<div class="uk-width-1-3@s">
										<PrettyCheck v-model="sendData.isConvenience" class="p-switch">
											{{sendData.isConvenience?"편의점 있음":"편의점 없음"}}
										</PrettyCheck>
									</div>
									<div class="uk-width-1-3@s">
										<PrettyCheck v-model="sendData.isKpetro" class="p-switch">
											{{sendData.isKpetro?"품질인증":"미인증"}}
										</PrettyCheck>
									</div>
									<h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
										유가 정보
									</h5>
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.oilPrice[0].PRICE">
											<label>
												휘발유 가격
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
										</ScInput>
									</div>
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.oilPrice[1].PRICE">
											<label>
												경유 가격
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
										</ScInput>
									</div>
									<div class="uk-width-1-3">
										<ScInput v-model="sendData.oilPrice[2].PRICE">
											<label>
												고급휘발유 가격
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
										</ScInput>
									</div>
									<div class="uk-width-1-3">
										<ScInput v-model="sendData.oilPrice[3].PRICE">
											<label>
												실내등유 가격
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
										</ScInput>
									</div>
									<div class="uk-width-1-3">
										<ScInput v-model="sendData.oilPrice[4].PRICE">
											<label>
												자동차부탄 가격
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
										</ScInput>
									</div>
									<h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
										주소 입력
									</h5>
									<div class="uk-width-1-1 uk-flex" style="justify-content: space-around; align-items: center">
										<div class="uk-width-5-6">
											<ScInput v-model="sendData.address" class="uk-flex-1" :error-state="$v.sendData.address.$error" :validator="$v.sendData.address">
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
										<a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline sc-button-large" @click.prevent="searchPlace(sendData.address)">
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
									<!--    주유소 이미지           -->
									<div class="uk-width-1-1">
										<h5 class="uk-heading-bullet uk-margin-top">주유소 이미지 등록</h5>
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
	import {required, integer} from 'vuelidate/lib/validators'
	import RatingList from "@/components/common/RatingList"
	import Select2 from "@/components/Select2";
	import PrettyCheck from 'pretty-checkbox-vue/check';
	export default {
		components: {
			Select2,
			ScInput,
			ScCard,
			VueUploadMultipleImage,
			ScCardAction,
			RatingList,
			PrettyCheck
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
					uid: '',
					gasStationName: '', //주유소명
					gasStationUid:'', //주유소 Uid
					brandCode: '', //브랜드코드명
					gasStationType: '',
					address:'', //주소
					sido:'',
					sigungu:'',
					tel:'', //전화번호
					lat: null, //위도
					lon: null, //경도
					isCarWash : true,
					isConvenience: true,
					isKpetro:true,
					picture: [],
					oilPrice:[
						{PRODCD:'B027', //휘발유
							PRICE:'0'},
						{PRODCD:'D047', //경유
							PRICE:'0'},
						{PRODCD:'B034', //고급휘발유
							PRICE:'0'},
						{PRODCD:'C004', //실내등유
							PRICE:'0'},
						{PRODCD:'K015', //자동차부탄
							PRICE:'0'}],
					brandCodeOpts:[],
					gasStationTypeOpts:[]
				}
			}
		},
		validations: {
			sendData: {
				gasStationName:{
					required
				},
				gasStationUid:{
					required
				},
				tel:{
					required,
					integer
				},
				brandCode:{
					required
				},
				gasStationType:{
					required
				},
				address:{
					required
				},
				lat: {
					required
				},
				lon: {
					required
				}
			}
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-gasStation-form', (data) => {
				vm.settingForm(data)
			})
			this.$nuxt.$on('close-gasStation-form', () => {
				vm.closeForm()
			})
		},
		async beforeMount() {
			this.sendData = this.defaultForm
			let code = await this.$axios.$post(this.config.apiUrl + '/codes')
			this.brandCodeOpts = this.convertSelectJson(code.data.brandCodeOpts)
			this.gasStationTypeOpts = this.convertSelectJson(code.data.gasStationTypeOpts)
		},
		beforeDestroy() {
			this.$nuxt.$off('open-gasStation-form')
			this.$nuxt.$off('close-gasStation-form')
		},
		methods: {
			selectAddr(searchItem) {
				this.$axios.$post(this.config.apiUrl + '/searchLocal', {address: searchItem.address}).then(async res => {
					this.callNotification("검색을 완료하였습니다.")
					this.sendData.address = res.data.addresses[0].jibunAddress
					this.sendData.lat = res.data.addresses[0].x
					this.sendData.lon = res.data.addresses[0].y
					let tmpAddr = res.data.addresses[0].jibunAddress.split(" ")
					if(tmpAddr[0] === '세종특별자치시'){
						this.sendData.sido = tmpAddr[0]
						this.sendData.sigungu = tmpAddr[0]
					}else{
						this.sendData.sido = tmpAddr[0]
						this.sendData.sigungu = tmpAddr[1]
					}
					this.searchAddr=[]
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			searchPlace(searchString) {
				if (!searchString) {
					this.callAlertError("주소가 입력되지 않았습니다.")
				}else{
					this.$axios.$post(this.config.apiUrl + '/searchList', {keyword: searchString, count: 5}).then(async res => {
						this.callNotification('목록을 가져왔습니다.')
						this.searchAddr = res.data.items
					}).finally(() => {
						this.submitStatus = 'OK'
					})
				}
			},
			openNewForm(siteUid, type) {
				this.$nuxt.$emit('open-rate-list', siteUid, type)
			},
			//multi image upload////////////////////////////////////////////////
			uploadImageSuccess(formData, index, fileList) {
				formData.append('dir', 'site')
				this.$axios.$post(this.config.apiUrl + '/uploads/', formData).then(response => {
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
				this.$axios.$post(this.config.apiUrl + '/uploads/', formData).then(response => {
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
				//console.log('open')
				this.$v.$reset()
				this.tempImage = []
				if (props) {
					this.sendData = JSON.parse(JSON.stringify(props.data))
					let oilPrice = this.sendData.oilPrice
					//if(oilPrice === null){
					this.sendData.oilPrice = this.defaultForm.oilPrice
					// }else{
					// 	console.log(this.defaultForm.oilPrice.length)
					// 	for (let i =0; i < this.defaultForm.oilPrice.length; i++){
					// 		console.log(oilPrice[i])
					// 		oilPrice[i].PRODCD = this.defaultForm.oilPrice[i].PRODCD
					// 		console.log(oilPrice[i].PRICE)
					// 	}
					// }

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
				this.$nuxt.$emit('reset-gasStation-list')
			},
			deleteForm() {
				this.$axios.$delete(this.config.apiUrl + '/gasStations/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('삭제하였습니다.')
					this.$nuxt.$emit('fetch-gasStation-list', res.data.uid)
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
				this.$axios.$post(this.config.apiUrl + '/gasStations', this.sendData).then(async res => {
					this.callNotification('계정을 생성하였습니다.')
					this.$nuxt.$emit('fetch-gasStation-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			putForm() {
				this.$axios.$put(this.config.apiUrl + '/gasStations/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('수정하였습니다.')
					this.$nuxt.$emit('fetch-gasStation-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			convertSelectJson(json){
				let dataArray = []
				Object.entries(json).map(function(obj){
					let data = {}
					data.id = obj[0]
					data.text = obj[1]
					dataArray.push(data)
				})
				return dataArray
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
