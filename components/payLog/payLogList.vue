<template>
    <div>
        <ScCard>
            <ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
                <div class="uk-flex-1">
                    <ScCardTitle>
                        <slot><i class="mdi mdi-calendar-text"/> 이용내역 관리</slot>
                    </ScCardTitle>
                </div>
            </ScCardHeader>
            <ScCardBody>
                <div class="sc-padding-medium sc-round sc-border md-bg-grey-100 uk-grid-small uk-grid"
                     data-uk-grid>
                    <a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline"
                       style="height:40px;" @click.prevent="refreshFilter">
                        <i class="mdi mdi-refresh"></i>
                    </a>
                    <div class="uk-width-3-5@s">
                        <SearchMenu :search-data="searchData" :search-keyword="true"></SearchMenu>
                    </div>
                    <div style="width: 13%">
                        <Select2 style="padding-top: 0px"
                                 v-model="searchStatus"
                                 :options="statusOpts"
                                 :settings="{ 'width': '100%', 'placeholder': '상태' }"
                        />
                    </div>
                    <div class="uk-width-1-5@s">
                        <ScInput v-model="searchKeyword" placeholder="검색">
                            <span slot="icon" class="uk-form-icon" data-uk-icon="search"/>
                        </ScInput>
                    </div>
                </div>
                <ag-grid-vue
                        style="width: 100%;"
                        class="ag-theme-material"
                        :dom-layout="'autoHeight'"
                        :locale-text="localeText"
                        :default-col-def="defaultColDef"
                        :column-defs="columnDefs"
                        :grid-options="gridOptions"
                        :pagination="true"
                        :pagination-page-size="10"
                        :row-model-type="'infinite'"
                        :cache-overflow-size="10"
                        :cache-block-size="10"
                        :max-concurrent-datasource-requests="1"
                        :max-blocks-in-cache="10"
                        :framework-components="frameworkComponents"
                >
                </ag-grid-vue>
            </ScCardBody>
        </ScCard>
    </div>
</template>

<script>
import {agGridMixin} from "@/plugins/ag-grid.mixin";
import ScInput from '~/components/Input'
import SearchMenu from "@/components/common/SearchMenu"
import Select2 from "@/components/Select2"

export default {
    components: {
        SearchMenu,
        ScInput,
        Select2
    },
    mixins: [
        agGridMixin
    ],
    data() {
        return {
            gridOptions: {
                suppressRowClickSelection: true,
                suppressMenuHide: true,
                rowSelection: 'multiple',
                onGridReady: this.onGridReady,
                onFirstDataRendered: this.onFirstDataRendered,
                onCellClicked: this.onRowClicked,
                rowHeight: 45,
                getRowStyle: this.getRowStyle
            },
            searchData: {
                searchDate: `${this.$moment(new Date()).add(-7, 'days').format('YYYY-MM-DD')} ~ ${this.$moment(new Date()).format('YYYY-MM-DD')}`
            },
            searchStatus: 'all',
            searchKeyword: '',
            statusOpt: [],
            resUid: 0
        }
    },
    computed: {
        columnDefs() {
            return [
                {
                    headerName: '주문번호',
                    field: 'payOid',
                    suppressSizeToFit: true,
                },
                {
                    headerName: '차량번호',
                    field: 'carNumber',
                    width:100
                },
                {
                    headerName: '연락처',
                    field: 'phoneNumber',
                    width: 120,
                    cellRenderer: (obj) => {
                        if (obj && obj.value) {
                            return obj.value
                        } else {
                            return '-'
                        }
                    }
                },
                {
                    headerName: '예약시간',
                    field: 'reserveTime',
                    width: 80
                },
                {
                    headerName: '결제수단',
                    field: 'payType',
                    width: 100,
                    cellRenderer: (obj) => {
                        if(obj){
                            switch (obj.value){
                                case "card": return "카드"
                                case "coopPayment": return "모바일상품권"
                            }
                            return "카드"
                        }
                    }
                },
                {
                    headerName: '결제금액',
                    field: 'totalPrice',
                    width: 80
                },
                {
                    headerName: '결제상태',
                    field: 'status',
                    width: 80,
                    cellRenderer: (obj) => {
                        if(obj){
                            switch (obj.value){
                                case 0: return "결제대기"
                                case 10: return "결제완료"
                                case -10: return "결제실패"
                                case -20: return "결제취소"
                            }
                        }
                    }
                },
                {
                    headerName: '사용여부',
                    field: 'activeStatus',
                    width: 80,
                    cellRenderer: (obj) => {
                        if(obj){
                            if(obj.value){
                                return "사용완료"
                            }
                            return "사용안함"
                        }
                    }
                },
                {
                    headerName: '환불상태',
                    field: 'cancelStatus',
                    width: 80,
                    cellRenderer: (obj) => {
                        if(obj){
                            switch (obj.value){
                                case -1: return ""
                                case 0: return "환불신청"
                                case 10: return "환불완료"
                                case -10: return "환불거절"
                            }
                        }
                    }
                },
                {
                    headerName: '상태',
                    field: 'clientStatus',
                    width: 80,
                    cellRenderer: (obj) => {
                        if(obj){
                            switch (obj.value){
                                case "used": return "사용완료"
                                case "expired": return "기간만료"
                                case "refunding": return "환불신청"
                                case "refunded": return "환불완료"
                                case "paid": return "결제완료"
                            }
                        }
                    }
                },
                {
                    headerName: '생성일',
                    field: 'createdAt',
                    width: 150,
                    valueFormatter: obj => {
                        return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
                    }
                }
            ]
        },
        statusOpts() {
            return [
                {
                    id: "all",
                    text: "전체"
                },
                {
                    id: "used",
                    text: "사용완료"
                },
                {
                    id: "expired",
                    text: "기간만료"
                },
                {
                    id: "refunding",
                    text: "환불신청"
                },
                {
                    id: "refunded",
                    text: "환불완료"
                },
                {
                    id: "paid",
                    text: "결제완료"
                }
            ]
        }
    },
    watch: {
        'searchData.searchDate': function (newValue) {
            this.fetchData()
        },
        'searchKeyword': function (newValue) {
            this.fetchData()
        },
        'searchStatus': function (newValue) {
            this.fetchData()
        }
    },
    created() {
        let vm = this
        this.$nuxt.$on('reset-paylog-list', () => {
            vm.resetSelection()
        })
        this.$nuxt.$on('fetch-paylog-list', (uid) => {
            this.resUid = uid
            vm.fetchData()
        })
        this.defaultColDef.sortable = false
    },
    beforeDestroy() {
        this.$nuxt.$off('reset-paylog-list')
        this.$nuxt.$off('fetch-paylog-list')
    },
    async mounted() {
        await this.fetchData()
    },
    methods: {
        async onGridReady(params) {
            const updateData = async context => {
                let dataSource = {
                    rowCount: null,
                    getRows: async (params) => {
                        let lastRow = -1
                        let order = []
                        for (let sort of params.sortModel) {
                            order.push([sort.colId, sort.sort])
                        }
                        let parameters = {
                            offset: params.startRow,
                            limit: params.endRow - params.startRow,
                            order: order
                        }
                        await context.$axios.$get(this.config.apiUrl + '/payLogs', {
                            params: {
                                searchData: {
                                    searchDate: context.searchData.searchDate,
                                    searchKeyword: context.searchKeyword,
                                    searchStatus: context.searchStatus
                                },
                                offset: parameters.offset,
                                limit: parameters.limit,
                                order: parameters.order,
                            }
                        }).then(response => {
                            let rowsThisPage = response.data.rows
                            lastRow = response.data.count
                            params.successCallback(rowsThisPage, lastRow)
                            if(context.resUid) {
                                context.gridOptions.api.forEachNode((node) => {
                                    if(node.data.uid === context.resUid) {
                                        context.openNewForm({
                                            node: node,
                                            data: node.data
                                        })
                                    }
                                })
                            }
                        })
                    }
                }
                params.api.setDatasource(dataSource)
            }
            await updateData(this)
            let pageSize = params.api.gridOptionsWrapper.gridOptions.paginationPageSize
            let rowHeight = params.api.gridOptionsWrapper.gridOptions.rowHeight
            params.api.rowRenderer.rowContainers.body.eWrapper.style.minHeight = pageSize * rowHeight + 'px'
        },
        refreshFilter() {
            this.fetchData()
        },
        openNewForm() {
            this.resetSelection()
            this.$nuxt.$emit('open-payLog-detail')
        },
        onRowClicked(props) {
            this.$nuxt.$emit('open-payLog-detail', props)
            this.resetSelection()
            props.node.detail = true
            this.gridOptions.api.redrawRows()
        },
        closeForm() {
            this.gridOptions.api.forEachNode((node) => {
                node.detail = false
            })
            this.cardFormClosed = true
            this.gridOptions.api.redrawRows()
        },
        async fetchData() {
            this.gridOptions.api.onFilterChanged()
        },
        resetSelection() {
            this.gridOptions.api.forEachNode((node) => {
                node.detail = false
            })
            this.gridOptions.api.redrawRows()
        },
    }
}
</script>

<style scoped>

</style>
