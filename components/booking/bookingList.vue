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
                        <SearchMenu :search-data="searchData" :search-keyword="true" @search="search"></SearchMenu>
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
            searchStatus: '',
            searchKeyword: '',
            statusOpt: [],
        }
    },
    computed: {
        columnDefs() {
            return [
                {
                    headerName: '결제일시',
                    field: 'createdAt',
                    suppressSizeToFit: false,
                    valueFormatter: obj => {
                        return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
                    }
                },
                {
                    headerName: '업체명',
                    field: 'carWashName',
                    width: 200,
                },
                {
                    headerName: '고객성함',
                    field: 'name',
                    width: 100,
                },
                {
                    headerName: '전화번호',
                    field: 'phone',
                    width: 120,
                },
                {
                    headerName: '이용차량',
                    field: 'carPlate',
                    width: 100,
                },
                {
                    headerName: '결제상태',
                    field: 'clientStatus',
                    width: 100,
                    cellRenderer: (obj) => {
                        if (obj.data) {
                            let badge = ''
                            let status = ''
                            switch (obj.value) {
                                case 'wait' :
                                    badge = 'md-bg-green-300'
                                    status = '예약대기'
                                    break
                                case 'accept':
                                    badge = 'md-bg-green-500'
                                    status = '사용가능'
                                    break
                                case 'refunding' :
                                    badge = 'md-bg-red-300'
                                    status = '환불대기중'
                                    break
                                case 'refunded' :
                                    badge = 'md-bg-red-500'
                                    status = '환불완료'
                                    break
                                case 'cancel' :
                                    badge = 'md-bg-red-400'
                                    status = '예약취소'
                                    break
                                case 'expired':
                                    badge = 'md-bg-gray-500'
                                    status = '기간만료'
                                    break
                                case 'used':
                                    badge = 'md-bg-gray-500'
                                    status = '사용완료'
                                    break
                            }
                            return `<span class="uk-badge ${badge}">${status}</span>`
                        }
                    }
                },
                {
                    headerName: '결제금액',
                    field: 'finalPrice',
                    width: 100,
                    cellRenderer: (obj) => {
                        if(obj.data){
                            return obj.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                    }
                },
                {
                    headerName:'수수료율',
                    field: 'fee',
                    width: 100,
                    cellRenderer: (obj) => {
                        if(obj.data){
                            return obj.value? obj.value +'%': '';
                        }
                    }
                }
            ]
        },
        statusOpts() {
            return [
                {
                    id: " ",
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
                    id: "accept",
                    text: "사용가능"
                },
                {
                    id: "cancel",
                    text: "예약취소"
                },
                {
                    id:"wait",
                    text:"예약대기"
                }
            ]
        }
    },
    watch: {
        'searchDate': function () {
            this.fetchData()
        },
        'searchKeyword': function () {
            this.fetchData()
        },
        'searchStatus': function () {
            this.fetchData()
        }
    },
    created() {
        let vm = this
        this.$nuxt.$on('reset-booking-list', () => {
            vm.resetSelection()
        })
        this.$nuxt.$on('fetch-booking-list', (uid) => {
            this.resUid = uid
            vm.fetchData()
        })
        this.defaultColDef.sortable = false
    },
    beforeDestroy() {
        this.$nuxt.$off('reset-booking-list')
        this.$nuxt.$off('fetch-booking-list')
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
                        console.log(parameters)
                        let searchData = {
                            params:{
                                searchData: {
                                    searchKeyword: context.searchKeyword,
                                    searchStatus: context.searchStatus,
                                    searchDate: context.searchData.searchDate,
                                },
                                offset: parameters.offset,
                                limit: parameters.limit,
                                order: parameters.order,
                            }
                        }
                        await context.$axios.$get(this.config.apiUrl + '/carWashes/admin/bookings', searchData).then(response => {
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
        openNewForm() {
            this.resetSelection()
            this.$nuxt.$emit('open-booking-detail')
        },
        onRowClicked(props) {
            this.$nuxt.$emit('open-booking-detail', props)
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
        refreshFilter() {
            this.searchKeyword = ""
            this.searchStatus = ""
            this.searchData.searchDate = this.$moment(new Date()).add(-7, 'days').format('YYYY-MM-DD') + ' ~ ' + this.$moment(new Date()).format('YYYY-MM-DD')
            this.fetchData()
        },
        search() {
            this.fetchData()
        },
    }
}
</script>

<style scoped>

</style>
