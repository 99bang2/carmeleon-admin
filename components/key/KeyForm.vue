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
                <ScCardBody>
                    <div class="uk-accordion-content">
                        <form class="uk-grid-small uk-grid" data-uk-grid>
                            <div class="uk-width-1-1">
                                <ScInput v-model="sendData.key" :error-state="$v.sendData.key.$error"
                                         :validator="$v.sendData.key">
                                    <label>
                                        키
                                    </label>
                                    <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                          data-uk-icon="icon: pencil"/>
                                </ScInput>
                                <ul class="sc-vue-errors">
                                    <li v-if="!$v.sendData.key.required">
                                        키를 입력하세요.
                                    </li>
                                </ul>
                            </div>
                            <div class="uk-width-1-1">
                                <ScInput v-model="sendData.value" :error-state="$v.sendData.value.$error"
                                         :validator="$v.sendData.value">
                                    <label>
                                        값
                                    </label>
                                    <span slot="icon" class="uk-form-icon uk-form-icon-flip"
                                          data-uk-icon="icon: pencil"/>
                                </ScInput>
                                <ul class="sc-vue-errors">
                                    <li v-if="!$v.sendData.value.required">
                                        값을 입력하세요.
                                    </li>
                                </ul>
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
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import ScInput from '~/components/Input'

export default {
    components: {
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
            deleteStatus: null,
            sendData: {},
            defaultForm: {
                uid: null,
                key: '',
                value: '',
            },
        }
    },
    validations: {
        sendData: {
            key: {
                required,
                async isUnique(value) {
                    if (value === '') return true
                    let res = await this.$axios.$get(this.config.apiUrl + `/keys/unique/${value}`)
                    return Boolean(res.data)
                }
            },
            value: {
                required
            },
        }
    },
    created() {
        let vm = this
        this.$nuxt.$on('open-key-form', (data) => {
            vm.settingForm(data)
        })
        this.$nuxt.$on('close-key-form', () => {
            vm.closeForm()
        })
    },
    beforeDestroy() {
        this.$nuxt.$off('open-key-form')
        this.$nuxt.$off('close-key-form')
    },
    async beforeMount() {
        this.sendData = this.defaultForm
    },
    methods: {
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
            this.$nuxt.$emit('reset-key-list')
        },
        deleteForm() {
            console.log(this.sendData)
            this.$axios.$delete(this.config.apiUrl + '/keys/' + this.sendData.uid, this.sendData).then(async res => {
                this.callNotification('삭제하였습니다.')
                this.$nuxt.$emit('fetch-key-list')
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
            this.$axios.$post(this.config.apiUrl + '/keys', this.sendData).then(async res => {
                this.callNotification('등록하였습니다.')
                this.$nuxt.$emit('fetch-key-list')
            }).finally(() => {
                this.submitStatus = 'OK'
                this.cardFormClosed = true
            })
        },
        putForm() {
            this.$axios.$put(this.config.apiUrl + '/keys/' + this.sendData.uid, this.sendData).then(async res => {
                this.callNotification('수정하였습니다.')
                this.$nuxt.$emit('fetch-key-list')
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