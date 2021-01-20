<template>
    <div id="sc-page-wrapper">
        <div id="sc-page-content">
            <div class="uk-child-width-1-1@m" data-uk-grid>
                <div>
                    <ScCard>
                        <ScCardHeader separator>
                            <div class="uk-flex uk-flex-middle">
                                <i class="mdi mdi-file-chart uk-margin-medium-right"></i>
                                <ScCardTitle>
                                    정산관리
                                </ScCardTitle>
                            </div>
                        </ScCardHeader>
                        <ScCardBody>
                            <!-- 검색필터 -->
                            <div class="sc-padding-medium sc-round sc-border md-bg-grey-100 uk-grid-small uk-grid"
                                 data-uk-grid>
                                <a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline"
                                   style="height:40px;" @click.prevent="refreshFilter">
                                    <i class="mdi mdi-refresh"></i>
                                </a>
                                <div class="uk-width-2-5">
                                    <SearchMenu :search-data="searchData" :search-keyword="true"
                                                @search="search"></SearchMenu>
                                </div>
                                <div class="uk-width-1-5@s">
                                    <select v-model="searchParkingSite" class="uk-select">
                                        <option value="">전체</option>
                                        <option v-for="siteOpts in siteOpts" :key="siteOpts.id" :value="siteOpts.id">
                                            {{ siteOpts.text }}
                                        </option>
                                    </select>
                                </div>
                                <div class="uk-width-1-6@s"></div>
                                <div class="uk-width-1-5@s">
                                    <ScInput v-model="searchKeyword" placeholder="검색">
                                        <span slot="icon" class="uk-form-icon" data-uk-icon="search"/>
                                    </ScInput>
                                </div>
                            </div>
                            <!-- -->

                            <div style="height: 30px"></div>

                            <!-- 검색기간 및 엑셀 버튼 버튼으로 바꾸기!!!! -->
                            <div style="display: flex; justify-content: space-between;">
                                <span class="uk-text-small"> 검색기간 : {{searchData.searchDate}} </span>
                                <div>
                                    <a href="javascript:void(0)" class="sc-button sc-button-flex"
                                       @click.prevent="exportData()">
                                        <i class="mdi mdi-file-excel sc-icon-28 uk-margin-mini-right"></i>
                                        엑셀다운로드
                                    </a>
                                    <!-- excel 다운로드 기능 추가 -->
                                </div>
                            </div>
                            <!-- -->

                            <div style="height: 10px"></div>
                            <!-- -->
                            <!-- 결산 table -->
                            <div>
                                <table class="uk-table">
                                    <thead>
                                    <tr>
                                        <th class="jb-th-1"></th>
                                        <th style="background-color: rgba(102,187,106,0.5); font-weight: bold">완료</th>
                                        <th style="background-color: rgba(244,143,177,0.5); font-weight: bold">취소</th>
                                        <th style="background-color: rgba(130,177,255,0.5); font-weight: bold">종합</th>
                                        <th style="background-color: rgba(130,177,126,0.5); font-weight: bold">정산 수수료</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>금액</td>
                                        <td>{{settleData.totalPrice - settleData.refundCompletePrice}}원</td>
                                        <td>{{settleData.refundCompletePrice}}원</td>
                                        <td>{{settleData.totalPrice}}원</td>
                                        <td>{{settleData.fee}}원</td>
                                    </tr>
                                    <tr>
                                        <td>건수</td>
                                        <td>{{settleData.totalCount - settleData.refundCompleteCount}}건</td>
                                        <td>{{settleData.refundCompleteCount}}건</td>
                                        <td>{{settleData.totalCount}}건</td>
                                        <td>{{settleData.feeCount}}건</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!-- -->
                            <div style="height: 30px"></div>

                            <!-- 총 검색내역 -->
                            <span class="uk-text-middle">총 {{settleData.totalCount}}개의 결제내역 조회</span>
                            <!-- -->

                            <!-- 리스트 -->
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
                            <!-- -->
                        </ScCardBody>
                    </ScCard>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {agGridMixin} from "@/plugins/ag-grid.mixin"
import ScInput from '~/components/Input'
import SearchMenu from "~/components/common/SearchMenu"
import XLSX from 'xlsx'

export default {
        components: {SearchMenu, ScInput},
        mixins: [
            agGridMixin
        ],
        data() {
            return {
                searchData: {
                    searchDate: this.$moment(new Date()).add(-7, 'days').format('YYYY-MM-DD') + ' ~ ' + this.$moment(new Date()).format('YYYY-MM-DD'),
                },
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
                siteOpts: [],
                searchKeyword: '',
                searchParkingSite: '',
                settleData: {
                    price: 0,
                    sellingPrice: 0,
                    totalPrice: 0,
                    totalCount: 0,
                    completePrice: 0,
                    cancelPrice: 0,
                    priceCount: 0,
                    sellingPriceCount: 0,
                    completePriceCount: 0,
                    cancelPriceCount: 0,
                    fee: 0,
                    feeCount: 0,
                    refundCount: 0,
                    refundPrice: 0,
                    refundRejectCount: 0,
                    refundRejectPrice: 0,
                    refundCompleteCount: 0,
                    refundCompletePrice: 0,
                    usedCount: 0,
                    unusedCount: 0,
                    expiredCount: 0
                },
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
                        headerName: '주차장명',
                        field: 'parkingSite.name',
                        width: 200
                    },
                    {
                        headerName: '연락처',
                        field: 'phoneNumber',
                        width: 150,
                    },
                    {
                        headerName: '이메일',
                        field: 'email',
                        width: 150,
                    },
                    {
                        headerName: '차량번호',
                        field: 'carNumber',
                        width: 190
                    },
                    {
                        headerName: '구매상품',
                        field: 'discountTicket.ticketTitle',
                        width: 190
                    },
                    {
                        headerName: '입차예정시간',
                        field: 'reserveTime',
                        width: 100
                    },
                    {
                        headerName: '정산금액',
                        field: 'totalPrice',
                        width: 100
                    },
                    {
                        headerName: '수수료',
                        field: 'fee',
                        width: 100
                    },
                    {
                        headerName: '결제상태',
                        field: 'status',
                        width: 100,
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
        watch: {
            'searchKeyword': function() {
                this.fetchData()
                this.loadData()
            },
            'searchParkingSite': function() {
                this.fetchData()
                this.loadData()
            },
            'searchDate': function() {
                this.fetchData()
                this.loadData()
            }
        },
        async mounted() {
            await this.loadData()
            await this.fetchData()
            await this.loadSite()
        },
        methods: {
            async loadData(){
                let searchData = {
                    params : {
                        accountUid: null,
                        searchData: {
                            searchParkingSite: this.searchParkingSite,
                            searchDate: this.searchData.searchDate,
                            searchKeyword: this.searchKeyword
                        }
                    }
                }
                if(this.$auth.user.grade > 0){
                    searchData.params.accountUid = this.$auth.user.uid
                }
                //await this.$axios.$get(this.config.apiUrl + '/allPayLogs', searchData).then(response => {
                await this.$axios.$get(this.config.apiUrl + '/allPayLogs', searchData).then(response => {
                    if(response.data){
                        this.settleData = response.data
                    }
                })
            },
            async loadSite(){
                let params = {
                    params:{
                        accountUid:null
                    }
                }
                if(this.$auth.user.grade > 0){
                    params.params.accountUid = this.$auth.user.uid
                }
                //console.log(params)
                await this.$axios.$get(this.config.apiUrl + '/parkingLists', params).then(response => {
                    console.log(response)
                    if(response.data){
                        this.siteOpts = response.data.map(function (obj) {
                            return {
                                id: obj.uid,
                                text: obj.name
                            }
                        })
                    }
                })
            },
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
                            let searchData = {
                                params:{
                                    searchData: {
                                        searchKeyword: context.searchKeyword,
                                        searchParkingSite: context.searchParkingSite,
                                        searchDate: context.searchData.searchDate,
                                        offset: parameters.offset,
                                        limit: parameters.limit,
                                        order: parameters.order
                                    }
                                }
                            }
                            if(this.$auth.user.grade > 0){
                                params.accountUid = this.$auth.user.uid
                            }
                            await context.$axios.$get(this.config.apiUrl + '/paylogs', searchData).then(response => {
                                let rowsThisPage = response.data.rows
                                lastRow = response.data.count
                                params.successCallback(rowsThisPage, lastRow)
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
            async fetchData() {
                this.gridOptions.api.onFilterChanged()
            },
            refreshFilter() {
                this.searchKeyword = ""
                this.searchParkingSite = ""
                this.searchData.searchDate = this.$moment(new Date()).add(-7, 'days').format('YYYY-MM-DD') + ' ~ ' + this.$moment(new Date()).format('YYYY-MM-DD')
                this.fetchData()
                this.loadData()
            },
            search() {
                this.fetchData()
                this.loadData()
            },
            async exportData() {
                let searchData = {
                    params : {
                        accountUid: null,
                        searchData: {
                            searchParkingSite: this.searchParkingSite,
                            searchDate: this.searchData.searchDate,
                            searchKeyword: this.searchKeyword
                        }
                    }
                }
                if(this.$auth.user.grade > 0){
                    searchData.params.accountUid = this.$auth.user.uid
                }
                let aoaData = [
                    ['결제일시', '주차장명', '연락처', '이메일', '차량번호', '구매상품', '입차예정시간', '정산금액', '수수료', '결제상태'],
                ]
                await this.$axios.$get(this.config.apiUrl + '/payLogs', searchData).then(response => {
                    response.data.rows.forEach((key) => {
                        let status = ''
                        switch (response.data.rows.status) {
                            case 10 :
                                status = '결제완료'
                                break
                            case -10 :
                                status = '결제실패'
                                break
                            case -20 :
                                status = '결제취소'
                                break
                            default :
                                status = '결제대기중'
                        }
                        aoaData.push([
                            key.createdAt,
                            key.parkingSite.name,
                            key.phoneNumber,
                            key.email,
                            key.carNumber,
                            key.discountTicket.ticketTitle,
                            key.reserveTime,
                            key.totalPrice,
                            key.fee,
                            status
                        ])
                    });
                })
                let sheet = XLSX.utils.aoa_to_sheet(aoaData)
                // 엑셀 column width 설정 /////////////////////////////////////////////////////////////////////////////////
                let objectMaxLength = []
                aoaData.map(arr => {
                    Object.keys(arr).map(key => {
                        let value = arr[key] === null ? '' : arr[key]
                        if (typeof value === 'number') {
                            return objectMaxLength[key] = 10
                        }
                        objectMaxLength[key] = objectMaxLength[key] >= value.length ? objectMaxLength[key] : value.length
                    })
                })
                let worksheetCols = objectMaxLength.map(width => {
                    return {
                        width
                    }
                })
                sheet["!cols"] = worksheetCols;
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////
                let wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, sheet, `주차 정산관리 목록`)
                XLSX.writeFile(wb, `${this.searchData.searchDate} 주차 정산관리 목록.xlsx`)
            },
            computeValue() {
                this.completeSum = null
                this.completeCnt = null
                this.cancelSum = null
                this.cancelCnt = null
                this.totalSum = null
                this.totalCnt = null
                this.totalFee = null
                this.feeCnt = null
            }
        }
    }
</script>

<style scoped>
    table, th, td {
        border: 1px solid #bcbcbc;
        text-align: center;
    }

    table {
        table-layout: auto;
    }

    .jb-th-1 {
        width: 80px;
    }
</style>
