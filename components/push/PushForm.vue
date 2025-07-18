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
                            <div class="uk-width-1-1 uk-margin-top">
                                <ScTextarea
                                        v-model="sendData.body"
                                        :cols="30"
                                        :rows="5"
                                        :autosize="true"
                                        mode="outline"
                                        :error-state="$v.sendData.body.$error"
                                        :validator="$v.sendData.body"
                                >
                                    <label>
                                        내용
                                    </label>
                                </ScTextarea>
                                <ul class="sc-vue-errors">
                                    <li v-if="!$v.sendData.body.required">
                                        내용을 입력하세요.
                                    </li>
                                </ul>
                            </div>
                            <div class="uk-width-1-2@s">
                                <ScInput v-model="sendData.sendDate" v-flatpickr="dpTimePicker" placeholder="시간을 입력해주세요" mode="outline" style="margin-top:12px;"></ScInput>
                                <div style="color:#e53935; font-size: 12px; margin-top: 8px">(시간을 입력하지 않을 경우 현재 시간으로 등록됩니다.)</div>
                            </div>
                            <div class="uk-width-1-2@s">
                                <Select2
                                        v-model="sendData.pushType"
                                        v-on:change="userUidForm"
                                        :options="pushTypeOpts"
                                        :settings="{'width': '100%', 'placeholder':'푸쉬알림 구분'}"
                                        :error-state="$v.sendData.pushType.$error"
                                />
                                <ul class="sc-vue-errors">
                                    <li v-if="!$v.sendData.pushType.required">
                                        푸쉬알림 구분을 선택하세요.
                                    </li>
                                </ul>
                            </div>
                            <div v-if="sendData.pushType == '1'" class="uk-width-1-1@s">
                                <Select2
                                        v-model="sendData.userUid"
                                        :options="userOpts"
                                        :settings="{'width': '100%', 'placeholder':'사용자 선택'}"
                                        :error-state="$v.sendData.userUid.$error"
                                        multiple
                                />
                                <ul class="sc-vue-errors">
                                    <li v-if="!$v.sendData.userUid.required">
                                        사용자를 선택하세요.
                                    </li>
                                </ul>
                            </div>
                        </form>
                    </div>
                    <div class="uk-margin-top uk-text-center">
                        <button v-if="!sendData.status" class="sc-button sc-button-primary"
                                :disabled="submitStatus === 'PENDING'" @click="submitForm">
                            {{ sendData.uid ? '수정' : '등록' }}
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
    import {required} from 'vuelidate/lib/validators'
    import ScInput from '~/components/Input'
    import ScTextarea from '~/components/Textarea'
    import Select2 from '~/components/Select2'
    import confirmDatePlugin from "flatpickr/dist/plugins/confirmDate/confirmDate";
    import Convert from '@/plugins/convertJson'

    export default {
        components: {
            ScInput,
            ScTextarea,
            Select2
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
                deleteStatus: null,
                sendData: {},
                defaultForm: {
                    uid: null,
                    accountUid: 0,
                    title: '',
                    body: '',
                    sendDate:'',
                    status: 0,
                    pushType: '',
                    userUid: null
                },
                pushTypeOpts: [],
                userOpts:[]
            }
        },
        validations() {
            if(this.sendData.pushType == '2') {
                return {
                    sendData: {
                        title: {
                            required
                        },
                        body: {
                            required
                        },
                        pushType: {
                            required
                        }
                    }
                }
            } else {
                return {
                    sendData: {
                        title: {
                            required
                        },
                        body: {
                            required
                        },
                        pushType: {
                            required
                        },
                        userUid: {
                            required
                        }
                    }
                }
            }
        },
        computed:{
            dpTimePicker () {
                return {
                    enableTime: true,
                    time_24hr: true,
                    plugins: [new confirmDatePlugin({
                        confirmIcon: "<i class='mdi mdi-check'></i>",
                        confirmText: ""
                    })],
                    dateFormat: "Y-m-d H:i:S",
                    defaultDate: ''
                }
            },
        },
        created() {
            let vm = this
            this.$nuxt.$on('open-push-form', (data) => {
                vm.settingForm(data)
            })
            this.$nuxt.$on('close-push-form', () => {
                vm.closeForm()
            })
        },
        beforeDestroy() {
            this.$nuxt.$off('open-push-form')
            this.$nuxt.$off('close-push-form')
        },
        async beforeMount() {
            this.sendData = this.defaultForm
            let code = await this.$axios.$post(this.config.apiUrl + '/codes')
            let users = await this.$axios.$get(this.config.apiUrl + '/users')
            let user = users.data.map(user => {
                return {
                    id: user.uid,
                    text: user.snsType + " / " + user.name + " / " + user.email
                }
            })

            this.userOpts = user
            this.pushTypeOpts = Convert.convertJson(code.data.push, 'select')
        },
        methods: {
            userUidForm() {
                this.sendData.userUid = null
            },
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
                this.$nuxt.$emit('reset-push-list')
            },
            deleteForm() {
                this.$axios.$delete(this.config.apiUrl + '/pushes/' + this.sendData.uid, this.sendData).then(async res => {
                    this.callNotification('삭제하였습니다.')
                    this.$nuxt.$emit('fetch-push-list')
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
                this.sendData.sendDate = this.sendData.sendDate || this.$moment().format('YYYY-MM-DD HH:mm:ss')
                this.sendData.accountUid = this.$auth.user.uid;
                console.log(this.sendData)
                this.$axios.$post(this.config.apiUrl + '/pushes', this.sendData).then(async res => {
                    this.callNotification('등록하였습니다.')
                    this.$nuxt.$emit('fetch-push-list')
                }).finally(() => {
                    this.submitStatus = 'OK'
                    this.cardFormClosed = true
                })
            },
            putForm() {
                this.$axios.$put(this.config.apiUrl + '/pushes/' + this.sendData.uid, this.sendData).then(async res => {
                    this.callNotification('수정하였습니다.')
                    this.$nuxt.$emit('fetch-push-list')
                }).finally(() => {
                    this.submitStatus = 'OK'
                })
            },
        }
    }
</script>

<style lang="scss">
    .sc-vue-errors li {
        font-size: 12px;
    }
</style>
