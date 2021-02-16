<template>
    <div>
        <Transition name="slide-bottom-medium">
            <ScCard v-if="!cardFormClosed" style="min-height: 680px">
                <ScCardHeader separator>
                    <div class="uk-flex uk-flex-middle">
                        <div class="uk-flex-1">
                            <ScCardTitle>
                                이용내역 상세
                            </ScCardTitle>
                        </div>
                        <ScCardActions>
                            <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close"
                               @click.prevent="closeDetail"/>
                        </ScCardActions>
                    </div>
                </ScCardHeader>
                <ScCardBody style="padding-top:0px;">
                    <div class="booking uk-grid">
                        <div class="booking-block uk-width-1-1">
                            <h6 class="uk-heading-bullet uk-margin-top">주문번호</h6>
                            <div class="booking-block__content">{{defaultDetail.paymentsData.tid}}</div>
                        </div>
                        <div class="booking-block uk-width-1-2">
                            <h6 class="uk-heading-bullet uk-margin-top">세차장명</h6>
                            <div class="booking-block__content">{{defaultDetail.carWashName}}</div>
                        </div>
                        <div class="booking-block uk-width-1-2">
                            <h6 class="uk-heading-bullet uk-margin-top">차량번호</h6>
                            <div class="booking-block__content">{{defaultDetail.carPlate}}</div>
                        </div>
                        <div class="booking-block uk-width-1-2">
                            <h6 class="uk-heading-bullet uk-margin-top">연락처</h6>
                            <div class="booking-block__content">{{defaultDetail.phone}}</div>
                        </div>
                        <div class="booking-block uk-width-1-2">
                            <h6 class="uk-heading-bullet uk-margin-top">예약시간</h6>
                            <div class="booking-block__content">{{defaultDetail.bookingDateTime | formatTimeHour}}</div>
                        </div>
                        <div class="booking-block uk-width-1-2">
                            <h6 class="uk-heading-bullet uk-margin-top">결제상품</h6>
                            <div class="booking-block__content">{{defaultDetail.product.name}}</div>
                        </div>
                        <div class="booking-block uk-width-1-2" v-if="defaultDetail.optionPrices.length >0">
                            <h6 class="uk-heading-bullet uk-margin-top">옵션정보</h6>
                            <div class="booking-block__content" v-for="(option,i) in defaultDetail.optionPrices" :key="i">{{option.name}}</div>
                        </div>
                        <div class="booking-block uk-width-1-2">
                            <h6 class="uk-heading-bullet uk-margin-top">결제상태</h6>
                            <div class="booking-block__content">{{defaultDetail.clientStatus | formatClientStatus}}</div>
                        </div>
                        <div class="booking-block uk-width-1-2">
                            <h6 class="uk-heading-bullet uk-margin-top">결제가격</h6>
                            <div class="booking-block__content">{{defaultDetail.paymentsData.price | addCommaToNumber}}원</div>
                        </div>
                        <div class="booking-block uk-width-1-2">
                            <h6 class="uk-heading-bullet uk-margin-top">결제일</h6>
                            <div class="booking-block__content">{{defaultDetail.createdAt | formatTimeHour}}</div>
                        </div>
                        <div class="booking-block uk-width-1-2">
                            <h6 class="uk-heading-bullet uk-margin-top">환불사유</h6>
                            <div class="booking-block__content">{{defaultDetail.cancelReason}}</div>
                        </div>
                        <div class="booking-block uk-width-1-2" v-if="defaultDetail.clientStatus === 'refunding'">
                            <h6 class="uk-heading-bullet uk-margin-top">환불요청시간</h6>
                            <div class="booking-block__content">{{defaultDetail.cancelRequestTime | formatTimeHour}}</div>
                        </div>
                        <div class="booking-block uk-width-1-2" v-if="defaultDetail.clientStatus === 'refunded'">
                            <h6 class="uk-heading-bullet uk-margin-top">환불완료시간</h6>
                            <div class="booking-block__content">{{defaultDetail.cancelRequestTime | formatTimeHour}}</div>
                        </div>
                    </div>
                    <div class="uk-margin-top uk-text-center">
                        <button class="sc-button sc-button-secondary" v-if="defaultDetail.clientStatus === 'cancel'||'used'||'expired' " @click="cancelPayment(defaultDetail)">결제취소</button>
                        <button v-if="defaultDetail.clientStatus === 'refunding'" class="sc-button sc-button-primary" @click="refundProcess(defaultDetail)">환불승인</button>
                        <button v-if="defaultDetail.clientStatus === 'refunding'" class="sc-button sc-button-danger" @click="refundReject(defaultDetail)">환불거절</button>
                    </div>
                </ScCardBody>
            </ScCard>
        </Transition>
    </div>
</template>

<script>
export default {
    props: {
        mode: {
            type: String,
            default: 'list'
        }
    },
    data() {
        return {
            cardFormClosed: true,
            reason: null,
            sendData: {},
            defaultDetail: {},
        }
    },
    created() {
        let vm = this
        this.$nuxt.$on('open-booking-detail', (data) => {
            vm.openDetail(data)
        })
        this.$nuxt.$on('close-booking-detail', () => {
            vm.closeForm()
        })
    },
    beforeDestroy() {
        this.$nuxt.$off('open-booking-detail')
        this.$nuxt.$off('close-booking-detail')
    },
    methods: {
        async openDetail(props){
            if (props) {
                this.defaultDetail = JSON.parse(JSON.stringify(props.data))
                let data = this.defaultDetail
            }
            this.cardFormClosed = true
            setTimeout(() => {
                this.cardFormClosed = false
            }, 100)
        },
        closeDetail(){
            this.cardFormClosed = true
            this.$nuxt.$emit('reset-booking-detail')
        },
        cancelPayment(data) {
            UIkit.modal.prompt(`결제 취소 사유를 작성해주세요`, this.reason).then((cancelReason) => {
                new Promise(resolve => {
                    this.$axios.$post(this.config.apiUrl + '/bookingRefundApprove',{
                        reason: cancelReason,
                        uids: data.uid,
                        paymentsData: data.paymentsData,
                        cancelStatus: data.cancelStatus,
                        cancelRequestTime: data.cancelRequestTime
                    }).then(res => {
                        if (res.data.result){
                            this.callNotification(`정상적으로 취소되었습니다.`)
                            this.$nuxt.$emit('fetch-booking-list')
                        }
                    }).then(() => resolve())
                })
            })
        },
        refundProcess(data) {
            UIkit.modal.confirm(`승인 하시겠습니까?`, this.reason).then(() => {
                new Promise(resolve => {
                    this.$axios.$post(this.config.apiUrl + '/bookingRefundApprove',{
                        reason: data.cancelReason,
                        uids: data.uid,
                        paymentsData: data.paymentsData,
                        cancelStatus: data.cancelStatus,
                        cancelRequestTime: data.cancelRequestTime
                    }).then(res => {
                        if (res.data.result){
                            this.callNotification(`정상적으로 취소되었습니다.`)
                            this.$nuxt.$emit('fetch-booking-list')
                        }
                    }).then(() => resolve())
                })
            })
        },
        refundReject(data) {
            UIkit.modal.confirm(`거절 하시겠습니까?`, this.reason).then(() => {
                new Promise(resolve => {
                    this.$axios.$post(this.config.apiUrl + '/bookingRefundReject',{
                        reason: this.defaultDetail.cancelReason,
                        uids: uid,
                        paymentsData: data.paymentsData,
                        cancelStatus: data.cancelStatus,
                        cancelRequestTime: data.cancelRequestTime
                    }).then(res => {
                        if (res.data.result){
                            this.callNotification(`정상적으로 거절되었습니다.`)
                            this.$nuxt.$emit('fetch-booking-list')
                        }
                    }).then(() => resolve())
                })
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.uk-margin-top{
    margin-top: 15px !important;
}
.booking{
    min-height: 500px;
    padding-bottom: 15px;
    &-block{
        padding-bottom: 5px;
        &__content{
            margin: -5px 10px;
            font-size: 13px;
            font-weight: 500;
        }
    }
}
</style>
