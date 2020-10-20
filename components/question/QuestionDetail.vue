<template>
    <div>
        <Transition name="slide-bottom-medium">
            <ScCard v-if="!cardFormClosed" style="min-height: 680px">
                <ScCardHeader separator>
                    <div class="uk-flex uk-flex-middle">
                        <div class="uk-flex-1">
                            <ScCardTitle>
                                <i class="mdi mdi-details"></i>
                                문의사항 내용
                            </ScCardTitle>
                        </div>
                        <ScCardActions>
                            <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close"
                               @click.prevent="closeDetail"/>
                        </ScCardActions>
                    </div>
                </ScCardHeader>
                <ScCardBody style="padding-top:0px;">
                    <div class="question">
                        <div class="question-block">
                            <h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">제목</h5>
                            <div class="question-block__content">{{defaultDetail.title}}</div>
                        </div>
                        <div class="question-block">
                            <h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">작성자</h5>
                            <div class="question-block__content">{{defaultDetail.name}}</div>
                        </div>
                        <div class="question-block">
                            <h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">구분</h5>
                            <div class="question-block__content">{{defaultDetail.categoryName}}</div>
                        </div>
                        <div class="question-block">
                            <h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">이메일주소</h5>
                            <div class="question-block__content">{{defaultDetail.email}}</div>
                        </div>
                        <div class="question-block">
                            <h5 class="uk-heading-bullet uk-margin-top uk-width-1-1">내용</h5>
                            <div class="question-block__content" v-html="defaultDetail.content"></div>
                        </div>
                    </div>
                    <div class="footer uk-text-center">
                        <button class="sc-button sc-button-primary" @click="deleteDetail">
                            삭제
                        </button>
                    </div>
                </ScCardBody>
            </ScCard>
        </Transition>
    </div>
</template>

<script>
    export default {
        data() {
            return{
                cardFormClosed: true,
                defaultDetail: {
                    uid: null,
                    name:'',
                    email:'',
                    categoryName:'',
                    title: '',
                    content: '',
                }
            }
        },
        created() {
            let vm = this
            this.$nuxt.$on('open-question-detail', (data) => {
                vm.openDetail(data)
            })
            this.$nuxt.$on('close-question-detail', () => {
                vm.closeDetail()
            })
        },
        beforeDestroy() {
            this.$nuxt.$off('open-question-detail')
            this.$nuxt.$off('close-question-detail')
        },
        methods:{
            openDetail(props){
                if (props) {
                    this.defaultDetail = JSON.parse(JSON.stringify(props.data))
                }
                this.cardFormClosed = true
                setTimeout(() => {
                    this.cardFormClosed = false
                }, 100)
            },
            closeDetail(){
                this.cardFormClosed = true
                this.$nuxt.$emit('reset-question-list')
            },
            deleteDetail() {
                this.$axios.$delete(this.config.apiUrl + '/questions/' + this.defaultDetail.uid, this.defaultDetail).then(async res => {
                    this.callNotification('삭제하였습니다.')
                    this.$nuxt.$emit('fetch-question-list')
                }).finally(() => {
                    this.deleteStatus = 'OK'
                    this.cardFormClosed = true
                })
            },
        },
    }
</script>

<style lang="scss" scoped>
    .question{
        min-height: 490px;
        padding-bottom: 15px;
        &-block{
            padding-bottom: 5px;
            &__content{
                margin: 10px 30px;
            }
        }
    }
</style>