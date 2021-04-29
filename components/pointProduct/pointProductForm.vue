<template>
    <div>
        <Transition name="slide-bottom-medium">
            <ScCard v-if="!cardFormClosed" style="min-height: 745px">
                <ScCardHeader separator>
                    <div class="uk-flex uk-flex-middle">
                        <div class="uk-flex-1">
                            <ScCardTitle>
                                <i class="mdi"
                                   :class="{ 'mdi-coin' : sendData.uid, 'mdi-shape-circle-plus': !sendData.uid }"/>
                                포인트상품{{ sendData.uid ? '상세' : '생성' }}
                            </ScCardTitle>
                        </div>
                        <ScCardActions>
                            <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close"
                               @click.prevent="closeForm"/>
                        </ScCardActions>
                    </div>
                </ScCardHeader>
                <ScCardBody>
                    <div class="uk-accordion-content">
                        <form class="uk-grid-small uk-grid" data-uk-grid>
                            <div class="uk-width-1-2 uk-margin-small-bottom">
                                <div class="uk-margin uk-heading-hero" style="text-align: left; margin-left:5px; margin-bottom: 0px; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;">
                                    <span>상품구분</span>
                                </div>
                                <Select2 div-style="padding:0" v-model="sendData.productType" :options="productTypeOpts" :settings="{ 'width': '100%', 'placeholder': '상품구분' }"/>
                            </div>
                            <div class="uk-width-1-4">
                                <div class="uk-margin uk-heading-hero" style="text-align: left; margin-left:5px; margin-bottom: 0px; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;">
                                    <span>상품노출</span>
                                </div>
                                <input id="switch-css-active" v-model="sendData.isActive" type="checkbox" class="sc-switch-input">
                                <label for="switch-css-active" class="sc-switch-label" style="margin-top:5px;margin-left:15px;">
                                    <span class="sc-switch-toggle-on">노출</span>
                                    <span class="sc-switch-toggle-off">미노출</span>
                                </label>
                            </div>
                            <div class="uk-width-1-4">
                                <div class="uk-margin uk-heading-hero" style="text-align: left; margin-left:5px; margin-bottom: 0px; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;">
                                    <span>매진여부</span>
                                </div>
                                <input id="switch-css-soldout" v-model="sendData.isSoldOut" type="checkbox" class="sc-switch-input">
                                <label for="switch-css-soldout" class="sc-switch-label" style="margin-top:5px;margin-left:15px;">
                                    <span class="sc-switch-toggle-on">매진</span>
                                    <span class="sc-switch-toggle-off">구매가능</span>
                                </label>
                            </div>
                            <div class="uk-width-1-1 uk-margin-small-bottom">
                                <ScInput v-model="sendData.category" :error-state="$v.sendData.category.$error" :validator="$v.sendData.category">
                                    <label>카테고리</label>
                                    <span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: pencil"/>
                                </ScInput>
                                <ul class="sc-vue-errors">
                                    <li v-if="!$v.sendData.category.required">카테고리를 입력하세요.</li>
                                </ul>
                            </div>
                            <div class="uk-width-1-1 uk-margin-small-bottom">
                                <ScInput v-model="sendData.title" :error-state="$v.sendData.title.$error" :validator="$v.sendData.title">
                                    <label>상품명</label>
                                    <span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: pencil"/>
                                </ScInput>
                                <ul class="sc-vue-errors">
                                    <li v-if="!$v.sendData.title.required">상품명을 입력하세요.</li>
                                </ul>
                            </div>
                            <div class="uk-width-1-1@s">
                                <ScInput v-model="sendData.price" :error-state="$v.sendData.price.$error" :validator="$v.sendData.price">
                                    <label>가격입력</label>
                                    <span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
                                </ScInput>
                                <ul class="sc-vue-errors">
                                    <li v-if="!$v.sendData.price.required">가격을 입력하세요.</li>
                                    <li v-if="!$v.sendData.price.integer">올바른 형식이 아닙니다.</li>
                                </ul>
                            </div>
                            <div class="uk-width-1-2 uk-margin-small-bottom">
                                <div class="uk-margin uk-heading-hero" style="text-align: left; margin-left:5px; margin-bottom: 10px; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;">
                                    <span>리스트이미지</span>
                                </div>
                                <div data-uk-form-custom="target: true">
                                    <input type="file" accept="image/*" ref="listImage" @change="onChangeListImageFile">
                                    <input class="uk-visible@s uk-input uk-form-width-medium" type="text" placeholder="Select file" disabled>
                                    <div class="uk-width-1-1 image-preview" v-if="listImageData">
                                        <img class="preview" :src="listImageData" alt="list">
                                    </div>
                                </div>
                            </div>
                            <div class="uk-width-1-2 uk-margin-small-bottom">
                                <div class="uk-margin uk-heading-hero" style="text-align: left; margin-left:5px; margin-bottom: 10px; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;">
                                    <span>상세이미지</span>
                                </div>
                                <div data-uk-form-custom="target: true">
                                    <input type="file" accept="image/*" ref="detailImage" @change="onChangeDetailImageFile">
                                    <input class="uk-visible@s uk-input uk-form-width-medium" type="text" placeholder="Select file" disabled>
                                    <div class="uk-width-1-1 image-preview" v-if="detailImageData">
                                        <img class="preview" :src="detailImageData" alt="detail">
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="uk-margin-top uk-text-center">
                        <button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" @click="submitForm">{{ sendData.uid ? '수정' : '생성' }}</button>
                        <button v-if="sendData.uid" class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" @click="deleteForm">삭제</button>
                    </div>
                </ScCardBody>
            </ScCard>
        </Transition>
    </div>
</template>

<script>
import {integer, required} from 'vuelidate/lib/validators'
import {validationMixin} from 'vuelidate'
import ScInput from "@/components/Input"
import Convert from "@/plugins/convertJson"
import Select2 from "@/components/Select2"

export default {
    components: {ScInput, Select2},
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
            productTypeOpts: [],
            editListImage: "",
            editDetailImage: "",
            listImageData: "",
            detailImageData: "",
            defaultForm: {
                uid: null,
                price: 0,
                productType: '',
                category: null,
                title: null,
                isActive: false,
                isSoldOut: false
            },
        }
    },
    validations: {
        sendData: {
            category: {
                required,
            },
            title: {
                required,
            },
            price: {
                required,
                integer
            }
        }
    },
    created() {
        let vm = this
        this.$nuxt.$on('open-pointProduct-form', (data) => {
            vm.settingForm(data)
        })
        this.$nuxt.$on('close-pointProduct-form', () => {
            vm.closeForm()
        })
    },
    async beforeMount() {
        let code = await this.$axios.$post(this.config.apiUrl + '/codes')
        this.productTypeOpts = Convert.convertJson(code.data.pointProductType, 'select')
    },
    beforeDestroy() {
        this.$nuxt.$off('open-pointProduct-form')
        this.$nuxt.$off('close-pointProduct-form')
    },
    methods: {
        onChangeListImageFile(event) {
            let input = event.target
            if (input.files && input.files[0]) {
                let reader = new FileReader()
                reader.onload = e => {
                    this.listImageData = e.target.result
                }
                reader.readAsDataURL(input.files[0])
            }
            this.editListImage = this.sendData.listImage
            this.sendData.listImage = this.$refs.listImage.files[0]
        },
        onChangeDetailImageFile(event) {
            let input = event.target
            if (input.files && input.files[0]) {
                let reader = new FileReader()
                reader.onload = e => {
                    this.detailImageData = e.target.result
                }
                reader.readAsDataURL(input.files[0])
            }
            this.editDetailImage = this.sendData.detailImage
            this.sendData.detailImage = this.$refs.detailImage.files[0]
        },
        settingForm(props) {
            this.$v.$reset()
            this.listImageData = ""
            this.detailImageData = ""
            this.editListImage = ""
            this.editDetailImage = ""
            if (props) {
                this.sendData = JSON.parse(JSON.stringify(props.data))
                this.listImageData = this.sendData.listImage
                this.detailImageData = this.sendData.detailImage
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
            this.$nuxt.$emit('reset-pointProduct-list')
        },
        deleteForm() {
            let listKey = new URL(this.sendData.listImage).pathname.replace('/carmeleon/', '')
            let detailKey = new URL(this.sendData.detailImage).pathname.replace('/carmeleon/', '')
            this.$objectStorage.deleteObject(listKey)
            this.$objectStorage.deleteObject(detailKey)

            this.$axios.$delete(this.config.apiUrl + '/pointProducts/' + this.sendData.uid, this.sendData).then(async res => {
                this.callNotification('삭제하였습니다.')
                this.$nuxt.$emit('fetch-pointProduct-list')
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
            let listFile = this.$refs.listImage.files[0]
            let detailFile = this.$refs.detailImage.files[0]
            if (this.isFileImage(listFile)) {
                let prefix = this.uuidV4()
                let listFile_url = await this.$objectStorage.uploadFile('pointProduct', listFile, prefix)
                if (listFile_url) {
                    this.sendData.listImage = listFile_url
                }
            }
            if (this.isFileImage(detailFile)) {
                let prefix = this.uuidV4()
                let detailFile_url = await this.$objectStorage.uploadFile('pointProduct', detailFile, prefix)
                if (detailFile_url) {
                    this.sendData.detailImage = detailFile_url
                }
            }
            this.$axios.$post(this.config.apiUrl + '/pointProducts', this.sendData).then(async res => {
                this.callNotification('상품을 생성하였습니다.')
                this.$nuxt.$emit('fetch-pointProduct-list')
            }).finally(() => {
                this.submitStatus = 'OK'
            })
        },
        async putForm() {
            if (this.$refs.listImage.files[0]) {
                this.sendData.listImage = ""
                let listKey = new URL(this.editListImage).pathname.replace('/carmeleon/', '')
                this.$objectStorage.deleteObject(listKey)
                let listFile = this.$refs.listImage.files[0]
                if (this.isFileImage(listFile)) {
                    let prefix = this.uuidV4()
                    let listFile_url = await this.$objectStorage.uploadFile('pointProduct', listFile, prefix)
                    if (listFile_url) {
                        this.sendData.listImage = listFile_url
                    }
                }
            }

            if (this.$refs.detailImage.files[0]) {
                this.sendData.detailImage = ""
                let detailKey = new URL(this.editDetailImage).pathname.replace('/carmeleon/', '')
                this.$objectStorage.deleteObject(detailKey)
                let detailFile = this.$refs.detailImage.files[0]
                if (this.isFileImage(detailFile)) {
                    let prefix = this.uuidV4()
                    let detailFile_url = await this.$objectStorage.uploadFile('pointProduct', detailFile, prefix)
                    if (detailFile_url) {
                        this.sendData.detailImage = detailFile_url
                    }
                }
            }
            if (this.sendData.listImage && this.sendData.detailImage) {
                this.$axios.$put(this.config.apiUrl + '/pointProducts/' + this.sendData.uid, this.sendData).then(async res => {
                    this.callNotification('수정하였습니다.')
                    this.$nuxt.$emit('fetch-pointProduct-list')
                }).finally(() => {
                    this.submitStatus = 'OK'
                })
            }
        },
    }
}
</script>

<style scoped>

</style>
