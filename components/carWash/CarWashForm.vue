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
                                세차장 정보관리
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0)" @click.prevent="openNewForm(sendData.uid, 2)">
                                세차장 리뷰보기
                            </a>
                        </li>
                    </ul>
                    <ul class="uk-switcher">
                        <li>
                            <div class="uk-accordion-content">
                                <form class="uk-grid-small uk-grid" data-uk-grid>
                                    <!--	최대 가용 대수 , 가격  -->
                                    <h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
                                        세차장 정보
                                    </h5>
                                    <div class="uk-width-1-2">
                                        <ScInput v-model="sendData.carWashName"
                                                 :error-state="$v.sendData.carWashName.$error"
                                                 :validator="$v.sendData.carWashName">
                                            <label>
                                                사업장명
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: pencil"/>
                                        </ScInput>
                                        <ul class="sc-vue-errors">
                                            <li v-if="!$v.sendData.carWashName.required">
                                                사업장명을 입력하세요
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="uk-width-1-2">
                                        <ScInput v-model="sendData.closedDay"
                                                 :error-state="$v.sendData.closedDay.$error"
                                                 :validator="$v.sendData.closedDay">
                                            <label>
                                                휴무일
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: calendar"/>
                                        </ScInput>
                                        <ul class="sc-vue-errors">
                                            <li v-if="!$v.sendData.closedDay.required">
                                                휴무일을 입력하세요
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="uk-width-1-2">
                                        <Select2
                                                v-model="sendData.carWashIndustry"
                                                :options="industryOpts"
                                                :settings="{ 'width': '100%', 'placeholder': '사업장 업종명' }"
                                                :error-state="$v.sendData.carWashIndustry.$error"
                                        />
                                        <ul class="sc-vue-errors">
                                            <li v-if="!$v.sendData.carWashIndustry.required">
                                                사업장 업종명을 선택하세요.
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="uk-width-1-2">
                                        <Select2
                                                v-model="sendData.carWashType"
                                                :options="carWashTypeOpts"
                                                :settings="{ 'width': '100%', 'placeholder': '세차유형' }"
                                                :error-state="$v.sendData.carWashType.$error"
                                        />
                                        <ul class="sc-vue-errors">
                                            <li v-if="!$v.sendData.carWashType.required">
                                                세차유형을 선택하세요.
                                            </li>
                                        </ul>
                                    </div>
                                    <!-- 평일운영시간-->
                                    <div class="uk-width-1-1 uk-flex uk-flex-between">
                                        <div style="line-height: 40px">평일운영시간</div>
                                        <div class="uk-width-1-3">
                                            <ScInput v-model="sendData.weekdayOperOpenHhmm" v-flatpickr="timepicker24"
                                                     placeholder="평일운영시작시간" mode="outline"></ScInput>
                                        </div>
                                        <span style="line-height: 40px">~</span>
                                        <div class="uk-width-1-3">
                                            <ScInput v-model="sendData.weekdayOperCloseHhmm" v-flatpickr="timepicker24"
                                                     placeholder="평일운영종료시간" mode="outline"></ScInput>
                                        </div>
                                    </div>

                                    <!--	휴일운영시간      -->
                                    <div class="uk-width-1-1 uk-flex uk-flex-between">
                                        <div style="line-height: 40px">휴일운영시간</div>
                                        <div class="uk-width-1-3">
                                            <ScInput v-model="sendData.holidayOperOpenHhmm" v-flatpickr="timepicker24"
                                                     placeholder="휴일운영시작시간" mode="outline"></ScInput>
                                        </div>
                                        <span style="line-height: 40px">~</span>
                                        <div class="uk-width-1-3">
                                            <ScInput v-model="sendData.holidayOperCloseHhmm" v-flatpickr="timepicker24"
                                                     placeholder="휴일운영종료시간" mode="outline"></ScInput>
                                        </div>
                                    </div>
                                    <!-- 세차 요금정보 , 세차장 전화번호-->
                                    <div class="uk-width-1-2">
                                        <ScInput v-model="sendData.carWashChargeInfo"
                                                 :error-state="$v.sendData.carWashChargeInfo.$error"
                                                 :validator="$v.sendData.carWashChargeInfo">
                                            <label>
                                                세차요금정보
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: tag"/>
                                        </ScInput>
                                        <ul class="sc-vue-errors">
                                            <li v-if="!$v.sendData.carWashChargeInfo.required">
                                                세차요금정보를 입력하세요
                                            </li>
                                            <li v-if="!$v.sendData.carWashChargeInfo.integer">
                                                올바른 형식이 아닙니다.
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="uk-width-1-2">
                                        <ScInput v-model="sendData.phoneNumber"
                                                 :error-state="$v.sendData.phoneNumber.$error"
                                                 :validator="$v.sendData.phoneNumber">
                                            <label>
                                                세차장 전화번호
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: receiver"/>
                                        </ScInput>
                                        <ul class="sc-vue-errors">
                                            <li v-if="!$v.sendData.phoneNumber.required">
                                                전화번호를 입력하세요
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="uk-width-1-2">
                                        <input id="switch-css-rate" v-model="sendData.isRate" type="checkbox"
                                               class="sc-switch-input">
                                        <label for="switch-css-rate" class="sc-switch-label"
                                               style="margin-top:15px;margin-left:15px;">
                                            <span class="sc-switch-toggle-on">평가가능</span>
                                            <span class="sc-switch-toggle-off">평가불가능</span>
                                        </label>
                                    </div>
                                    <div class="uk-width-1-2">
                                        <input id="switch-css-recommend" v-model="sendData.isRecommend" type="checkbox"
                                               class="sc-switch-input">
                                        <label for="switch-css-recommend" class="sc-switch-label"
                                               style="margin-top:15px;margin-left:15px;">
                                            <span class="sc-switch-toggle-on">추천</span>
                                            <span class="sc-switch-toggle-off">미추천</span>
                                        </label>
                                    </div>
                                    <h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
                                        주소 입력
                                    </h5>
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
                                        <h5 class="uk-heading-bullet uk-margin-top">세차장 이미지 등록</h5>
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
    import {required, integer} from 'vuelidate/lib/validators'
    import RatingList from "@/components/common/RatingList"
    import Select2 from "@/components/Select2";
    import Convert from "@/plugins/convertJson";

    if (process.client) {
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
                file_list:[],
                deleteArray: [],
                editArray: [],
                searchAddr: [],
                defaultForm: {
                    uid: '',
                    carWashName: '', //사업장명
                    carWashIndustry: '', //사업장업종명
                    carWashType: '', //세차유형
                    address: '', //주소
                    sido: '',
                    sigungu: '',
                    closedDay: '', //휴무일
                    weekdayOperOpenHhmm: '', //평일운영시작시간
                    weekdayOperCloseHhmm: '', //평일운영종료시간
                    holidayOperOpenHhmm: '', //주말운영시작시간
                    holidayOperCloseHhmm: '', //주말운영종료시간
                    carWashChargeInfo: '', //세차요금정보
                    phoneNumber: '', //전화번호
                    lat: null, //위도
                    lon: null, //경도
                    picture: [],
                    industryOpts: [],
                    carWashTypeOpts: [],
                    isRate: false,
                    isRecommend:false
                }
            }
        },
        computed: {
            timepicker24() {
                return {
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true,
                }
            }
        },
        validations: {
            sendData: {
                closedDay: {
                    required
                },
                carWashName: {
                    required
                },
                carWashIndustry: {
                    required
                },
                carWashType: {
                    required
                },
                carWashChargeInfo: {
                    required,
                    integer
                },
                phoneNumber: {
                    required,
                },
                address: {
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
            let code = await this.$axios.$post(this.config.apiUrl + '/codes')
            this.industryOpts = Convert.convertJson(code.data.industryOpts, 'select')
            this.carWashTypeOpts = Convert.convertJson(code.data.carWashTypeOpts, 'select')
        },
        beforeDestroy() {
            this.$nuxt.$off('open-carWash-form')
            this.$nuxt.$off('close-carWash-form')
        },
        methods: {
            selectAddr(searchItem) {
                this.$axios.$post(this.config.apiUrl + '/searchLocal', {address: searchItem.address}).then(async res => {
                    this.callNotification("검색을 완료하였습니다.")
                    this.sendData.address = res.data.addresses[0].jibunAddress
                    this.sendData.lat = res.data.addresses[0].y
                    this.sendData.lon = res.data.addresses[0].x
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
            openNewForm(siteUid, type) {
                this.$nuxt.$emit('open-rate-list', siteUid, type)
            },
            //multi image upload////////////////////////////////////////////////
            uploadImageSuccess(formData, index, fileList) {
                for(let item of formData.entries()) {
                    this.file_list.push(item[1]);
                }
            },
            beforeRemove(index, done, fileList) {
                if (confirm("remove image")) {
                    done()
                    if(typeof this.file_list[index] === 'string'){
                        this.deleteArray.push(this.file_list[index])
                    }
                    this.file_list.splice(index, 1)
                } else {
                }
            },
            editImage(formData, index, fileList) {
                if(typeof this.file_list[index] === 'string'){
                    this.editArray[index] = this.file_list[index]
                }
                for(let item of formData.entries()) {
                    this.file_list[index] = item[1];
                }
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
                this.file_list = []
                this.editArray = []
                this.deleteArray = []
                if (props) {
                    this.sendData = JSON.parse(JSON.stringify(props.data))
                    this.file_list = this.sendData.picture || []
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
                this.$nuxt.$emit('reset-carWash-list')
            },
            async deleteForm() {
                if (this.sendData.picture.length > 0) {
                    for (let index in this.sendData.picture) {
                        let url = new URL(this.sendData.picture[index])
                        let key = url.pathname.replace('/carmeleon/', '')
                        await this.$objectStorage.deleteObject(key)
                    }
                }
                this.$axios.$delete(this.config.apiUrl + '/carWashes/' + this.sendData.uid, this.sendData).then(async res => {
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
            async postForm() {
                if(this.file_list.length > 0){
                    for(let i =0 ; i< this.file_list.length; i++){
                        if(this.file_list[i] !== undefined){
                            if (this.isFileImage(this.file_list[i])) {
                                let prefix = this.uuidV4()
                                let url = await this.$objectStorage.uploadFile('carWash', this.file_list[i], prefix)

                                if (url) {
                                    this.sendData.picture.push(url)
                                } else {
                                    //todo: file upload error
                                }
                            } else {
                                //todo: not image file error
                            }
                        }
                    }
                }
                this.$axios.$post(this.config.apiUrl + '/carWashes', this.sendData).then(async res => {
                    this.callNotification('계정을 생성하였습니다.')
                    this.$nuxt.$emit('fetch-carWash-list', res.data.uid)
                }).finally(() => {
                    this.submitStatus = 'OK'
                })
            },
            async putForm() {
                if(this.file_list.length > 0){
                    this.sendData.picture = []
                    for(let i =0 ; i< this.file_list.length; i++){
                        if(this.file_list[i] !== undefined){
                            if (typeof this.file_list[i] !== 'string' && this.isFileImage(this.file_list[i])) {
                                let prefix
                                if(typeof this.editArray[i] !== 'undefined'){
                                    let url = new URL(this.editArray[i])
                                    let modify_string = url.pathname.replace('/carmeleon/admin/carWash/', '')
                                    let _lastDot = modify_string.lastIndexOf('.');
                                    prefix = modify_string.substring(0, _lastDot)
                                }else{
                                    prefix= this.uuidV4()
                                }
                                let url = await this.$objectStorage.uploadFile('carWash', this.file_list[i], prefix)
                                if (url) {
                                    this.sendData.picture.push(url)
                                } else {
                                    //todo: file upload error
                                }
                            } else {
                                //todo: not image file error
                                this.sendData.picture.push(this.file_list[i])
                            }
                        }
                    }
                }

                if (this.deleteArray.length > 0) {
                    for (let index in this.deleteArray) {
                        let url = new URL(this.deleteArray[index])
                        let key = url.pathname.replace('/carmeleon/', '')
                        await this.$objectStorage.deleteObject(key)
                    }
                }

                this.$axios.$put(this.config.apiUrl + '/carWashes/' + this.sendData.uid, this.sendData).then(async res => {
                    this.callNotification('수정하였습니다.')
                    this.$nuxt.$emit('fetch-carWash-list', res.data.uid)
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
