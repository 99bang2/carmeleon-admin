<template>
    <div>
        <Transition name="slide-bottom-medium">
            <ScCard v-if="!cardFormClosed" style="min-height: 745px">
                <ScCardHeader separator>
                    <div class="uk-flex uk-flex-middle">
                        <div class="uk-flex-1">
                            <ScCardTitle>
                                <i class="mdi mdi-file-powerpoint-box"/>
                                {{ userName ? userName+'님의 주차장이용내역': '주차장이용내역' }}
                            </ScCardTitle>
                        </div>
                        <ScCardActions>
                            <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close"
                               @click.prevent="closeForm"/>
                        </ScCardActions>
                    </div>
                </ScCardHeader>
                <ScCardBody>
                    <div class="uk-flex uk-flex-around">
                        <button v-waves.button.light class="sc-button sc-button-outline sc-button-outline-danger uk-width-1-1"
                                @click="cancelPayment">
                            <span class="mdi mdi-cancel mdi-18px md-color-red-600 uk-margin-small-right"></span>
                            <span>결제취소</span>
                        </button>
                    </div>
                    <ag-grid-vue
                            style="width: 100%"
                            class="ag-theme-material"
                            :dom-layout="'autoHeight'"
                            :locale-text="localeText"
                            :default-col-def="defaultColDef"
                            :column-defs="columnDefs"
                            :grid-options="gridOptions"
                            :pagination="true"
                            :pagination-page-size="10"
                    >
                    </ag-grid-vue>
                </ScCardBody>
            </ScCard>
        </Transition>
    </div>
</template>

<script>
    import {agGridMixin} from "~/plugins/ag-grid.mixin"

    export default {
        mixins: [
            agGridMixin
        ],
        props: {
            mode: {
                type: String,
                default: 'list'
            }
        },
        data() {
            return {
                gridOptions: {
                    suppressRowClickSelection: true,
                    suppressMenuHide: true,
                    rowSelection: 'multiple',
                    onGridReady: this.onGridReady,
                    onFirstDataRendered: this.onFirstDataRendered,
                    rowHeight: 45,
                    getRowStyle: this.getRowStyle
                },
                cardFormClosed: true,
                userName: '',
                userUid:''
            }
        },
        computed: {
            columnDefs() {
                return [
                    {
                        headerName: "",
                        field: "",
                        width: 50,
                        resizable: false,
                        headerCheckboxSelection: true,
                        headerCheckboxSelectionFilteredOnly: true,
                        checkboxSelection: true,
                        suppressMovable: false,
                        onCellClicked: false,
                        cellStyle: {
                            'text-align': 'center',
                        }
                    },
                    {
                        headerName: '주차장명',
                        field: 'parkingSite.name',
                        width: 150
                    },
                    {
                        headerName: '결제정보',
                        field: 'discountTicket.ticketTitle',
                        width: 150
                    },
                    {
                        headerName: '가격',
                        field: 'discountTicket.ticketPrice',
                        width: 80
                    },
                    {
                        headerName: '결제상태',
                        field: 'status',
                        width: 90,
                        cellRenderer: (obj) => {
                            if (obj.data) {
                                let badge = ''
                                let status = ''
                                switch (obj.value) {
                                    case 10 :
                                        badge = 'md-bg-green-500'
                                        status = '결제완료'
                                        break
                                    case -10 :
                                        badge = 'md-bg-red-500'
                                        status = '결제실패'
                                        break
                                    case -20 :
                                        badge = 'md-bg-red-500'
                                        status = '결제취소'
                                        break
                                    default :
                                        badge = 'md-bg-gray-500'
                                        status = '결제대기중'
                                }
                                return `<span class="uk-badge ${badge}">${status}</span>`
                            }
                        }
                    }
                ]
            }
        },
        created() {
            let vm = this
            this.$nuxt.$on('open-payLog-list', (props) => {
                vm.fetchData(props.data.uid)
                this.userName = props.data.nickname
            })
            this.$nuxt.$on('close-payLog-list', () => {
                vm.closeForm()
            })
            this.$nuxt.$on('close-all-list', () => {
                vm.closeForm()
            })
        },
        beforeDestroy() {
            this.$nuxt.$off('open-payLog-list')
            this.$nuxt.$off('close-payLog-list')
            this.$nuxt.$off('close-all-list')
        },
        methods: {
            async fetchData(data) {
                this.cardFormClosed = false
                this.userUid = data
                let res = await this.$axios.$get(this.config.apiUrl + '/userPayLogs/' + data)
                this.gridOptions.api.setRowData(res.data)
            },
            closeForm() {
                this.cardFormClosed = true
                this.$nuxt.$emit('reset-user-list')
            },
            cancelPayment() {
                let selected = this.gridOptions.api.getSelectedRows()
                let selectedUids = selected.map(({uid}) => uid)
                let selectedCnt = selectedUids.length
                if(selectedCnt){
                    let tmpCnt = 0;
                    UIkit.modal.confirm(`선택한 항목을 결제 취소 하시겠습니까?`).then((res) => {
                        selectedUids.forEach(uid => {
                            this.$axios.$get(this.config.apiUrl + '/pg/'+uid).then(res=>{
                                if(res)tmpCnt++
                                if(tmpCnt === selectedCnt) {
                                    this.callNotification('결제가 취소되었습니다.')
                                    this.fetchData(this.userUid)
                                }
                            })
                        })
                    })
                }else{
                    this.callAlertError('결제를 취소할 항목을 선택해주세요')
                }
            }
        }
    }
</script>

<style scoped>

</style>
