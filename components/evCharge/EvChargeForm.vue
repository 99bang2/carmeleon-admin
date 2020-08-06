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
								전기차충전소 정보관리
							</a>
						</li>
						<li>
							<a href="javascript:void(0)" @click.prevent="openNewForm(sendData.uid, 3)">
								전기차충전소 리뷰보기
							</a>
						</li>
					</ul>
					<ul class="uk-switcher">
						<li>
							<div class="uk-accordion-content">
								<form class="uk-grid-small uk-grid" data-uk-grid>
									<!--	최대 가용 대수 , 가격  -->
									<h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
										전기차충전소 정보
									</h5>
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.statNm" :error-state="$v.sendData.statNm.$error"
												 :validator="$v.sendData.statNm">
											<label>
												충전소명
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip"
												  data-uk-icon="icon: pencil"/>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.statNm.required">
												충전소명을 입력하세요
											</li>
										</ul>
									</div>
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.statId" :error-state="$v.sendData.statId.$error"
												 :validator="$v.sendData.statId" :read-only="sendData.uid > 0">
											<label>
												충전소ID
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip"
												  data-uk-icon="icon: pencil"/>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.statId.required">
												충전소ID를 입력하세요
											</li>
										</ul>
									</div>
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.chgerId" :error-state="$v.sendData.chgerId.$error"
												 :validator="$v.sendData.chgerId" :read-only="sendData.uid > 0">
											<label>
												충전기ID
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip"
												  data-uk-icon="icon: pencil"/>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.chgerId.required">
												충전기ID를 입력하세요
											</li>
										</ul>
									</div>
									<div class="uk-width-1-2">
										<Select2
											v-model="sendData.chgerType"
											:options="chgerTypeOpts"
											:settings="{ 'width': '100%', 'placeholder': '충전기타입' }"
											:error-state="$v.sendData.chgerType.$error"
										/>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.chgerType.required">
												충전기타입을 선택하세요.
											</li>
										</ul>
									</div>
									<h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
										상세정보 입력
									</h5>
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.useTime">
											<label>
												이용시간
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip"
												  data-uk-icon="icon: clock"/>
										</ScInput>

									</div>
									<div class="uk-width-1-2">
										<Select2
											v-model="sendData.stat"
											:options="statTypeOpts"
											:settings="{ 'width': '100%', 'placeholder': '충전기상태' }"
											:error-state="$v.sendData.stat.$error"
										/>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.stat.required">
												충전기상태를 변경하세요.
											</li>
										</ul>
									</div>
									<div class="uk-width-1-2">
										<ScInput v-model="sendData.powerType"
												 :error-state="$v.sendData.powerType.$error"
												 :validator="$v.sendData.powerType">
											<label>
												충전량 유형
											</label>
											<span slot="icon" class="uk-form-icon uk-form-icon-flip"
												  data-uk-icon="icon: bolt"/>
										</ScInput>
										<ul class="sc-vue-errors">
											<li v-if="!$v.sendData.powerType.required">
												충전량 유형을 입력하세요
											</li>
										</ul>
									</div>
									<h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
										주소 입력
									</h5>
									<div class="uk-width-1-1 uk-flex"
										 style="justify-content: space-around; align-items: center">
										<div class="uk-width-5-6">
											<ScInput v-model="sendData.addr" class="uk-flex-1"
													 :error-state="$v.sendData.addr.$error"
													 :validator="$v.sendData.addr">
												<label>
													주소
												</label>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!$v.sendData.addr.required">
													주소를 입력하세요.
												</li>
											</ul>
										</div>
										<a href="javascript:void(0)"
										   class="sc-button sc-button-icon sc-button-outline sc-button-large"
										   @click.prevent="searchPlace(sendData.addr)">
											<span data-uk-icon="icon: search"></span>
										</a>
									</div>
									<div v-if="searchAddr" class="uk-width-1-1" style="margin: 15px; padding: 0px;">
										<ul class="uk-list uk-list-divider uk-list-collapse">
											<li class="selectAddr" v-for="(item,index) in searchAddr" v-bind:key=index
												style="justify-content: space-between" type="button"
												@click="selectAddr(item)">
												<span v-html="item.title"></span>
												<span class="selectIcon" data-uk-icon="icon: check"></span>
											</li>
										</ul>
									</div>
									<!--    세차장 이미지           -->
									<div class="uk-width-1-1">
										<h5 class="uk-heading-bullet uk-margin-top">전기차충전소 이미지 등록</h5>
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
	import Convert from "@/plugins/convertJson";

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
					uid: '',
					statNm: '', //사업장명
					statId: '', //사업장ID
					chgerId: '', //충전기ID
					chgerType: '', // 충전기타입
					addr: '', //주소
					lat: null, //위도
					lon: null, //경도
					sido: '', //시도
					sigungu: '', //시군구
					useTime: '', // 이용시간
					busiId: '', 		// 기관아이디
					busiNm: '',		// 운영기관명
					busiCall: '', //연락처
					stat: null, // 충전기타입
					statUpdDt: '', // 상태갱신일시
					powerType: '', // 충전량
					picture: [],
					chgerTypeOpts: [],
					statTypeOpts: []
				}
			}
		},
		validations: {
			sendData: {
				statNm: {
					required
				},
				statId: {
					required
				},
				chgerId: {
					required
				},
				chgerType: {
					required
				},
				stat: {
					required
				},
				addr: {
					required
				},
				powerType: {
					required
				}
			}
		},
		created() {
			let vm = this
			this.$nuxt.$on('open-evCharge-form', (data) => {
				vm.settingForm(data)
			})
			this.$nuxt.$on('close-evCharge-form', () => {
				vm.closeForm()
			})
		},
		async beforeMount() {
			this.sendData = this.defaultForm
			let code = await this.$axios.$post(this.config.apiUrl + '/codes')
			this.chgerTypeOpts = Convert.convertJson(code.data.chgerTypeOpts,'select')
			this.statTypeOpts = Convert.convertJson(code.data.statTypeOpts,'select')
		},
		beforeDestroy() {
			this.$nuxt.$off('open-evCharge-form')
			this.$nuxt.$off('close-evCharge-form')
		},
		methods: {
			selectAddr(searchItem) {
				this.$axios.$post(this.config.apiUrl + '/searchLocal', {address: searchItem.address}).then(async res => {
					this.callNotification("검색을 완료하였습니다.")
					this.sendData.addr = res.data.addresses[0].jibunAddress
					this.sendData.lat = res.data.addresses[0].x
					this.sendData.lon = res.data.addresses[0].y
					let tmpAddr = res.data.addresses[0].jibunAddress.split(" ")
					if (tmpAddr[0] === '세종특별자치시') {
						this.sendData.sido = tmpAddr[0]
						this.sendData.sigungu = tmpAddr[0]
					} else {
						this.sendData.sido = tmpAddr[0]
						this.sendData.sigungu = tmpAddr[1]
					}
					this.searchAddr = []
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			searchPlace(searchString) {
				if (!searchString) {
					this.callAlertError("주소가 입력되지 않았습니다.")
				} else {
					this.$axios.$post(this.config.apiUrl + '/searchList', {
						keyword: searchString,
						count: 5
					}).then(async res => {
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
				formData.append('dir', 'evCharge')
				this.$axios.$post(this.config.apiUrl + '/uploads/', formData).then(response => {
					this.sendData.picture[index] = response.data;
				})
			},
			beforeRemove(index, done, fileList) {
				if (confirm("remove image")) {
					done()
					this.sendData.picture.splice(index, 1);
				} else {
				}
			},
			editImage(formData, index, fileList) {
				formData.append('dir', 'evCharge')
				this.$axios.$post(this.config.apiUrl + '/uploads/', formData).then(response => {
					this.sendData.picture[index] = response.data;
				})
			},
			markIsPrimary(index, fileList) {
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
							if (i === 0) {
								img.default = 1
								img.highlight = 1
							} else {
								img.default = 0
								img.highlight = 0
							}
							img.path = this.sendData.picture[i]
							this.tempImage[i] = img
						}
					} else {
						this.sendData.picture = []
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
				this.$nuxt.$emit('reset-evCharge-list')
			},
			deleteForm() {
				this.$axios.$delete(this.config.apiUrl + '/evCharges/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('삭제하였습니다.')
					this.$nuxt.$emit('fetch-evCharge-list', res.data.uid)
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
				this.$axios.$post(this.config.apiUrl + '/evCharges', this.sendData).then(async res => {
					this.callNotification('계정을 생성하였습니다.')
					this.$nuxt.$emit('fetch-evCharge-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
			putForm() {
				this.$axios.$put(this.config.apiUrl + '/evCharges/' + this.sendData.uid, this.sendData).then(async res => {
					this.callNotification('수정하였습니다.')
					this.$nuxt.$emit('fetch-evCharge-list', res.data.uid)
				}).finally(() => {
					this.submitStatus = 'OK'
				})
			},
		}
	}
</script>

<style lang="scss">
	@import 'assets/scss/vue/_pretty_checkboxes';

	.selectAddr {
		float: right !important;
	}

	.selectIcon {
		display: none;
	}

	.selectAddr:hover {
		cursor: pointer;
		background-color: #4db6ac;
	}

	.selectAddr:hover > .selectIcon {
		display: block;
	}

	.sc-vue-errors li {
		font-size: 12px;
	}
</style>
