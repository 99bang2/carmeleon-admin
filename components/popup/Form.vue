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
                        <ScCardActions>
                            <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close"
                               @click.prevent="closeForm"/>
                        </ScCardActions>
                    </div>
                </ScCardHeader>
                <ScCardBody style="padding-top:0px;">
                    <div class="uk-accordion-content">
                        <form class="uk-grid-small uk-grid" data-uk-grid>
                            <div class="uk-width-1-1 uk-margin-small-bottom">
                                <ScInput v-model="sendData.title" :error-state="$v.sendData.title.$error"
                                         :validator="$v.sendData.title">
                                    <label>
                                        제목
                                    </label>
                                    <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                          data-uk-icon="icon: pencil"/>
                                </ScInput>
                                <ul class="sc-vue-errors">
                                    <li v-if="!$v.sendData.title.required">
                                        제목을 입력하세요.
                                    </li>
                                </ul>
                            </div>
                            <div class="uk-width-1-1@s uk-margin-small-bottom">
                                <!--<div class="uk-margin uk-heading-hero" style="text-align: left; margin-left:5px; margin-bottom: 10px; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;"><span>이미지</span></div>-->
                                <div data-uk-form-custom="target: true" style="width: 100%">
                                    <input type="file" accept="image/*" ref="popupImage" @change="onChangeImageFile">
                                    <input class="uk-visible@s uk-input" type="text" placeholder="이미지 선택" disabled :class="[{'sc-input-wrapper-danger': !$v.imageData.required}]">
                                    <div class="uk-width-1-1 image-preview" v-if="imageData">
                                        <img class="preview" :src="imageData">
                                    </div>
                                    <ul class="sc-vue-errors">
                                        <li v-if="!$v.imageData.required">
                                            이미지를 업로드하세요.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="uk-width-1-1@s uk-margin-small-bottom">
                                <div class="uk-grid-small uk-grid" data-uk-grid>
                                    <ScInput v-model="openDate" v-flatpickr="dpRange" placeholder="게시 기간" :error-state="$v.openDate.$error" :validator="$v.openDate">
                                        <span slot="icon" class="uk-form-icon" data-uk-icon="calendar"/>
                                    </ScInput>
                                    <ul class="sc-vue-errors">
                                        <li v-if="!$v.openDate.required">
                                            게시 기간을 입력하세요.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="uk-width-1-1@s uk-margin-small-bottom">
                                <div class="uk-margin uk-heading-hero" style="text-align: left; margin-left:5px; margin-bottom: 0px; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;"><span>링크</span></div>
                                <div class="uk-grid-small uk-grid" data-uk-grid>
                                    <div class="uk-width-1-2">
                                        <Select2 div-style="padding:0" v-model="sendData.linkType" :options="linkTypeOpts" :settings="{ 'width': '100%', 'placeholder': '링크' }"/>
                                    </div>
                                    <div class="uk-width-1-2" v-if="sendData.linkType > 0">
                                        <Select2 div-style="padding:0" v-model="sendData.linkId" :options="eventOpts" :settings="{ 'width': '100%', 'placeholder': '이벤트' }"/>
                                    </div>
                                </div>
                            </div>
                            <div class="uk-width-1-2@s">
                                <input id="switch-css" v-model="sendData.isOpen" type="checkbox"
                                       class="sc-switch-input">
                                <label for="switch-css" class="sc-switch-label"
                                       style="margin-top:15px;margin-left:15px;">
                                    <span class="sc-switch-toggle-on">공개</span>
                                    <span class="sc-switch-toggle-off">비공개</span>
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="uk-margin-top uk-text-center">
                        <button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'"
                                @click="submitForm">
                            {{ sendData.uid ? '수정': '등록' }}
                        </button>
                        <button v-if="sendData.uid" class="sc-button sc-button-primary"
                                :disabled="submitStatus === 'PENDING'" @click="deleteForm">
                            삭제
                        </button>
                    </div>
                </ScCardBody>
            </ScCard>
        </Transition>
    </div>
</template>

<script>
    import {validationMixin} from 'vuelidate'
    import {required, between, minLength, minValue, sameAs, email, requiredIf} from 'vuelidate/lib/validators'
    import ScInput from '~/components/Input'
    import confirmDatePlugin from "flatpickr/dist/plugins/confirmDate/confirmDate"
    import Select2 from "@/components/Select2";
    import Convert from "@/plugins/convertJson"

    if (process.client) {
        require('~/plugins/flatpickr');
    }

    export default {
        components: {
            Select2,
            ScInput,
        },
        mixins: [
            validationMixin,
        ],
        props: {
            mode: {
                type: String,
                default: 'list'
            },
        },
        data() {
            return {
                cardFormClosed: true,
                submitStatus: null,
                linkTypeOpts: [],
                eventOpts: [],
                editImage:"",
                imageData: "",
                sendData: {},
                openDate: '',
                defaultForm: {
                    uid: null,
                    title: '',
                    popupImage: '',
                    startDate: '',
                    endDate: '',
                    linkType: 0,
                    linkId: '',
                    isOpen: false,
                }
            }
        },
        computed: {
            dpRange() {
                return {
                    mode: "range",
                    plugins: [confirmDatePlugin]
                }
            },
        },
        watch: {
            'openDate': function (newVal) {
                if (newVal.includes("~")) {
                    this.sendData.startDate = newVal.split('~')[0].trim();
                    this.sendData.endDate = newVal.split('~')[1].trim();
                }
            },
        },
        validations: {
            openDate: {
                required
            },
            imageData: {
                required
            },
            sendData: {
                title: {
                    required
                }
            }
        },
        created() {
            let vm = this
            this.$nuxt.$on('open-popup-form', (data) => {
                vm.settingForm(data)
            })
            this.$nuxt.$on('close-popup-form', () => {
                vm.closeForm()
            })
        },
        async beforeMount() {
            let code = await this.$axios.$post(this.config.apiUrl + '/codes')
            this.linkTypeOpts = Convert.convertJson(code.data.popupLinkType, 'select')
            let events = await this.$axios.$get(this.config.apiUrl + '/events')
            for(let event of events.data) {
                this.eventOpts.push({
                    id: event.uid,
                    text: event.title
                })
            }
        },
        beforeDestroy() {
            this.$nuxt.$off('open-popup-form')
            this.$nuxt.$off('close-popup-form')
        },
        methods: {
            onChangeImageFile(event) {
                let input = event.target;
                if (input.files && input.files[0]) {
                    let reader = new FileReader();
                    reader.onload = e => {
                        this.imageData = e.target.result;
                    }
                    if (input.files[0].size > 800 * 800) {
                        event.preventDefault();
                        this.callNotification('파일을 다시 확인하세요.')
                        return;
                    }
                    reader.readAsDataURL(input.files[0]);
                }
                this.editImage = this.sendData.popupImage
                this.sendData.popupImage = this.$refs.popupImage.files[0];
            },
            settingForm(props) {
                this.$v.$reset()
                this.imageData = ""
                this.openDate = ""
                if (props) {
                    this.sendData = JSON.parse(JSON.stringify(props.data))
                    this.openDate = this.sendData.startDate.substr(0, 10) + " ~ " + this.sendData.endDate.substr(0, 10)
                    this.imageData = this.sendData.popupImage
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
                this.$nuxt.$emit('reset-popup-list')
            },
            deleteForm() {
                let imageKey = new URL(this.sendData.popupImage).pathname.replace('/carmeleon/', '')
                this.$objectStorage.deleteObject(imageKey)
                this.$axios.$delete(this.config.apiUrl + '/popups/' + this.sendData.uid, this.sendData).then(async res => {
                    this.callNotification('삭제하였습니다.')
                    this.$nuxt.$emit('fetch-popup-list')
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
                let imageFile = this.$refs.popupImage.files[0]
                if(this.isFileImage(imageFile)){
                    let prefix = this.uuidV4()
                    let imageUrl = await this.$objectStorage.uploadFile('popups', imageFile, prefix)
                    if(imageUrl){
                        this.sendData.popupImage = imageUrl
                    }
                }
                this.$axios.$post(this.config.apiUrl + '/popups', this.sendData).then(async res => {
                    this.callNotification('등록하였습니다.')
                    this.$nuxt.$emit('fetch-popup-list')
                    this.closeForm()
                }).finally(() => {
                    this.submitStatus = 'OK'
                })
            },
            async putForm() {
                if(this.$refs.popupImage.files[0]) {
                    this.sendData.popupImage = ""
                    let imageKey = new URL(this.editMainImage).pathname.replace('/carmeleon/', '')
                    this.$objectStorage.deleteObject(imageKey)
                    let imageFile = this.$refs.popupImage.files[0]
                    if(this.isFileImage(imageFile)){
                        let prefix = this.uuidV4()
                        let imageUrl = await this.$objectStorage.uploadFile('popups', imageFile, prefix)
                        if(imageUrl){
                            this.sendData.popupImage = imageUrl
                        }
                    }
                }
                if(this.sendData.popupImage){
                    this.$axios.$put(this.config.apiUrl + '/popups/' + this.sendData.uid, this.sendData).then(async res => {
                        this.callNotification('수정하였습니다.')
                        this.$nuxt.$emit('fetch-popup-list')
                    }).finally(() => {
                        this.submitStatus = 'OK'
                    })
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    .sc-vue-errors li {
        font-size: 12px;
    }

    .image-preview {
        text-align: center;
        vertical-align: middle;
        background-color: #DCDCDC;
        height: auto;
        padding: 20px;
    }

    img.preview {
        height: auto;
        width: auto;
        max-height: 150px;
        max-width: 150px;
        background-color: white;
        border: 1px solid #DDD;
        padding: 2px;
    }

</style>
