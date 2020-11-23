<template>
    <div>
        <div class="uk-accordion-content">
            <h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
                상품등록
            </h5>
            <form class="uk-grid-small uk-grid" data-uk-grid>
                <div class="uk-width-1-2">
                    <Select2
                            v-model="sendData.ticketType"
                            :options="ticketTypeOpts"
                            :settings="{ 'width': '100%', 'placeholder': '상품 유형' }"
                            :error-state="$v.sendData.ticketType.$error"
                    />
                    <ul class="sc-vue-errors">
                        <li v-if="!$v.sendData.ticketType.required">
                            상품 유형을 선택하세요.
                        </li>
                    </ul>
                </div>
                <div class="uk-width-1-2">
                    <Select2
                            v-model="sendData.ticketDayType"
                            :options="ticketDayTypeOpts"
                            :settings="{ 'width': '100%', 'placeholder': '상품날짜 유형' }"
                            :error-state="$v.sendData.ticketDayType.$error"
                    />
                    <ul class="sc-vue-errors">
                        <li v-if="!$v.sendData.ticketDayType.required">
                            상품날짜 유형을 선택하세요.
                        </li>
                    </ul>
                </div>
                <div class="uk-width-1-1@s">
                    <div class="uk-grid-small uk-grid" data-uk-grid>
                        <ScInput v-model="ticketDate" v-flatpickr="dpRange" placeholder="판매 기간">
                            <span slot="icon" class="uk-form-icon" data-uk-icon="calendar"></span>
                        </ScInput>
                    </div>
                </div>
                <div class="uk-width-1-2">
                    <ScInput v-model="sendData.ticketPrice" :error-state="$v.sendData.ticketPrice.$error"
                             :validator="$v.sendData.ticketPrice">
                        <label>
                            상품가격
                        </label>
                        <span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
                    </ScInput>
                    <ul class="sc-vue-errors">
                        <li v-if="!$v.sendData.ticketPrice.required">
                            가격을 입력하세요.
                        </li>
                        <li v-if="!$v.sendData.ticketPrice.integer">
                            올바르지 않은 형식입니다.
                        </li>
                    </ul>
                </div>
                <div class="uk-width-1-2">
                    <ScInput v-model="sendData.ticketCount">
                        <label>
                            재고
                        </label>
                        <span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
                    </ScInput>
                </div>
                <div style="width: 100%; display: flex;  align-items: center">
                    <div class="uk-width-1-2">
                        <ScInput v-model="sendData.fee">
                            <label>
                                정산 수수료 설정(%)
                            </label>
                            <span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: tag"/>
                        </ScInput>
                    </div>
                    <div class="uk-width-1-2" style="text-align: center">
                        <div class="uk-margin uk-heading-hero" style="text-align: left; margin-left:5px; margin-bottom: 0; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;"><span>상태</span></div>
                        <PrettyCheck v-model="sendData.isActive" class="p-switch" color="primary">
                            {{sendData.isActive?"활성":"비활성"}}
                        </PrettyCheck>
                    </div>
                </div>
                <div style="width: 100%; display: flex;  align-items: center">
                    <div v-if="sendData.ticketType==='1'" class="uk-width-1-2">
                        <ScInput v-model="sendData.ticketTime">
                            <label>
                                시간권 시간
                            </label>
                            <span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: pencil"/>
                        </ScInput>
                    </div>
                </div>
            </form>
        </div>
        <div class="uk-margin-top uk-text-center">
            <button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" @click="submitForm">
                {{ sendData.uid ? '수정': '생성' }}
            </button>
            <button v-if="sendData.uid" class="sc-button sc-button-secondary"
                    :disabled="submitStatus === 'PENDING'"
                    @click="deleteForm">
                삭제
            </button>
        </div>
        <h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">
            상품 리스트
        </h5>
        <div>
            <div class="uk-grid-small uk-child-width-1-4 uk-flex uk-text-small" uk-grid>
                <div v-for="(product,index) in productList" :key="index">
                    <a href="javascript:void(0)" @click.prevent="openInfo(product.uid)">
                        <div class="uk-card uk-card-default uk-card-body">
                            <!-- 티켓권 이름 -->
                            <div v-if="product.ticketDayTypeName==='주말'" class="uk-text-bold uk-text-primary">
                                {{product.ticketDayTypeName}}
                            </div>
                            <div v-else-if="product.ticketDayTypeName==='평일'" class="uk-text-bold"
                                 style="color: #66bb6a">{{product.ticketDayTypeName}}
                            </div>
                            <div v-else="" class="uk-text-bold uk-text-secondary">{{product.ticketDayTypeName}}</div>
                            <!-- 상품가격 -->
                            <div
                                    v-if="product.ticketPriceDiscountPercent === null || product.ticketPriceDiscountPercent ===0">
                                {{product.ticketPrice}}원
                            </div>
                            <div v-else="">
                                <div>
									<span
                                            style="opacity: 50%; text-decoration: line-through">{{product.ticketPrice}}원</span>
                                    <span style="color: red; font-size:8px; font-weight: bold">{{product.ticketPriceDiscountPercent}}%</span>
                                </div>
                                <div>{{product.ticketPrice - product.ticketPriceDiscount}}원</div>
                            </div>
                            <!-- -->
                            <div>{{product.ticketTypeName === '시간권'?product.ticketTime +' '+product.ticketTypeName:
                                product.ticketTypeName}}
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {validationMixin} from 'vuelidate'
    import {required, integer} from 'vuelidate/lib/validators'
    import Select2 from "@/components/Select2"
    import ScInput from "@/components/Input"
    import PrettyCheck from 'pretty-checkbox-vue/check'
    import confirmDatePlugin from "flatpickr/dist/plugins/confirmDate/confirmDate"
    import Convert from "@/plugins/convertJson"

    if (process.client) {
        require('~/plugins/flatpickr');
    }

    export default {
        components: {
            Select2,
            ScInput,
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
                submitStatus: null,
                siteUid: '',
                sendData: {},
                defaultForm: {
                    uid: null,
                    siteUid: null,
                    ticketType: null,
                    ticketDayType: null,
                    ticketTime: null,
                    ticketPrice: null,
                    ticketPriceDiscount: null,
                    ticketPriceDiscountPercent: null,
                    isActive: true,
                    ticketStartDate: '',
                    ticketEndDate: '',
                    ticketCount: null,
                    fee: 10
                },
                ticketDate: '',
                ticketDayTypeOpts: [],
                ticketTypeOpts: [],
                productList: []
            }
        },
        validations: {
            sendData: {
                ticketType: {
                    required
                },
                ticketDayType: {
                    required
                },
                ticketPrice: {
                    required,
                    integer
                },
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
            'ticketDate': function (newVal) {
                if (newVal.includes("~")) {
                    this.sendData.ticketStartDate = newVal.split('~')[0].trim();
                    this.sendData.ticketEndDate = newVal.split('~')[1].trim();
                }
            },
        },
        created() {
            let vm = this
            this.$nuxt.$on('open-product-list', (uid) => {
                vm.sendData = {}
                vm.siteUid = null
                vm.$v.$reset()
                vm.fetchData(uid)
                vm.sendData.siteUid = uid
            })
        },
        async beforeMount() {
            this.sendData = this.defaultForm
            let code = await this.$axios.$post(this.config.apiUrl + '/codes')
            this.ticketTypeOpts = Convert.convertJson(code.data.ticketTypeOpts, 'select')
            this.ticketDayTypeOpts = Convert.convertJson(code.data.ticketDayTypeOpts, 'select')
        },
        beforeDestroy() {
            this.$nuxt.$off('open-product-list')
        },
        methods: {
            async openInfo(selectUid) {
                let res = await this.$axios.$get(this.config.apiUrl + '/discountTickets/' + selectUid)
                this.sendData = res.data
                this.sendData.ticketType = String(res.data.ticketType)
            },
            async fetchData(siteUid) {
                this.productList = []
                let res = await this.$axios.$get(this.config.apiUrl + '/discountTickets', {
                    params: {
                        siteUid: siteUid
                    }
                })
                for (let i of res.data) {
                    this.productList.push(i)
                }
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
                this.$axios.$post(this.config.apiUrl + '/discountTickets', this.sendData).then(async res => {
                    this.callNotification('상품을 생성했습니다.')
                    this.$nuxt.$emit('open-product-list', this.sendData.siteUid)
                }).finally(() => {
                    this.submitStatus = 'OK'
                })
            },
            putForm() {
                this.$axios.$put(this.config.apiUrl + '/discountTickets/' + this.sendData.uid, this.sendData).then(async res => {
                    this.callNotification('수정하였습니다.')
                    this.$nuxt.$emit('open-product-list', this.sendData.siteUid)
                }).finally(() => {
                    this.submitStatus = 'OK'
                })
            },
            deleteForm() {
                this.$axios.$delete(this.config.apiUrl + '/discountTickets/' + this.sendData.uid, this.sendData).then(async res => {
                    this.callNotification('삭제하였습니다.')
                    this.$nuxt.$emit('open-product-list', this.sendData.siteUid)
                }).finally(() => {
                    this.deleteStatus = 'OK'
                })
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>
