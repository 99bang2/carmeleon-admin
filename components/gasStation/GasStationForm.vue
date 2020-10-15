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
                                        <ScInput v-model="sendData.gasStationName"
                                                 :error-state="$v.sendData.gasStationName.$error"
                                                 :validator="$v.sendData.gasStationName">
                                            <label>
                                                주유소명
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: pencil"/>
                                        </ScInput>
                                        <ul class="sc-vue-errors">
                                            <li v-if="!$v.sendData.gasStationName.required">
                                                주유소명을 입력하세요
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="uk-width-1-2">
                                        <ScInput v-model="sendData.gasStationUid"
                                                 :error-state="$v.sendData.gasStationUid.$error"
                                                 :validator="$v.sendData.gasStationUid">
                                            <label>
                                                주유소 ID
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: pencil"/>
                                        </ScInput>
                                        <ul class="sc-vue-errors">
                                            <li v-if="!$v.sendData.gasStationUid.required">
                                                주유소ID를 입력하세요
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="uk-width-1-1">
                                        <ScInput v-model="sendData.tel" :error-state="$v.sendData.tel.$error"
                                                 :validator="$v.sendData.tel">
                                            <label>
                                                주유소 전화번호
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: receiver"/>
                                        </ScInput>
                                        <ul class="sc-vue-errors">
                                            <li v-if="!$v.sendData.tel.required">
                                                전화번호를 입력하세요
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
                                    <h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
                                        태그 정보
                                    </h5>
                                    <div class="uk-width-1-1" style="display: flex; justify-content: space-around; padding: 10px 0;">
                                        <div>
                                            <PrettyCheck v-model="sendData.isCarWash" class="p-switch">
                                                {{sendData.isCarWash?"세차장 있음":"세차장 없음"}}
                                            </PrettyCheck>
                                        </div>
                                        <div>
                                            <PrettyCheck v-model="sendData.isConvenience" class="p-switch">
                                                {{sendData.isConvenience?"편의점 있음":"편의점 없음"}}
                                            </PrettyCheck>
                                        </div>
                                        <div>
                                            <PrettyCheck v-model="sendData.isKpetro" class="p-switch">
                                                {{sendData.isKpetro?"품질인증":"&nbsp;미인증&nbsp;"}}
                                            </PrettyCheck>
                                        </div>
                                        <div>
                                            <PrettyCheck v-model="sendData.isSelf" class="p-switch">
                                                {{sendData.isSelf?"셀프":"&nbsp;셀프아님&nbsp;"}}
                                            </PrettyCheck>
                                        </div>
                                    </div>
                                    <h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
                                        유가 정보
                                    </h5>
                                    <div class="uk-width-1-2">
                                        <ScInput v-model="sendData.Gasoline">
                                            <label>
                                                휘발유 가격
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: tag"/>
                                        </ScInput>
                                    </div>
                                    <div class="uk-width-1-2">
                                        <ScInput v-model="sendData.Diesel">
                                            <label>
                                                경유 가격
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: tag"/>
                                        </ScInput>
                                    </div>
                                    <div class="uk-width-1-2">
                                        <ScInput v-model="sendData.PremiumGasoline">
                                            <label>
                                                고급휘발유 가격
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: tag"/>
                                        </ScInput>
                                    </div>
                                    <div class="uk-width-1-2">
                                        <ScInput v-model="sendData.lpg">
                                            <label>
                                                LPG
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: tag"/>
                                        </ScInput>
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
                                    <!--    주유소 이미지           -->
                                    <div class="uk-width-1-1">
                                        <h5 class="uk-heading-bullet uk-margin-top">주유소 이미지 등록</h5>
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
    import {required} from 'vuelidate/lib/validators'
    import RatingList from "@/components/common/RatingList"
    import Select2 from "@/components/Select2";
    import PrettyCheck from 'pretty-checkbox-vue/check';
    import Convert from "@/plugins/convertJson";

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
                file_list:[],
                deleteArray: [],
                editArray: [],
                searchAddr: [],
                tagDetect:[
                    {tagBoolean : "isCarWash", tagName: "carWash"},
                    {tagBoolean : "isConvenience", tagName: "cvs"},
                    {tagBoolean : "isKpetro", tagName: "kpetro"},
                    {tagBoolean : "isSelf", tagName: "self"}
                    ],
                defaultForm: {
                    uid: '',
                    gasStationName: '', //주유소명
                    gasStationUid: '', //주유소 Uid
                    brandCode: '', //브랜드코드명
                    gasStationType: '',
                    address: '', //주소
                    sido: '',
                    sigungu: '',
                    tel: '', //전화번호
                    lat: null, //위도
                    lon: null, //경도
                    isCarWash: false, //"세차장 , carWash"
                    isConvenience: false, // "편의점 , cvs"
                    isKpetro: false, // "품질인증, kpetro"
                    isSelf: false, // "셀프주유소 , self"
                    picture: [],
                    Gasoline: null,
                    Diesel: null,
                    PremiumGasoline: null,
                    lpg:null,
                    brandCodeOpts: [],
                    gasStationTypeOpts: [],
                    tag:[]
                }
            }
        },
        validations: {
            sendData: {
                gasStationName: {
                    required
                },
                gasStationUid: {
                    required
                },
                tel: {
                    required
                },
                brandCode: {
                    required
                },
                gasStationType: {
                    required
                },
                address: {
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
            this.brandCodeOpts = Convert.convertJson(code.data.brandCodeOpts, 'select')
            this.gasStationTypeOpts = Convert.convertJson(code.data.gasStationTypeOpts, 'select')
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
            uploadImageSuccess(formData, index, fileList) {
                for(let item of formData.entries()) {
                    this.file_list.push(item [1]);
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
                    this.file_list[index] = item [1];
                }
            },
            markIsPrimary(index, fileList) {
                let temp = this.sendData.picture[0]
                this.sendData.picture[0] = this.sendData.picture[index]
                this.sendData.picture[index] = temp
            },

            settingForm(props) {
                this.$v.$reset()
                this.tempImage = []
                if (props) {
                    this.sendData = JSON.parse(JSON.stringify(props.data))
                    this.tagDetect.map(t => {
                        console.log(t)
                        if(this.sendData.tag.includes(t.tagName)){
                            this.sendData[t.tagBoolean] = true
                        }
                    })
                    this.file_list = this.sendData.picture
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
                console.log(this.sendData)
                this.cardFormClosed = true
                setTimeout(() => {
                    this.cardFormClosed = false
                }, 100)
            },
            closeForm() {
                this.cardFormClosed = true
                this.$nuxt.$emit('reset-gasStation-list')
            },
            async deleteForm() {
                if (this.sendData.picture.length > 0) {
                    for (let index in this.sendData.picture) {
                        let url = new URL(this.sendData.picture[index])
                        let key = url.pathname.replace('/carmeleon/', '')
                        await this.$objectStorage.deleteObject(key)
                    }
                }
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
            async postForm() {
                this.tagDetect.map(t => {
                    if(this.sendData[t.tagBoolean]){
                        this.sendData.tag.push(t.tagName)
                    }
                })
                if(this.file_list.length > 0){
                    for(let i =0 ; i< this.file_list.length; i++){
                        if(this.file_list[i] !== undefined){
                            if (this.isFileImage(this.file_list[i])) {
                                let prefix = this.uuidV4()
                                let url = await this.$objectStorage.uploadFile('gasStation', this.file_list[i], prefix)

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
                this.$axios.$post(this.config.apiUrl + '/gasStations', this.sendData).then(async res => {
                    this.callNotification('계정을 생성하였습니다.')
                    this.$nuxt.$emit('fetch-gasStation-list', res.data.uid)
                }).finally(() => {
                    this.submitStatus = 'OK'
                })
            },
            async putForm() {
                this.tagDetect.map(t => {
                    if(this.sendData[t.tagBoolean]){
                        if(!this.sendData.tag.includes(t.tagName)){
                            this.sendData.tag.push(t.tagName)
                        }
                    }else {
                        if(this.sendData.tag.includes(t.tagName)) {
                            this.sendData.tag.splice(this.sendData.tag.indexOf(t.tagName), 1)
                        }
                    }
                })
                if(this.file_list.length > 0){
                    this.sendData.picture = []
                    for(let i =0 ; i< this.file_list.length; i++){
                        if(this.file_list[i] !== undefined){
                            if (typeof this.file_list[i] !== 'string' && this.isFileImage(this.file_list[i])) {
                                let prefix
                                if(typeof this.editArray[i] !== 'undefined'){
                                    let url = new URL(this.editArray[i])
                                    let modify_string = url.pathname.replace('/carmeleon/admin/gasStation/', '')
                                    let _lastDot = modify_string.lastIndexOf('.');
                                    prefix = modify_string.substring(0, _lastDot)
                                }else{
                                    prefix= this.uuidV4()
                                }
                                let url = await this.$objectStorage.uploadFile('gasStation', this.file_list[i], prefix)
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

                this.$axios.$put(this.config.apiUrl + '/gasStations/' + this.sendData.uid, this.sendData).then(async res => {
                    this.callNotification('수정하였습니다.')
                    this.$nuxt.$emit('fetch-gasStation-list', res.data.uid)
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
