<template>
    <div>
        <div class="uk-accordion-content">
            <h5 class="uk-heading-bullet uk-width-1-1">
                상품등록
            </h5>
            <form class="uk-grid-small uk-grid" data-uk-grid>
                <div class="uk-width-1-2 uk-margin-small-bottom">
                    <Select2
                            divStyle="padding:0"
                            v-model="sendData.ticketCategory"
                            :options="ticketCategoryOpts"
                            :settings="{ 'width': '100%', 'placeholder': '상품 구분' }"
                            :error-state="$v.sendData.ticketCategory.$error"
                    />
                    <ul class="sc-vue-errors">
                        <li v-if="!$v.sendData.ticketCategory.required">
                            상품 구분을 선택하세요.
                        </li>
                    </ul>
                </div>
                <div class="uk-width-1-2 uk-margin-small-bottom">
                    <Select2
                            divStyle="padding:0"
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
                <div class="uk-width-1-2 uk-margin-small-bottom">
                    <Select2
                            divStyle="padding:0"
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
                <div class="uk-width-1-2 uk-margin-small-bottom">
                    <div class="uk-grid-small uk-grid" data-uk-grid>
                        <ScInput v-model="ticketDate" v-flatpickr="dpRange" placeholder="판매 기간">
                            <span slot="icon" class="uk-form-icon" data-uk-icon="calendar"></span>
                        </ScInput>
                    </div>
                </div>
                <div class="uk-width-1-3 uk-margin-small-bottom">
                    <div class="uk-margin uk-heading-hero" style="text-align: left; margin-left:5px; margin-bottom: 0; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;"><span>발렛</span></div>
                    <PrettyCheck v-model="sendData.includeValet" class="p-switch" color="primary">
                        {{sendData.includeValet?"포함":"미포함"}}
                    </PrettyCheck>
                </div>
                <div class="uk-width-1-1 uk-margin-small-bottom">
                    <div class="uk-margin uk-heading-hero" style="text-align: left; margin-left:5px; margin-bottom: 0; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;"><span>주차가능시간</span></div>
                    <div style="display: flex;">
                        <PrettyCheck v-model="alwaysParkingTime" class="p-switch" color="primary">{{ alwaysParkingTime ? "항상":"시간대지정" }}</PrettyCheck>
                        <div v-if="!alwaysParkingTime" style="display: flex; align-items: center; margin-left: 20px;">
                            <select v-model="sendData.parkingStartTimeHour" class="uk-select" style="width: 25%;">
                                <option value="">시간</option>
                                <option v-for="i in 24" :key="i" :value="i-1 < 10 ? `0${i-1}` : `${i-1}`">{{i-1}}시</option>
                            </select>
                            <span style="padding:0 2px;">:</span>
                            <select v-model="sendData.parkingStartTimeMinute" class="uk-select" style="width: 25%;">
                                <option value="">분</option>
                                <option value="00">00분</option>
                                <option value="10">10분</option>
                                <option value="20">20분</option>
                                <option value="30">30분</option>
                                <option value="40">40분</option>
                                <option value="50">50분</option>
                            </select>
                            <span style="padding:0 5px;">~</span>
                            <select v-model="sendData.parkingEndTimeHour" class="uk-select" style="width: 25%;">
                                <option value="">시간</option>
                                <option v-for="i in 24" :key="i" :value="i-1 < 10 ? `0${i-1}` : `${i-1}`">{{i-1}}시</option>
                            </select>
                            <span style="padding:0 2px;">:</span>
                            <select v-model="sendData.parkingEndTimeMinute" class="uk-select" style="width: 25%;">
                                <option value="">분</option>
                                <option value="00">00분</option>
                                <option value="10">10분</option>
                                <option value="20">20분</option>
                                <option value="30">30분</option>
                                <option value="40">40분</option>
                                <option value="50">50분</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="uk-width-1-1 uk-margin-small-bottom">
                    <div class="uk-margin uk-heading-hero" style="text-align: left; margin-left:5px; margin-bottom: 0; color:rgba(0, 0, 0, 0.54);font-size: 0.75rem;"><span>구매가능시간</span></div>
                    <div style="display: flex;">
                        <PrettyCheck v-model="alwaysSellingTime" class="p-switch" color="primary">{{ alwaysSellingTime ? "항상":"시간대지정" }}</PrettyCheck>
                        <div v-if="!alwaysSellingTime" style="display: flex; align-items: center; margin-left: 20px;">
                            <select v-model="sendData.sellingStartTimeHour" class="uk-select" style="width: 25%;">
                                <option value="">시간</option>
                                <option v-for="i in 24" :key="i" :value="i-1 < 10 ? `0${i-1}` : `${i-1}`">{{i-1}}시</option>
                            </select>
                            <span style="padding:0 2px;">:</span>
                            <select v-model="sendData.sellingStartTimeMinute" class="uk-select" style="width: 25%;">
                                <option value="">분</option>
                                <option value="00">00분</option>
                                <option value="10">10분</option>
                                <option value="20">20분</option>
                                <option value="30">30분</option>
                                <option value="40">40분</option>
                                <option value="50">50분</option>
                            </select>
                            <span style="padding:0 5px;">~</span>
                            <select v-model="sendData.sellingEndTimeHour" class="uk-select" style="width: 25%;">
                                <option value="">시간</option>
                                <option v-for="i in 24" :key="i" :value="i-1 < 10 ? `0${i-1}` : `${i-1}`">{{i-1}}시</option>
                            </select>
                            <span style="padding:0 2px;">:</span>
                            <select v-model="sendData.sellingEndTimeMinute" class="uk-select" style="width: 25%;">
                                <option value="">분</option>
                                <option value="00">00분</option>
                                <option value="10">10분</option>
                                <option value="20">20분</option>
                                <option value="30">30분</option>
                                <option value="40">40분</option>
                                <option value="50">50분</option>
                            </select>
                        </div>
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
                <div v-if="sendData.ticketType==='1'" class="uk-width-1-2">
                    <ScInput v-model="sendData.ticketTime">
                        <label>
                            시간권 시간
                        </label>
                        <span slot="icon" class="uk-form-icon uk-form-icon-flip" data-uk-icon="icon: pencil"/>
                    </ScInput>
                </div>
            </form>
        </div>
        <div class="uk-margin-top uk-text-center">
            <button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING' || (!sendData.uid && this.$auth.user.grade > 0)" @click="submitForm">
                {{ sendData.uid ? '수정': '생성' }}
            </button>
            <button v-if="sendData.uid" class="sc-button sc-button-secondary"
                    :disabled="submitStatus === 'PENDING' || this.$auth.user.grade > 0"
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
                            <div v-if="product.ticketPriceDiscountPercent === null || product.ticketPriceDiscountPercent ===0">
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
                    ticketCategory: null,
                    ticketType: null,
                    ticketDayType: null,
                    ticketTime: null,
                    ticketPrice: null,
                    ticketPriceDiscount: null,
                    ticketPriceDiscountPercent: null,
                    isActive: true,
                    includeValet: false,
                    ticketStartDate: '',
                    ticketEndDate: '',
                    ticketCount: null,
                    fee: 10,
                    parkingStartTime: null,
                    parkingEndTime: null,
                    sellingStartTime: null,
                    sellingEndTime: null,
                    parkingStartTimeHour: '',
                    parkingStartTimeMinute: '',
                    parkingEndTimeHour: '',
                    parkingEndTimeMinute: '',
                    sellingStartTimeHour: '',
                    sellingStartTimeMinute: '',
                    sellingEndTimeHour: '',
                    sellingEndTimeMinute: '',
                },
                ticketDate: '',
                ticketDayTypeOpts: [],
                ticketTypeOpts: [],
                ticketCategoryOpts: [],
                productList: [],
                alwaysParkingTime: true,
                alwaysSellingTime: true,
            }
        },
        validations: {
            sendData: {
                ticketCategory: {
                    required
                },
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
                fee: {
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
                this.sendData = JSON.parse(JSON.stringify(this.defaultForm))
                this.alwaysSellingTime = true
                this.alwaysParkingTime = true
                vm.siteUid = null
                vm.ticketDate = ''
                vm.$v.$reset()
                vm.fetchData(uid)
                vm.sendData.siteUid = uid
            })
        },
        async beforeMount() {
            let code = await this.$axios.$post(this.config.apiUrl + '/codes')
            this.ticketTypeOpts = Convert.convertJson(code.data.ticketTypeOpts, 'select')
            this.ticketCategoryOpts = Convert.convertJson(code.data.ticketCategories, 'select')
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
                this.ticketDate = this.$moment(this.sendData.ticketStartDate).format('YYYY-MM-DD') + ' ~ ' + this.$moment(this.sendData.ticketEndDate).format('YYYY-MM-DD')
                this.alwaysSellingTime = !(this.sendData.sellingEndTime && this.sendData.sellingStartTime)
                this.alwaysParkingTime = !(this.sendData.parkingEndTime && this.sendData.parkingStartTime)
                console.log(res.data)
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
                    this.sendData.parkingStartTime = this.alwaysParkingTime ? null : this.sendData.parkingStartTimeHour + this.sendData.parkingStartTimeMinute
                    this.sendData.parkingEndTime = this.alwaysParkingTime ? null : this.sendData.parkingEndTimeHour + this.sendData.parkingEndTimeMinute
                    this.sendData.sellingStartTime = this.alwaysSellingTime ? null : this.sendData.sellingStartTimeHour + this.sendData.sellingStartTimeMinute
                    this.sendData.sellingEndTime = this.alwaysSellingTime ? null : this.sendData.sellingEndTimeHour + this.sendData.sellingEndTimeMinute
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
