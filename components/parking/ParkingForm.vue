<template>
    <div>
        <Transition name="slide-bottom-medium">
            <ScCard v-if="!cardFormClosed" style="min-height: 745px">
                <ScCardHeader separator>
                    <div class="uk-flex uk-flex-middle">
                        <div class="uk-flex-1">
                            <ScCardTitle>
                                <i class="mdi" :class="[{'mdi-details' : sendData.uid}, {'mdi-plus': !sendData.uid}]"/>
                                {{ sendData.uid ? '상세' : '등록' }}
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
                                주차장정보
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0)" @click.prevent="openNewForm(sendData.uid,0)">
                                주차장리뷰
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0)" @click.prevent="openProductForm(sendData.uid)">
                                주차장상품
                            </a>
                        </li>
                        <li>
                            <a href="javascript:void(0)" @click.prevent="openDicountForm(sendData.uid)">
                                상품할인율
                            </a>
                        </li>
                    </ul>
                    <ul class="uk-switcher">
                        <li>
                            <div class="uk-margin-top uk-text-center">
                                <button class="sc-button sc-button-primary uk-width-1-1" :disabled="submitStatus === 'PENDING'"
                                        @click="submitForm">
                                    {{ sendData.uid ? '수정' : '생성' }}
                                </button>
                                <!--                                <button v-if="sendData.uid" class="sc-button sc-button-primary"-->
                                <!--                                        :disabled="submitStatus === 'PENDING'"-->
                                <!--                                        @click="deleteForm">-->
                                <!--                                    삭제-->
                                <!--                                </button>-->
                            </div>
                            <div class="uk-accordion-content">
                                <form class="uk-grid-small uk-grid" data-uk-grid>
                                    <!-- 가격  -->
                                    <div class="uk-width-1-1">
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
                                    <!--	주소입력 -->
                                    <div class="uk-width-1-1 uk-flex"
                                         style="justify-content: space-around; align-items: center">
                                        <div class="uk-width-5-6">
                                            <ScInput v-model="sendData.address" class="uk-flex-1"
                                                     :error-state="$v.sendData.lat.$error"
                                                     :validator="$v.sendData.lat">
                                                <label>
                                                    주소
                                                </label>
                                            </ScInput>
                                            <ul class="sc-vue-errors">
                                                <li v-if="!$v.sendData.lat.required">
                                                    주소를 검색 후 선택하세요.
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
                                            <li class="selectAddr" v-for="(item, index) in searchAddr" v-bind:key=index
                                                style="justify-content: space-between" type="button"
                                                @click="selectAddr(item)">
                                                <span v-html="item.title"></span>
                                                <span class="selectIcon" data-uk-icon="icon: check"></span>
                                            </li>
                                        </ul>
                                    </div>
                                    <!--    시간 안내             -->
                                    <div class="uk-width-1-2">
                                        <ScTextarea
                                                v-model="sendData.timeInfo"
                                                :cols="30"
                                                :rows="4"
                                                :autosize="true"
                                                mode="outline"
                                        >
                                            <label>시간 안내 입력</label>
                                        </ScTextarea>
                                    </div>
                                    <!--    요금 안내               -->
                                    <div class="uk-width-1-2">
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
                                    <!--    주차장 이미지           -->
                                    <div class="uk-width-1-2">
                                        <h6>주차장 이미지 등록</h6>
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
                                    <!--  평가여부     추천여부     -->
                                    <div class="uk-width-1-2">
                                        <h6>평가여부</h6>
                                        <input id="switch-css-rate" v-model="sendData.isRate" type="checkbox"
                                               class="sc-switch-input">
                                        <label for="switch-css-rate" class="sc-switch-label"
                                               style="margin-top:15px;margin-left:15px;">
                                            <span class="sc-switch-toggle-on">평가가능</span>
                                            <span class="sc-switch-toggle-off">평가불가능</span>
                                        </label>
                                        <h6>추천여부</h6>
                                        <input id="switch-css-recommend" v-model="sendData.isRecommend" type="checkbox"
                                               class="sc-switch-input">
                                        <label for="switch-css-recommend" class="sc-switch-label"
                                               style="margin-top:15px;margin-left:15px;">
                                            <span class="sc-switch-toggle-on">추천</span>
                                            <span class="sc-switch-toggle-off">미추천</span>
                                        </label>
                                    </div>
                                    <!--	siteType, name  -->
                                    <div class="uk-width-1-2">
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
                                    <!--	최대 가용 대수   -->
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
                                    <!--	휴대전화     -->
                                    <div class="uk-width-1-2">
                                        <ScInput v-model="sendData.autoPassCode">
                                            <label>
                                                HOST CODE(자동결제)
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: phone"/>
                                        </ScInput>
                                    </div>
                                    <!--	이메일     -->
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
                                    <!--    담당자이름  -->
                                    <div class="uk-width-1-2">
                                        <ScInput v-model="sendData.manager">
                                            <label>
                                                담당자
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: user"/>
                                        </ScInput>
                                    </div>
                                    <!--    운영 시간               -->
                                    <div class="uk-width-1-1">
                                        <ScInput v-model="sendData.operationTime"
                                                 :error-state="$v.sendData.operationTime.$error"
                                                 :validator="$v.sendData.operationTime">
                                            <label>
                                                운영시간
                                            </label>
                                            <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                                  data-uk-icon="icon: clock"/>
                                        </ScInput>
                                        <ul class="sc-vue-errors">
                                            <li v-if="!$v.sendData.operationTime.required">
                                                운영시간을 입력하세요.
                                            </li>
                                        </ul>
                                    </div>
                                    <!--    운영사 유형    -->
                                    <div v-if="this.$auth.$storage.state.user.grade === 0" class="uk-width-1-1">
                                        <Select2
                                                v-model="sendData.siteType"
                                                :options="siteOpts"
                                                :settings="{ 'width': '100%', 'placeholder': '운영사 유형' }"
                                                :error-state="$v.sendData.siteType.$error"
                                        />
                                        <ul class="sc-vue-errors">
                                            <li v-if="!$v.sendData.siteType.required">
                                                운영사 유형을 선택하세요.
                                            </li>
                                        </ul>
                                    </div>
                                    <!--    경고문구           -->
                                    <div class="uk-width-1-2">
                                        <ScTextarea
                                                v-model="sendData.message"
                                                :cols="30"
                                                :rows="4"
                                                :autosize="true"
                                                mode="outline"
                                        >
                                            <label>경고 문구 입력</label>
                                        </ScTextarea>
                                    </div>
                                    <!--    주차장 안내             -->
                                    <div class="uk-width-1-2">
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
                                    <!--    판매여부  운영여부   -->
                                    <div class="uk-width-1-2" style="display: flex; flex-direction: column; justify-content: flex-start">
                                        <div style="margin-bottom:5%">
                                            <h6>판매여부</h6>
                                            <input id="switch-css-buy" v-model="sendData.isBuy" type="checkbox"
                                                   class="sc-switch-input">
                                            <label for="switch-css-buy" class="sc-switch-label"
                                                   style="margin-top:15px;margin-left:15px;">
                                                <span class="sc-switch-toggle-on">판매가능</span>
                                                <span class="sc-switch-toggle-off">판매불가능</span>
                                            </label>
                                        </div>
                                        <div style="margin-bottom:5%">
                                            <h6>운영여부</h6>
                                            <input id="switch-css" v-model="sendData.isActive" type="checkbox"
                                                   class="sc-switch-input">
                                            <label for="switch-css" class="sc-switch-label"
                                                   style="margin-top:15px;margin-left:15px;">
                                                <span class="sc-switch-toggle-on">운영중</span>
                                                <span class="sc-switch-toggle-off">미운영</span>
                                            </label>
                                        </div>
                                        <div>
                                            <h6>발렛주차여부</h6>
                                            <Select2
                                                    v-model="sendData.valetType"
                                                    :options="valetOpts"
                                                    :settings="{ 'width': '80%', 'placeholder': '발렛주차여부' }"
                                                    :error-state="$v.sendData.valetType.$error"
                                            />
                                        </div>
                                    </div>
                                    <!--    옵션태그-->
                                    <div class="uk-width-auto">
                                        <ul class="uk-list">
                                            <h6>옵션태그</h6>
                                            <li v-for="tag in optionTag" :key="tag.id">
                                                <PrettyCheck v-model="sendData.optionTag" :value="tag.value"
                                                             class="p-icon">
                                                    <i slot="extra" class="icon mdi mdi-check"></i>
                                                    {{ tag.name }}
                                                </PrettyCheck>
                                            </li>
                                        </ul>
                                    </div>
                                </form>
                            </div>
                        </li>
                        <li>
                            <RatingList></RatingList>
                        </li>
                        <li>
                            <ProductList></ProductList>
                        </li>
                        <li>
                            <DiscountList></DiscountList>
                        </li>
                    </ul>
                </ScCardBody>
            </ScCard>
        </Transition>
    </div>
</template>

<script>
import VueUploadMultipleImage   from 'vue-upload-multiple-image'
import { validationMixin }      from 'vuelidate'
import { email, required }      from 'vuelidate/lib/validators'
import PrettyCheck              from 'pretty-checkbox-vue/check'
import customValidators         from "@/plugins/vuelidateValidators"
import Convert                  from '@/plugins/convertJson'
import ScCard                   from "@/components/card/components/Card"
import ScInput                  from "@/components/Input"
import ScTextarea               from '@/components/Textarea'
import ScCardAction             from "@/components/card/components/CardActions"
import RatingList               from "@/components/common/RatingList"
import ProductList              from "@/components/common/ProductList"
import DiscountList             from "@/components/common/DiscountList"
import Select2                  from "@/components/Select2"

if (process.client) {
    require('~/plugins/inputmask')
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
        RatingList,
        ProductList,
        DiscountList
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
            file_list: [],
            deleteArray: [],
            editArray: [],
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
                timeInfo: '',
                accountUid: 0,
                paymentTag: [],
                brandTag: [],
                productTag: [],
                optionTag: [],
                carTag: [],
                picture: [],
                siteOpts: [],
                valetOpts: [],
                operationTime: '',
                message: '',
                isBuy: true,
                isRate: false,
                isRecommend: false,
                valetType: 0,
                autoPassCode: null,
            }
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
            },
            price: {
                required,
                integerFormatCheck: customValidators.integerFormatCheck()
            },
            lat: {
                required
            },
            lon: {
                required
            }, email: {
                email
            },
            accountUid: {
                required
            },
            operationTime: {
                required
            },
            valetType: {
                required
            }
        }
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
        if (this.$auth.$storage.state.user.grade !== 0) {
            this.sendData.siteType = this.$auth.$storage.state.user.uid - 2 //codes.json의 site key값과 일치하지 않아서 -2를 추가해준코드
            this.sendData.accountUid = this.$auth.$storage.state.user.uid - 2
        }
        let code = await this.$axios.$post(this.config.apiUrl + '/codes')
        this.siteOpts = Convert.convertJson(code.data.site, 'select')
        this.paymentTag = Convert.convertJson(code.data.paymentTag)
        this.brandTag = Convert.convertJson(code.data.brandTag)
        this.productTag = Convert.convertJson(code.data.productTag)
        this.optionTag = Convert.convertJson(code.data.optionTag)
        this.carTag = Convert.convertJson(code.data.carTag)
        this.valetOpts = [
            {
                id: 0,
                text: "일반"
            },
            {
                id: 1,
                text: "발렛 주차 가능"
            },
            {
                id: 2,
                text: "발렛만 가능"
            }
        ]
    },
    beforeDestroy() {
        this.$nuxt.$off('open-parking-form')
        this.$nuxt.$off('close-parking-form')
    },
    methods: {
        selectAddr(searchItem) {
            this.$axios.$post(this.config.apiUrl + '/searchLocal', {address: searchItem.address}).then(async res => {
                this.callNotification("검색을 완료하였습니다.")
                this.sendData.address = res.data.addresses[0].jibunAddress
                this.sendData.lat = res.data.addresses[0].y
                this.sendData.lon = res.data.addresses[0].x
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
            this.$nuxt.$emit(`open-rate-list`, siteUid, type)
        },
        openProductForm(siteUid) {
            this.$nuxt.$emit('open-product-list', siteUid)
        },
        openDicountForm(siteUid) {
            this.$nuxt.$emit('open-discount-list', siteUid)
        },
        async uploadImageSuccess(formData, index, fileList) {
            for (let item of formData.entries()) {
                this.file_list.push(item[1])
            }
        },
        beforeRemove(index, done, fileList) {
            if (confirm("remove image")) {
                done()
                if (typeof this.file_list[index] === 'string') {
                    this.deleteArray.push(this.file_list[index])
                }
                this.file_list.splice(index, 1)
            } else {
            }
        },
        editImage(formData, index, fileList) {
            if (typeof this.file_list[index] === 'string') {
                this.editArray[index] = this.file_list[index]
            }
            for (let item of formData.entries()) {
                this.file_list[index] = item[1]
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
            this.file_list = []
            this.editArray = []
            this.deleteArray = []
            if (props) {
                this.sendData = JSON.parse(JSON.stringify(props.data))
                this.sendData.parkingLot = this.sendData.parkingLot | 0
                this.file_list = this.sendData.picture || []
                this.sendData.optionTag = this.sendData.optionTag || []
                this.sendData.valetType = this.sendData.valetType || 0
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
            this.$nuxt.$emit('reset-parking-list')
        },
        async deleteForm() {

            if (this.sendData.picture.length > 0) {
                for (let index in this.sendData.picture) {
                    let url = new URL(this.sendData.picture[index])
                    let key = url.pathname.replace('/carmeleon/', '')
                    await this.$objectStorage.deleteObject(key)
                    await this.$objectStorage.deleteOriginal(key, 'parking')
                }
            }

            this.$axios.$delete(this.config.apiUrl + '/parkings/' + this.sendData.uid, this.sendData).then(async res => {
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
            this.sendData.accountUid = this.sendData.siteType
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
            if (this.file_list.length > 0) {
                for (let i = 0; i < this.file_list.length; i++) {
                    if (this.file_list[i] !== undefined) {
                        if (this.isFileImage(this.file_list[i])) {
                            let prefix = this.uuidV4()
                            let url = await this.$objectStorage.uploadFile('parking', this.file_list[i], prefix)
                            if (url) {
                                this.sendData.picture.push(url)
                            } else {
                                this.callAlertError("파일 업로드에 실패했습니다.")
                            }
                        } else {
                            //todo: not image file error
                        }
                    }
                }
            }

            this.$axios.$post(this.config.apiUrl + '/parkings', this.sendData).then(async res => {
                this.callNotification('계정을 생성하였습니다.')
                this.$nuxt.$emit('fetch-parking-list', res.data.uid)
            }).finally(() => {
                this.submitStatus = 'OK'
            })
        },
        async putForm() {
            if (this.file_list.length > 0) {
                this.sendData.picture = []
                for (let i = 0; i < this.file_list.length; i++) {
                    if (this.file_list[i] !== undefined) {
                        if (typeof this.file_list[i] !== 'string' && this.isFileImage(this.file_list[i])) {
                            let prefix = this.uuidV4()
                            let url = await this.$objectStorage.uploadFile('parking', this.file_list[i], prefix)
                            if (url) {
                                this.sendData.picture.push(url)
                            }
                        } else {
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
                    await this.$objectStorage.deleteOriginal(key, 'parking')
                }
            }

            this.$axios.$put(this.config.apiUrl + '/parkings/' + this.sendData.uid, this.sendData).then(async res => {
                this.callNotification('수정하였습니다.')
                this.$nuxt.$emit('fetch-parking-list', res.data.uid)
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
