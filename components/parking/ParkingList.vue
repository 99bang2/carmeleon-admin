npm <template>
    <div>
        <ScCard>
            <ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
                <div class="uk-flex-1">
                    <ScCardTitle>
                        <slot><i class="mdi mdi-parking"/> 주차장 목록</slot>
                    </ScCardTitle>
                </div>
                <div class="uk-text-nowrap">
                    <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-plus" style="display: inline-block"
                       @click.prevent="openNewForm" data-uk-tooltip="주차장추가"/>
                    <a href="javascript:void(0)" class="sc-actions-icon mdi mdi-trash-can-outline"
                       style="display: inline-block" @click.prevent="deleteDatas" data-uk-tooltip="주차장삭제"/>
                </div>
            </ScCardHeader>
            <ScCardBody>
                <div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
                    <div class="uk-width-3-5@s">
                        <div class="uk-grid-small uk-grid" data-uk-grid>
                            <a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline"
                               style="height:40px;" @click.prevent="refreshFilter">
                                <i class="mdi mdi-refresh"></i>
                            </a>
                            <div class="uk-width-1-4@s">
                                <select v-model="searchSiteType" class="uk-select">
                                    <option value="">주차장 유형</option>
                                    <option value="0">하이파킹</option>
                                    <option value="1">하이시티파킹</option>
                                    <option value="2">일반</option>
                                    <option value="3">하이그린파킹</option>
                                </select>
                            </div>
                            <div class="uk-width-1-4@s">
                                <select v-model="searchActive" class="uk-select">
                                    <option value="">운영 상태</option>
                                    <option value="true">운영중</option>
                                    <option value="false">미운영</option>
                                </select>
                            </div>
                            <div style="width: 10px"></div>
                            <div class="uk-width-1-4@s">
                                <IonRangeSlider v-model="searchRating"
                                                :settings="{type: 'double',from:0, to:10, values:[0,1,2,3,4,5,6,7,8,9,10], prefix: 'rate '}"></IonRangeSlider>
                            </div>
                        </div>
                    </div>
                    <div class="uk-width-2-5@s">
                        <ScInput v-model="searchKeyword" placeholder="주차장 이름, 주차장 주소">
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
    import IonRangeSlider from "@/components/RangeSlider";

    export default {
        components: {
            IonRangeSlider,
            ScInput
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
                searchSiteType: '',
                searchActive: '',
                searchRating: '',
                searchKeyword: '',
                resUid: 0
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
                        suppressMovable: true,
                        onCellClicked: false,
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },
                    {
                        headerName: 'UID',
                        field: 'uid',
                        width: 80
                    },
                    {
                        headerName: '유형',
                        field: 'siteType',
                        width: 100,
                        cellRenderer: (obj) => {
                            if (obj.data) {
                                let badge = ''
                                let typeName = ''
                                switch (obj.value) {
                                    case 0 :
                                        badge = 'md-bg-green-500'
                                        typeName = '하이파킹'
                                        break
                                    case 1 :
                                        badge = 'md-bg-blue-500'
                                        typeName = '하이시티파킹'
                                        break
                                    case 2 :
                                        badge = 'md-bg-gray-500'
                                        typeName = '일반'
                                        break
                                    case 3 :
                                        badge = 'md-bg-light-green-500'
                                        typeName = '하이그린파킹'
                                }
                                return `<span class="uk-badge ${badge}">${typeName}</span>`
                            }
                        }
                    },
                    {
                        headerName: '주차장 이름',
                        field: 'name',
                        suppressSizeToFit: false,
                    },
                    {
                        headerName: '최대 가용대수',
                        field: 'parkingLot',
                        width: 110,
                        cellRenderer: (obj) => {
                            return obj.value ? obj.value + '대' : 0 + ' 대'
                        }
                    },
                    {
                        headerName: '운영상태',
                        field: 'isActive',
                        width: 80,
                        cellRenderer: (obj) => {
                            return obj.value ? '<span>운영중</span>' : '<span>미운영</span>'
                        }
                    },
                    {
                        headerName: '기준가격',
                        field: 'price',
                        width: 80,
                        cellRenderer: (obj) => {
                            return obj.value + ' 원'
                        }
                    },
                    {
                        headerName: '평점',
                        field: 'rate',
                        width: 80,
                        filter: 'agNumberColumnFilter',
                        cellRenderer: (obj) => {
                            if (obj.value) {
                                function roundToTwo(num) {
                                    return +(Math.round(num + "e+2") + "e-2");
                                }

                                let temp = ''
                                if (obj.value > 8) {
                                    temp = '★★★★★'
                                } else if (obj.value > 6 && obj.value <= 8) {
                                    temp = '★★★★'
                                } else if (obj.value > 4 && obj.value <= 6) {
                                    temp = '★★★'
                                } else if (obj.value > 2 && obj.value <= 4) {
                                    temp = '★★'
                                } else {
                                    temp = '★'
                                }
                                return `<span>${temp} ${roundToTwo(obj.value)}</span>`;
                            } else {
                                return `<span class="uk-badge md-bg-pink-400">평점없음</span>`
                            }
                        }
                    },
                    {
                        headerName: '등록일시',
                        field: 'createdAt',
                        width: 150,
                        valueFormatter: obj => {
                            return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
                        }
                    },
                    {
                        headerName: '결제태그',
                        field: 'paymentTagName',
                        hide: true
                    },
                    {
                        headerName: '상품태그',
                        field: 'productTagName',
                        hide: true
                    },
                    {
                        headerName: '옵션태그',
                        field: 'optionTagName',
                        hide: true
                    },
                    {
                        headerName: '제휴태그',
                        field: 'brandTagName',
                        hide: true
                    },
                    {
                        headerName: '차량태그',
                        field: 'carTagName',
                        hide: true
                    },
                    {
                        headerName: '주차장유형이름',
                        field: 'siteTypeName',
                        hide: true
                    },
                    {
                        headerName: '계정',
                        field: 'accountUid',
                        hide: true
                    }
                ]
            }
        },
        watch: {
            'searchSiteType': function (newValue) {
                this.fetchData()
            },
            'searchActive': function (newValue) {
                this.fetchData()
            },
            'searchRating': function (newValue) {
                this.fetchData()
            },
            'searchKeyword': function (newValue) {
                this.fetchData()
            },
        },
        created() {
            let vm = this
            this.$nuxt.$on('reset-parking-list', () => {
                vm.resetSelection()
            })
            this.$nuxt.$on('fetch-parking-list', (uid) => {
                this.resUid = uid
                vm.fetchData()
            })
            this.defaultColDef.sortable = false
        },
        beforeDestroy() {
            this.$nuxt.$off('reset-parking-list')
            this.$nuxt.$off('fetch-parking-list')
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
                            let searchData = {
                                params:{
                                    searchSiteType: context.searchSiteType,
                                    searchActive: context.searchActive,
                                    searchRating: context.searchRating,
                                    searchKeyword: context.searchKeyword,
                                    offset: parameters.offset,
                                    limit: parameters.limit,
                                    order: parameters.order,
                                }
                            }
                            if(this.$auth.user.grade > 0){
                                searchData.params.accountUid = this.$auth.user.uid
                            }
                            await context.$axios.$get(this.config.apiUrl + '/parkings', searchData).then(response => {
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
                this.searchSiteType = ""
                this.searchActive = ""
                this.searchRating = "0;10"
                this.fetchData()
            },
            openNewForm() {
                this.resetSelection()
                this.$nuxt.$emit('open-parking-form')
            },
            onRowClicked(props) {
                this.$nuxt.$emit('open-parking-form', props)
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
            deleteDatas() {
                let selected = this.gridOptions.api.getSelectedRows()
                let selectedUids = selected.map(({uid}) => uid)
                let seletedCnt = selectedUids.length
                if (seletedCnt) {
                    UIkit.modal.confirm(`선택한 항목 : ${seletedCnt}<br/>정말 삭제하시겠습니까?`).then(() => {
                        this.$axios.$post(this.config.apiUrl + '/parkings/bulkDelete', {
                            uids: selectedUids
                        }).then(res => {
                            this.callNotification('삭제하였습니다.')
                            this.$nuxt.$emit('close-parking-form')
                            this.fetchData()
                        })
                    })
                } else {
                    this.callAlertError('삭제할 항목을 선택해주세요.')
                }
            },
        }
    }
</script>

<style scoped>

</style>
