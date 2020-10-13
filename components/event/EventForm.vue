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
                        <ScCardActions v-if="mode !== 'mypage'">
                            <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close"
                               @click.prevent="closeForm"/>
                        </ScCardActions>
                    </div>
                </ScCardHeader>
                <ScCardBody style="padding-top:0px;">
                    <div class="uk-accordion-content">
                        <form class="uk-grid-small uk-grid" data-uk-grid>
                            <div class="uk-width-1-1">
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
                            <div class="uk-width-1-1@s">
                            </div>
                            <!--	bannerImage 이미지 1-->
                            <div class="uk-width-1-2">
                                <div data-uk-form-custom="target: true">
                                    <input type="file" accept="image/*" ref="bannerImage"
                                           @change="onChangeBannerImageFile">
                                    <input class="uk-visible@s uk-input uk-form-width-medium" type="text"
                                           placeholder="Select file" disabled>
                                    <div class="uk-width-1-1 image-preview" v-if="bannerImageData">
                                        <img class="preview" :src="bannerImageData">
                                    </div>
                                </div>
                            </div>
                            <!--	mainImage	이미지 2-->
                            <div class="uk-width-1-2">
                                <div data-uk-form-custom="target: true">
                                    <input type="file" accept="image/*" ref="mainImage" @change="onChangeMainImageFile">
                                    <input class="uk-visible@s uk-input uk-form-width-medium" type="text"
                                           placeholder="Select file" disabled>
                                    <div class="uk-width-1-1 image-preview" v-if="mainImageData">
                                        <img class="preview" :src="mainImageData">
                                    </div>
                                </div>
                            </div>
                            <div class="uk-width-1-1@s">
                            </div>
                            <div class="uk-width-1-1@s">
                                <div class="uk-grid-small uk-grid" data-uk-grid>
                                    <ScInput v-model="eventDate" v-flatpickr="dpRange" placeholder="이벤트 기간"
                                             mode="outline" :error-state="$v.sendData.startDate.$error"
                                             :validator="$v.sendData.startDate">
                                        <span slot="icon" class="uk-form-icon" data-uk-icon="calendar"></span>
                                    </ScInput>
                                    <ul class="sc-vue-errors">
                                        <li v-if="!$v.sendData.startDate.required">
                                            이벤트 기간을 입력하세요.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="uk-width-1-1@s">
                            </div>

                            <div class="uk-width-1-2">
                                <Select2 v-model="sendData.eventType" :options="eventOpts"
                                         :settings="{ 'width': '100%', 'placeholder': '이벤트 종류' }"
                                         :error-state="$v.sendData.eventType.$error"/>
                                <ul class="sc-vue-errors">
                                    <li v-if="!$v.sendData.eventType.required">
                                        이벤트 종류를 선택하세요.
                                    </li>
                                </ul>
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
                eventOpts: [
                    {id: 0, text: '팝업적용'},
                    {id: 1, text: '팝업미적용'}
                ],
                editBannerImage:"",
                editMainImage:"",
                bannerImageData: "",
                mainImageData: "",
                cardFormClosed: true,
                submitStatus: null,
                sendData: {},
                eventDate: '',
                defaultForm: {
                    uid: null,
                    title: '',
                    bannerImage: '',
                    mainImage: '',
                    accountUid: this.$auth.user.uid,
                    startDate: '',
                    endDate: '',
                    eventType: '',
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
            'eventDate': function (newVal) {
                if (newVal.includes("~")) {
                    this.sendData.startDate = newVal.split('~')[0].trim();
                    this.sendData.endDate = newVal.split('~')[1].trim();
                }
            },
        },
        validations: {
            sendData: {
                title: {
                    required
                },
                eventType: {
                    required,
                },
                startDate: {
                    required
                }
            }
        },
        created() {
            let vm = this
            this.$nuxt.$on('open-event-form', (data) => {
                vm.settingForm(data)
            })
            this.$nuxt.$on('close-event-form', () => {
                vm.closeForm()
            })
        },
        async beforeMount() {
            this.sendData = this.defaultForm
        },

        beforeDestroy() {
            this.$nuxt.$off('open-event-form')
            this.$nuxt.$off('close-event-form')
        },
        methods: {
            onChangeBannerImageFile(event) {
                let input = event.target;
                if (input.files && input.files[0]) {
                    let reader = new FileReader();
                    reader.onload = e => {
                        this.bannerImageData = e.target.result;
                    }
                    if (input.files[0].size > 800 * 800) {
                        event.preventDefault();
                        this.callNotification('파일을 다시 확인하세요.')
                        return;
                    }
                    reader.readAsDataURL(input.files[0]);
                }
                this.editBannerImage = this.sendData.bannerImage
                this.sendData.bannerImage = this.$refs.bannerImage.files[0];
            },
            onChangeMainImageFile(event) {
                let input = event.target;
                if (input.files && input.files[0]) {
                    let reader = new FileReader();
                    reader.onload = e => {
                        this.mainImageData = e.target.result;
                    }
                    if (input.files[0].size > 800 * 800) {
                        event.preventDefault();
                        this.callNotification('파일을 다시 확인하세요.')
                        return;
                    }
                    reader.readAsDataURL(input.files[0]);
                }
                this.editMainImage = this.sendData.mainImage
                this.sendData.mainImage = this.$refs.mainImage.files[0];
            },
            settingForm(props) {
                this.$v.$reset()
                this.bannerImageData = ""
                this.mainImageData = ""
                if (props) {
                    this.sendData = JSON.parse(JSON.stringify(props.data))
                    this.eventDate = this.sendData.startDate.substr(0, 10) + " ~ " + this.sendData.endDate.substr(0, 10)

                    this.bannerImageData = this.sendData.bannerImage
                    this.mainImageData = this.sendData.mainImage
                } else {
                    this.eventDate = ""
                    this.sendData = JSON.parse(JSON.stringify(this.defaultForm))
                }
                this.cardFormClosed = true
                setTimeout(() => {
                    this.cardFormClosed = false
                }, 100)
            },
            closeForm() {
                this.cardFormClosed = true
                this.$nuxt.$emit('reset-event-list')
            },
            deleteForm() {
                let mainKey = new URL(this.sendData.mainImage).pathname.replace('/carmeleon/', '')
                let bannerKey = new URL(this.sendData.bannerImage).pathname.replace('/carmeleon/','')
                this.$objectStorage.deleteObject(mainKey)
                this.$objectStorage.deleteObject(bannerKey)

                this.$axios.$delete(this.config.apiUrl + '/events/' + this.sendData.uid, this.sendData).then(async res => {
                    this.callNotification('삭제하였습니다.')
                    this.$nuxt.$emit('fetch-event-list')
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
                let mainFile = this.$refs.mainImage.files[0]
                let bannerFile = this.$refs.bannerImage.files[0]
                if(this.isFileImage(mainFile)){
                    let prefix = this.uuidV4()
                    let mainFile_url = await this.$objectStorage.uploadFile('event', mainFile, prefix)

                    if(mainFile_url){
                        this.sendData.mainImage = mainFile_url
                    }
                }

                if(this.isFileImage(bannerFile)){
                    let prefix = this.uuidV4()
                    let bannerFile_url = await this.$objectStorage.uploadFile('event', bannerFile, prefix)

                    if(bannerFile_url){
                        this.sendData.bannerImage = bannerFile_url
                    }
                }

                this.$axios.$post(this.config.apiUrl + '/events', this.sendData).then(async res => {
                    this.callNotification('등록하였습니다.')
                    this.$nuxt.$emit('fetch-event-list')
                }).finally(() => {
                    this.submitStatus = 'OK'
                })
            },
            async putForm() {
                // let url, modify_string, _lastDot, prefix;
                if(this.$refs.mainImage.files[0]) {
                    this.sendData.mainImage = ""
                    let mainKey = new URL(this.editMainImage).pathname.replace('/carmeleon/', '')
                    this.$objectStorage.deleteObject(mainKey)
                    let mainFile = this.$refs.mainImage.files[0]
                    if(this.isFileImage(mainFile)){
                        let prefix = this.uuidV4()
                        let mainFile_url = await this.$objectStorage.uploadFile('event', mainFile, prefix)

                        if(mainFile_url){
                            this.sendData.mainImage = mainFile_url
                        }
                    }
                }

                if(this.$refs.bannerImage.files[0]) {
                    this.sendData.bannerImage = ""
                    let bannerKey = new URL(this.editBannerImage).pathname.replace('/carmeleon/', '')
                    this.$objectStorage.deleteObject(bannerKey)
                    let bannerFile = this.$refs.bannerImage.files[0]
                    if(this.isFileImage(bannerFile)){
                        let prefix = this.uuidV4()
                        let bannerFile_url = await this.$objectStorage.uploadFile('event', bannerFile, prefix)

                        if(bannerFile_url){
                            this.sendData.bannerImage = bannerFile_url
                        }
                    }
                }

                if(this.sendData.mainImage && this.sendData.bannerImage){
                    this.$axios.$put(this.config.apiUrl + '/events/' + this.sendData.uid, this.sendData).then(async res => {
                        this.callNotification('수정하였습니다.')
                        this.$nuxt.$emit('fetch-event-list')
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
