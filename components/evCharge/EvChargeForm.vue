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
                                충전소 정보관리
                            </a>
                        </li>
                        <li class="uk-active">
                            <a href="javascript:void(0)" @click.prevent="openListForm()">
                                충전소 충전기관리
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0)" @click.prevent="openNewForm(sendData.uid, 3)">
                                충전소 리뷰보기
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
                                        <ScInput v-model="sendData.powerType"
                                                 :validator="$v.sendData.powerType">
                                            <label>
                                                충전량 유형
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: bolt"/>
                                        </ScInput>
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
                                            <VueUploadMultipleImage
                                                    @upload-success="uploadImageSuccess"
                                                    @before-remove="beforeRemove"
                                                    @edit-image="editImage"
                                                    @mark-is-primary="markIsPrimary"
                                                    :data-images="tempImage"
                                                    dragText="Drag Image"
                                                    browseText="Browse Image"
                                                    primaryText="Primary Image"
                                                    markIsPrimaryText="Set Primary Image"
                                            ></VueUploadMultipleImage>
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
                            <div class="uk-accordion-content">
                                <form class="uk-grid-small uk-grid" data-uk-grid>
                                    <!--	최대 가용 대수 , 가격  -->
                                    <h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
                                        전기차충전소 정보
                                    </h5>
                                    <div class="uk-width-1-1">
                                        <div v-if="sendData.evChargers.length > 0">
                                            <div v-for="(items, index) in sendData.evChargers" :key="index">
                                                <div v-if="items.stat ===2" class="uk-card uk-card-primary uk-card-header uk-flex uk-flex-around" style="padding:20px 0; margin: 5px 0;text-align: center;">
                                                    <div style="flex-grow:1; flex-basis: 0; color:white">{{items.chgerId}}</div>
                                                    <div style="flex-grow:2; flex-basis: 0; color:white">{{items.statName}}</div>
                                                    <div style="flex-grow:3; flex-basis: 0; color:white">{{items.chgerTypeName}}</div>
                                                </div>
                                                <div v-else-if="items.stat===3" class="uk-card uk-card-secondary uk-card-header uk-flex uk-flex-around" style="padding:20px 0; margin: 5px 0;text-align: center;">
                                                    <div style="flex-grow:1; flex-basis: 0; color:white">{{items.chgerId}}</div>
                                                    <div style="flex-grow:2; flex-basis: 0; color:white">{{items.statName}}</div>
                                                    <div style="flex-grow:3; flex-basis: 0; color:white">{{items.chgerTypeName}}</div>
                                                </div>
                                                <div v-else class="uk-card uk-card-default uk-card-header uk-flex uk-flex-around" style="padding:20px 0; margin: 5px 0;text-align: center;">
                                                    <div style="flex-grow:1; flex-basis: 0; color:darkslategray">{{items.chgerId}}</div>
                                                    <div style="flex-grow:2; flex-basis: 0; color:darkslategray">{{items.statName}}</div>
                                                    <div style="flex-grow:3; flex-basis: 0; color:darkslategray">{{items.chgerTypeName}}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </li>
                        <li>
                            <RatingList></RatingList>
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
    import RatingList from "@/components/common/RatingList"
    import Select2 from "@/components/Select2";
    import Convert from "@/plugins/convertJson";
    import moment from "@/plugins/moment"

    if (process.client) {
        require('~/plugins/inputmask');
    }
    export default {
        components: {
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
                    addr: '', //주소
                    lat: null, //위도
                    lon: null, //경도
                    sido: '', //시도
                    sigungu: '', //시군구
                    useTime: '', // 이용시간
                    busiId: '', 		// 기관아이디
                    busiNm: '',		// 운영기관명
                    busiCall: '', //연락처
                    powerType: '', // 충전량
                    picture: [],
                    evChargers: []
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
                addr: {
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
                    this.sendData.sido = tmpAddr[0]
                    tmpAddr[0] === '세종특별자치시' ? this.sendData.sigungu = tmpAddr[0] : this.sendData.sigungu = tmpAddr[1]
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
            openListForm() {
                //let code = this.$axios.$post(this.config.apiUrl + '/codes')
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
                this.$axios.$delete(this.config.apiUrl + '/evChargeStation/' + this.sendData.uid, this.sendData).then(async res => {
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
                this.$axios.$post(this.config.apiUrl + '/evChargeStations', this.sendData).then(async res => {
                    this.callNotification('계정을 생성하였습니다.')
                    this.$nuxt.$emit('fetch-evCharge-list', res.data.uid)
                }).finally(() => {
                    this.submitStatus = 'OK'
                })
            },
            putForm() {
                this.$axios.$put(this.config.apiUrl + '/evChargeStations/' + this.sendData.uid, this.sendData).then(async res => {
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
