<template>
    <div>
        <Transition name="slide-bottom-medium">
            <ScCard v-if="!cardFormClosed" style="min-height: 745px">
                <ScCardHeader separator>
                    <div class="uk-flex uk-flex-middle">
                        <div class="uk-flex-1">
                            <ScCardTitle>
                                <i class="mdi mdi-cart"/> 포인트 주문 상세
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
                            <div class="uk-width-1-3 uk-margin-small-bottom">
                                <ScInput v-model="sendData.category" disabled><label>상품카테고리</label></ScInput>
                            </div>
                            <div class="uk-width-1-3 uk-margin-small-bottom">
                                <ScInput v-model="sendData.title" disabled><label>상품명</label></ScInput>
                            </div>
                            <div class="uk-width-1-3 uk-margin-small-bottom">
                                <ScInput v-model="sendData.price" disabled><label>가격</label></ScInput>
                            </div>
                            <div class="uk-width-1-2 uk-margin-small-bottom">
                                <ScInput v-model="sendData.name" disabled><label>주문자</label></ScInput>
                            </div>
                            <div class="uk-width-1-2 uk-margin-small-bottom">
                                <ScInput v-model="sendData.phone" disabled><label>전화번호</label></ScInput>
                            </div>
                            <div class="uk-width-1-2 uk-margin-small-bottom">
                                <div class="uk-margin uk-heading-hero" style="text-align: left; margin-left:5px; margin-bottom: 0px; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;">
                                    <span>상품구분</span>
                                </div>
                                <Select2 div-style="padding:0" v-model="sendData.status" :options="orderStatusOpts" :settings="{ 'width': '100%', 'placeholder': '상품구분' }"/>
                            </div>
                            <div class="uk-width-1-1">
                                <ScTextarea v-model="sendData.memo" :cols="30" :rows="4" :autosize="true" mode="outline">
                                    <label>메모</label>
                                </ScTextarea>
                            </div>
                        </form>
                    </div>
                    <div class="uk-margin-top uk-text-center">
                        <button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" @click="submitForm">수정</button>
                    </div>
                </ScCardBody>
            </ScCard>
        </Transition>
    </div>
</template>

<script>
import {validationMixin} from 'vuelidate'
import ScInput from "@/components/Input"
import Convert from "@/plugins/convertJson"
import Select2 from "@/components/Select2"
import ScTextarea from '~/components/Textarea'

export default {
    components: {ScInput, Select2, ScTextarea},
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
            orderStatusOpts: [],
            defaultForm: {
                uid: null,
                memo: '',
                status: 'WAIT'
            },
        }
    },
    created() {
        let vm = this
        this.$nuxt.$on('open-pointOrder-form', (data) => {
            vm.settingForm(data)
        })
        this.$nuxt.$on('close-pointOrder-form', () => {
            vm.closeForm()
        })
    },
    async beforeMount() {
        let code = await this.$axios.$post(this.config.apiUrl + '/codes')
        this.orderStatusOpts = Convert.convertJson(code.data.pointOrderStatus, 'select')
    },
    beforeDestroy() {
        this.$nuxt.$off('open-pointOrder-form')
        this.$nuxt.$off('close-pointOrder-form')
    },
    methods: {
        settingForm(props) {
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
            this.$nuxt.$emit('reset-pointOrder-list')
        },
        submitForm(e) {
            e.preventDefault()
            this.submitStatus = 'PENDING'
            if (this.sendData.uid) {
                this.putForm()
            }
        },
        async putForm() {
            this.$axios.$put(this.config.apiUrl + '/pointOrders/' + this.sendData.uid, this.sendData).then(async res => {
                this.callNotification('수정하였습니다.')
                this.$nuxt.$emit('fetch-pointOrder-list')
            }).finally(() => {
                this.submitStatus = 'OK'
            })
        },
    }
}
</script>

<style scoped>

</style>
