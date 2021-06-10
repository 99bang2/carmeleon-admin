<template>
    <div>
        <ScCard>
            <ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
                <div class="uk-flex-1">
                    <ScCardTitle>
                        <slot><i class="mdi mdi-android"/>버전목록</slot>
                    </ScCardTitle>
                </div>
            </ScCardHeader>
            <ScCardBody>
                <div >
                    <ul class="uk-child-width-1-1 uk-child-width-1-2@m uk-child-width-3-3@l uk-grid" data-uk-grid>
                        <li>
                            <ScCard hover>
                                <ScCardBody class="sc-padding-remove">
                                    <div class="uk-grid-divider uk-grid-collapse" data-uk-grid>
                                        <div class="uk-width-1-3@l uk-flex uk-flex-middle uk-flex-center md-bg-light-green-700">
                                            <div class="sc-padding-medium uk-text-center">
                                                <!--                                    <ScAvatar :avatar-id="randAvatar()" size="md" :extra-class="avatarClass(index)"></ScAvatar>-->
                                                <p class="sc-text-semibold uk-margin uk-margin-remove-bottom">
                                                    Android
                                                </p>
                                            </div>
                                        </div>
                                        <div class="uk-width-2-3@l">
                                            <div class="sc-padding-medium">
                                                <ul class="uk-list uk-list-divider">
                                                    <li class="sc-list-group">
                                                        <div class="sc-list-body">
                                                            <ScInput v-model="sendData.android.latest" :error-state="$v.sendData.android.latest.$error" :validator="$v.sendData.android.latest"
                                                                     v-input-mask="{ regex: '[0-9]{1,2}[.][0-9]{1,2}[.][0-9]{1,2}' }"
                                                            >
                                                                <label>마지막 버전</label>
                                                                <span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: pencil"/>
                                                            </ScInput>
                                                            <ul class="sc-vue-errors">
                                                                <li v-if="!$v.sendData.android.latest.required">마지막 버전을 입력하세요.</li>
                                                                <li v-if="!$v.sendData.android.latest.versionFormatCheck">올바른 형식이 아닙니다.</li>
                                                            </ul>
                                                        </div>
                                                    </li>
                                                    <li class="sc-list-group">
                                                        <div class="sc-list-body">
                                                            <ScInput v-model="sendData.android.minimum" :error-state="$v.sendData.android.minimum.$error" :validator="$v.sendData.android.minimum"
                                                                     v-input-mask="{ regex: '[0-9]{1,2}[.][0-9]{1,2}[.][0-9]{1,2}' }"
                                                            >
                                                                <label>최소 버전</label>
                                                                <span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: pencil"/>
                                                            </ScInput>
                                                            <ul class="sc-vue-errors">
                                                                <li v-if="!$v.sendData.android.minimum.required">최소 버전을 입력하세요.</li>
                                                                <li v-if="!$v.sendData.android.minimum.versionFormatCheck">올바른 형식이 아닙니다.</li>
                                                            </ul>
                                                        </div>
                                                    </li>
                                                    <li class="sc-list-group">
                                                    </li>
                                                </ul>
                                                <div class="uk-margin-top uk-text-center">
                                                    <button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" @click="submitForm($event,'android')">수정</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScCardBody>
                            </ScCard>
                        </li>
                        <li>
                            <ScCard hover>
                                <ScCardBody class="sc-padding-remove">
                                    <div class="uk-grid-divider uk-grid-collapse" data-uk-grid>
                                        <div class="uk-width-1-3@l uk-flex uk-flex-middle uk-flex-center md-bg-blue-700">
                                            <div class="sc-padding-medium uk-text-center">
                                                <!--                                    <ScAvatar :avatar-id="randAvatar()" size="md" :extra-class="avatarClass(index)"></ScAvatar>-->
                                                <p class="sc-text-semibold uk-margin uk-margin-remove-bottom">
                                                    ios
                                                </p>
                                            </div>
                                        </div>
                                        <div class="uk-width-2-3@l">
                                            <div class="sc-padding-medium">
                                                <ul class="uk-list uk-list-divider">
                                                    <li class="sc-list-group">
                                                        <div class="sc-list-body">
                                                            <ScInput v-model="sendData.ios.latest" :error-state="$v.sendData.ios.latest.$error" :validator="$v.sendData.ios.latest"
                                                                     v-input-mask="{ regex: '[0-9]{1,2}[.][0-9]{1,2}[.][0-9]{1,2}' }"
                                                            >
                                                                <label>마지막 버전</label>
                                                                <span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: pencil"/>
                                                            </ScInput>
                                                            <ul class="sc-vue-errors">
                                                                <li v-if="!$v.sendData.ios.latest.required">마지막 버전을 입력하세요.</li>
                                                                <li v-if="!$v.sendData.ios.latest.versionFormatCheck">올바른 형식이 아닙니다.</li>
                                                            </ul>
                                                        </div>
                                                    </li>
                                                    <li class="sc-list-group">
                                                        <div class="sc-list-body">
                                                            <ScInput v-model="sendData.ios.minimum" :error-state="$v.sendData.ios.minimum.$error" :validator="$v.sendData.ios.minimum"
                                                                     v-input-mask="{ regex: '[0-9]{1,2}[.][0-9]{1,2}[.][0-9]{1,2}' }"
                                                            >
                                                                <label>최소 버전</label>
                                                                <span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: pencil"/>
                                                            </ScInput>
                                                            <ul class="sc-vue-errors">
                                                                <li v-if="!$v.sendData.ios.minimum.required">최소 버전을 입력하세요.</li>
                                                                <li v-if="!$v.sendData.ios.minimum.versionFormatCheck">올바른 형식이 아닙니다.</li>
                                                            </ul>
                                                        </div>
                                                    </li>
                                                    <li class="sc-list-group">
                                                    </li>
                                                </ul>
                                                <div class="uk-margin-top uk-text-center">
                                                    <button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" @click="submitForm($event, 'ios')">수정</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScCardBody>
                            </ScCard>
                        </li>
                    </ul>
                </div>
            </ScCardBody>
        </ScCard>
    </div>
</template>

<script>
    import ScInput from "@/components/Input"
    import {agGridMixin} from "@/plugins/ag-grid.mixin";
    import {integer, required} from "vuelidate/lib/validators"
    import {validationMixin} from "vuelidate"
    import customValidators from '@/plugins/vuelidateValidators'
    if (process.client) {
        require('~/plugins/inputmask');
    }
    export default {
        components: {ScInput},
        mixins: [
            agGridMixin,
            validationMixin,
        ],
        data() {
            return {
                submitStatus: null,
                sendData: {
                    android : {latest : '0.0.0', minimum: '0.0.0'},
                    ios : {latest : '0.0.0', minimum: '0.0.0'}
                },
            }
        },
        validations: {
            sendData: {
                android : {
                    latest: {
                        required,
                        versionFormatCheck: customValidators.versionFormatCheck()
                    },
                    minimum: {
                        required,
                        versionFormatCheck: customValidators.versionFormatCheck()
                    }
                },
                ios : {
                    latest: {
                        required,
                        versionFormatCheck: customValidators.versionFormatCheck()
                    },
                    minimum: {
                        required,
                        versionFormatCheck: customValidators.versionFormatCheck(),
                        // versionMinMaxCheck: customValidators.versionMinMaxCheck(this.sendData.ios.minimum, this.sendData.ios.latest)
                    }
                }
            }
        },
        computed: {
        },
        created() {
        },
        async mounted() {
            await this.fetchData()
        },
        methods: {
            async fetchData() {
                // API 연동
                let res = await this.$axios.$get(this.config.apiUrl + '/versions')
                // let androidObj = {};
                // let iosObj = {};
                //
                // res.data.forEach((item) => {
                //     if (item.key.split('-')[0] == 'android') {
                //         androidObj[item.key.split('-')[1]] = item.value;
                //     } else {
                //         iosObj[item.key.split('-')[1]] = item.value;
                //     }
                // })
                // this.sendData.android = androidObj;
                // this.sendData.ios = iosObj

                let keyArray = [];
                res.data.forEach((item) => {
                    keyArray = item.key.split('-')
                        this.$set(this.sendData[keyArray[0]], keyArray[1], item.value)
                })
            },
            submitForm(e, os) {
                e.preventDefault()
                this.$v.$touch()

                if (this.$v.$invalid) {
                    this.submitStatus = 'ERROR'
                } else {
                    this.submitStatus = 'PENDING'
                    this.putForm(os)
                }
            },
            async putForm(os) {
                this.$axios.$put(this.config.apiUrl + '/versions/' + os, this.sendData[os]).then(async res => {
                    this.callNotification('수정하였습니다.')
                }).finally(() => {
                    this.submitStatus = 'OK'
                })
            }
        },
    }
</script>

<style scoped>

</style>