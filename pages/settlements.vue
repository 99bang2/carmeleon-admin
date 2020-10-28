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
                                    <Select2 style="padding-top: 0px"
                                             v-model="searchParkingSite"
                                             :options="siteOpts"
                                             :settings="{ 'width': '100%', 'placeholder': '주차장 명' }"
                                    />
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

                            <!-- 결산 table -->
                            <div>
                                <table class="uk-table">
                                    <thead>
                                    <tr>
                                        <th class="jb-th-1"></th>
                                        <th style="background-color: rgba(102,187,106,0.5); font-weight: bold">완료</th>
                                        <th style="background-color: rgba(244,143,177,0.5); font-weight: bold">취소</th>
                                        <th style="background-color: rgba(130,177,255,0.5); font-weight: bold">종합</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>금액</td>
                                        <td>{{completeSum ? completeSum : "0"}}원</td>
                                        <td>{{cancelSum ? cancelSum : "0"}}원</td>
                                        <td>{{totalSum ? totalSum : "0"}}원</td>
                                    </tr>
                                    <tr>
                                        <td>건수</td>
                                        <td>{{completeCnt? completeCnt :"0" }}건</td>
                                        <td>{{cancelCnt? cancelCnt : "0"}}건</td>
                                        <td>{{totalCnt? totalCnt : "0"}}건</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <!-- -->

                            <div style="height: 30px"></div>

                            <!-- 총 검색내역 -->
                            <span class="uk-text-middle">총 {{totalCount}}개의 결제내역 조회</span>
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
    import {agGridMixin} from "@/plugins/ag-grid.mixin";
    import ScInput from '~/components/Input'
    import Select2 from "@/components/Select2"
    import SearchMenu from "~/components/common/SearchMenu";
    import XLSX from 'xlsx'

    export default {
        components: {SearchMenu, ScInput, Select2},
        mixins: [
            agGridMixin
        ],
        data() {
            return {
                searchData: {
                    searchDate: this.$moment(new Date()).add(-7, 'days').format('YYYY-MM-DD') + ' ~ ' + this.$moment(new Date()).format('YYYY-MM-DD'),
                },
                totalCount: null,
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
                completeSum: null,
                completeCnt: null,
                cancelSum: null,
                cancelCnt: null,
                totalSum: null,
                totalCnt: null,
            }
        },
        computed: {
            columnDefs() {
                return [
                    {
                        headerName: '결제일시',
                        field: 'createdAt',
                        width: 200,
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
                        width: 195
                    },
                    {
                        headerName: '정산금액',
                        field: 'totalPrice',
                        width: 190
                    },
                    {
                        headerName: '결제상태',
                        field: 'status',
                        width: 190,
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
            'searchKeyword': function (newValue) {
                this.gridOptions.api.setQuickFilter(newValue)
                this.totalCount = this.gridOptions.api.getDisplayedRowCount()
                this.computeValue()
            },
            'searchParkingSite': function (newValue) {
                let filterComponent = this.gridOptions.api.getFilterInstance('parkingSite.name')
                filterComponent.setModel({
                    type: 'equals',
                    filter: newValue
                })
                this.gridOptions.api.onFilterChanged()
                this.computeValue()
            }
        },
        async mounted() {
            await this.fetchData()
        },
        methods: {
            refreshFilter() {
                this.searchKeyword = ""
                this.searchParkingSite = ""
                this.searchData.searchDate = this.$moment(new Date()).add(-7, 'days').format('YYYY-MM-DD') + ' ~ ' + this.$moment(new Date()).format('YYYY-MM-DD')
                this.fetchData()
            },
            search() {
                this.fetchData(this.searchData)
            },
            async fetchData(searchData) {
                let res = await this.$axios.$get(this.config.apiUrl + '/payLogs', {
                    params: {
                        searchData: searchData
                    }
                })
                if (this.gridOptions.api) {
                    this.gridOptions.api.setRowData(res.data.rows)
                    this.gridOptions.api.forEachNode((node) => {
                        if (node.data.parkingSite !== null) {
                            this.siteOpts.push(node.data.parkingSite.name)
                        }
                    })
                    this.totalCount = this.gridOptions.api.getDisplayedRowCount()
                    this.computeValue()
                }


            },
            exportData() {
                let aoaData = [
                    ['결제일시', '주차장명', '예약자번호', '차량번호', '구매상품', '입차예정시간', '정산금액', '결제상태'],
                ]
                this.gridOptions.api.forEachNode((node) => {
                    aoaData.push([
                        node.data.createdAt,
                        node.data.parkingSite.name,
                        node.data.phoneNumber,
                        node.data.carNumber,
                        node.data.discountTicket.ticketTitle,
                        node.data.reserveTime,
                        node.data.totalPrice,
                        node.data.status
                    ])
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
                XLSX.utils.book_append_sheet(wb, sheet, `(할인) 차량별 통계 목록`)
                XLSX.writeFile(wb, `주차 정산관리 목록.xlsx`)
            },
            computeValue() {
                this.completeSum = null
                this.completeCnt = null
                this.cancelSum = null
                this.cancelCnt = null
                this.totalSum = null
                this.totalCnt = null
                this.gridOptions.api.forEachNodeAfterFilter((node) => {
                    if (node.data.status === 10) {
                        this.completeSum += node.data.totalPrice
                        this.completeCnt++
                        this.totalSum += node.data.totalPrice
                        this.totalCnt++
                    } else if (node.data.status === -20) {
                        this.cancelSum += node.data.totalPrice
                        this.cancelCnt++
                        this.totalSum += node.data.totalPrice
                        this.totalCnt++
                    } else {
                        this.totalSum += node.data.totalPrice
                        this.totalCnt++
                    }
                })
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
