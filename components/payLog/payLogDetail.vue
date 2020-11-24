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
                    <div class="payLog uk-grid">
                        <div class="payLog-block uk-width-1-1">
                            <h5 class="uk-heading-bullet uk-margin-top">주문번호</h5>
                            <div class="payLog-block__content">{{defaultDetail.payOid}}</div>
                        </div>
                        <div class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">주차장명</h5>
                            <div class="payLog-block__content">{{defaultDetail.parkingSite.name}}</div>
                        </div>
                        <div class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">할인권</h5>
                            <div class="payLog-block__content">{{defaultDetail.discountTicket.ticketTitle}}</div>
                        </div>
                        <div class="payLog-block uk-width-1-3">
                            <h5 class="uk-heading-bullet uk-margin-top">차량번호</h5>
                            <div class="payLog-block__content">{{defaultDetail.carNumber}}</div>
                        </div>
                        <div class="payLog-block uk-width-1-3">
                            <h5 class="uk-heading-bullet uk-margin-top">연락처</h5>
                            <div class="payLog-block__content">{{defaultDetail.phoneNumber}}</div>
                        </div>
                        <div class="payLog-block uk-width-1-3">
                            <h5 class="uk-heading-bullet uk-margin-top">예약시간</h5>
                            <div class="payLog-block__content">{{defaultDetail.reserveTime}}</div>
                        </div>
                        <div class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">결제수단</h5>
                            <div class="payLog-block__content">{{defaultDetail.payTypeName}}</div>
                        </div>
                        <div class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">결제상태</h5>
                            <div class="payLog-block__content">{{defaultDetail.statusName}} <button v-if="defaultDetail.status === 10 && defaultDetail.cancelStatus < 0" @click="cancelPayment(defaultDetail.uid)">결제 취소</button></div>

                        </div>
                        <div class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">상품가격</h5>
                            <div class="payLog-block__content">{{defaultDetail.price}}원</div>
                        </div>
                        <div class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">할인가격</h5>
                            <div class="payLog-block__content">{{defaultDetail.discountPrice}}원</div>
                        </div>
                        <div class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">사용 포인트</h5>
                            <div class="payLog-block__content">{{defaultDetail.point}}p</div>
                        </div>
                        <div class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">구매 가격</h5>
                            <div class="payLog-block__content">{{defaultDetail.sellingPrice}}원</div>
                        </div>
                        <div class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">결제가격</h5>
                            <div class="payLog-block__content">{{defaultDetail.totalPrice}}원</div>
                        </div>
                        <div class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">결제일</h5>
                            <div class="payLog-block__content">{{defaultDetail.createdAt}}</div>
                        </div>
                        <div class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">이메일</h5>
                            <div class="payLog-block__content">{{defaultDetail.email}}</div>
                        </div>
                        <div class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">이용여부</h5>
                            <div class="payLog-block__content">{{defaultDetail.activeStatusName}}</div>
                        </div>
                        <div v-if="defaultDetail.cancelStatus >= 0"  class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">환불상태</h5>
                            <div class="payLog-block__content">{{defaultDetail.cancelStatusName}} <button v-if="defaultDetail.cancelStatus === 0 && defaultDetail.status !== -20" @click="refundProcess(defaultDetail.uid)">승인</button> <button v-if="defaultDetail.cancelStatus === 0 && defaultDetail.status !== -20" @click="refundReject(defaultDetail.uid)">거절</button></div>

                        </div>
                        <div v-if="defaultDetail.cancelStatus >= 0"  class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">환불이유</h5>
                            <div class="payLog-block__content">{{defaultDetail.cancelReason}}</div>
                        </div>
                        <div class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">최종상태</h5>
                            <div class="payLog-block__content">{{defaultDetail.clientStatusName}}</div>
                        </div>
                        <div v-if="defaultDetail.cancelStatus >= 0" class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">환불요청시간</h5>
                            <div class="payLog-block__content">{{defaultDetail.cancelRequestTime}}</div>
                        </div>
                        <div v-if="defaultDetail.cancelStatus >= 0" class="payLog-block uk-width-1-2">
                            <h5 class="uk-heading-bullet uk-margin-top">환불완료시간</h5>
                            <div class="payLog-block__content">{{defaultDetail.cancelCompleteTime}}</div>
                        </div>
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
            defaultDetail: {
                uid: null,
                carNumber: '',
                phoneNumber: '',
                reserveTime: '',
                payTypeName: '',
                status: null,
                price: null,
                discountPrice: null,
                totalPrice: null,
                fee: null,
                userUid: null,
                siteUid: null,
                discountTicketUid: null,
                cardUid: null,
                createdAt: '',
                email: '',
                payOid: '',
                activeStatus: null,
                cancelStatus: null,
                cancelReason: '',
                expired: null,
                cancelRequestTime: '',
                cancelCompleteTime: '',
                user: {},
                parkingSite: {
                    name: ''
                },
                discountTicket: {
                    ticketTitle: '',
                },
                point: null,
                sellingPrice: null,

            },
        }
    },
    created() {
        let vm = this
        this.$nuxt.$on('open-payLog-detail', (data) => {
            vm.openDetail(data)
        })
        this.$nuxt.$on('close-payLog-detail', () => {
            vm.closeForm()
        })
    },
    beforeDestroy() {
        this.$nuxt.$off('open-payLog-detail')
        this.$nuxt.$off('close-payLog-detail')
    },
    methods: {
        async openDetail(props){
            if (props) {
                this.defaultDetail = JSON.parse(JSON.stringify(props.data))
                let data = this.defaultDetail
                switch (data.status){
                    case 0: data.statusName = "결제대기"
                    break
                    case 10: data.statusName = "결제완료"
                    break
                    case -10: data.statusName = "결제실패"
                    break
                    case -20: data.statusName = "결제취소"
                    break
                }
                switch (data.cancelStatus){
                    case -1: data.cancelStatusName = "신청없음"
                        break
                    case 0: data.cancelStatusName = "환불신청"
                        break
                    case 10: data.cancelStatusName = "환불완료"
                        break
                    case -10: data.cancelStatusName = "환불거절"
                        break
                }
                switch (data.clientStatus){
                    case "used": data.clientStatusName = "사용완료"
                        break
                    case "expired": data.clientStatusName = "기간만료"
                        break
                    case "refunding": data.clientStatusName = "환불신청"
                        break
                    case "refunded": data.clientStatusName = "환불완료"
                        break
                    case "paid": data.clientStatusName = "결제완료"
                        break
                }
                if(data.activeStatus){
                    data.activeStatusName = "사용 완료"
                }else{
                    data.activeStatusName = "사용 안함"
                }
                data.createdAt = this.$moment(data.createdAt).format('YYYY-MM-DD HH:mm')
                if(data.cancelRequestTime){
                    data.cancelRequestTime = this.$moment(data.cancelRequestTime).format('YYYY-MM-DD HH:mm')
                }
                if(data.cancelCompleteTime){
                    data.cancelCompleteTime = this.$moment(data.cancelCompleteTime).format('YYYY-MM-DD HH:mm')
                }
            }
            this.cardFormClosed = true
            setTimeout(() => {
                this.cardFormClosed = false
            }, 100)
        },
        closeDetail(){
            this.cardFormClosed = true
            this.$nuxt.$emit('reset-payLog-detail')
        },
        cancelPayment(uid) {
            UIkit.modal.prompt(`결제 취소 사유를 작성해주세요`, this.reason).then((cancelReason) => {
                new Promise(resolve => {
                    this.$axios.$post(this.config.apiUrl + '/pg',{
                        reason: cancelReason,
                        uids: uid
                    }).then(res => {
                        if (res.data.result){
                            this.callNotification(`정상적으로 취소되었습니다.`)
                            this.$nuxt.$emit('fetch-paylog-list')
                        }
                    }).then(() => resolve())
                })
            })
        },
        refundProcess(uid) {
            UIkit.modal.confirm(`승인 하시겠습니까?`, this.reason).then((cancelReason) => {
                new Promise(resolve => {
                    this.$axios.$post(this.config.apiUrl + '/refundApprove',{
                        reason: this.defaultDetail.cancelReason,
                        uids: uid
                    }).then(res => {
                        if (res.data.result){
                            this.callNotification(`정상적으로 취소되었습니다.`)
                            this.$nuxt.$emit('fetch-paylog-list')
                        }
                    }).then(() => resolve())
                })
            })
        },
        refundReject(uid) {
            UIkit.modal.confirm(`거절 하시겠습니까?`, this.reason).then((cancelReason) => {
                new Promise(resolve => {
                    this.$axios.$post(this.config.apiUrl + '/refundReject',{
                        reason: this.defaultDetail.cancelReason,
                        uids: uid
                    }).then(res => {
                        if (res.data.result){
                            this.callNotification(`정상적으로 거절되었습니다.`)
                            this.$nuxt.$emit('fetch-paylog-list')
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
.payLog{
    min-height: 490px;
    padding-bottom: 15px;
    &-block{
        padding-bottom: 5px;
        &__content{
            margin: -5px 10px;
        }
    }
}
</style>
