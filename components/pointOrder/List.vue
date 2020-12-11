<template>
    <div>
        <ScCard>
            <ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
                <div class="uk-flex-1">
                    <ScCardTitle>
                        <slot><i class="mdi mdi-cart"/> 포인트 상품 주문</slot>
                    </ScCardTitle>
                </div>
            </ScCardHeader>
            <ScCardBody>
                <div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
                    <div class="uk-width-3-5@s">
                    </div>
                    <div class="uk-width-2-5@s">
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
                        :framework-components="frameworkComponents"
                >
                </ag-grid-vue>
            </ScCardBody>
        </ScCard>
    </div>
</template>

<script>
    import ScInput from '~/components/Input'
    import {agGridMixin} from "@/plugins/ag-grid.mixin";

    export default {
        components: {
            ScInput
        },
        mixins: [
            agGridMixin
        ],
        data() {
            return {
                addPoint: null,
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
                searchKeyword: '',
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
                        headerName: "주문상품",
                        field: "product",
                        suppressSizeToFit: false,
                        cellRenderer: obj => {
                            if(obj.data) {
                                return `[${obj.data.category}] ${obj.data.title}`
                            }
                        }
                    },
                    {
                        headerName: "가격",
                        field: "price",
                        width: 140,
                        cellRenderer: (obj) => {
                            return obj.value + 'P'
                        }
                    },
                    {
                        headerName: "주문자",
                        field: "name",
                        width: 120
                    },
                    {
                        headerName: "전화번호",
                        field: "phone",
                        width: 150
                    },
                    {
                        headerName: "상태",
                        field: "statusName",
                        width: 150
                    },
                    {
                        headerName: '주문일시',
                        field: 'createdAt',
                        width: 160,
                        valueFormatter: obj => {
                            return this.$moment(obj.value).format('YYYY-MM-DD HH:mm')
                        }
                    }
                ]
            }
        },
        watch: {
            'searchKeyword': function (newValue) {
                this.gridOptions.api.setQuickFilter(newValue)
            },
        },
        created() {
            let vm = this
            this.$nuxt.$on('reset-pointOrder-list', () => {
                vm.resetSelection()
            })
            this.$nuxt.$on('fetch-pointOrder-list', () => {
                vm.fetchData()
            })
        },
        beforeDestroy() {
            this.$nuxt.$off('reset-pointOrder-list')
            this.$nuxt.$off('fetch-pointOrder-list')
        },
        async mounted() {
            await this.fetchData()
        },
        methods: {
            onRowClicked(props) {
                this.$nuxt.$emit('open-pointOrder-form', props)
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
            async fetchData(selectUid) {
                // API 연동
                let res = await this.$axios.$get(this.config.apiUrl + '/pointOrders')
                if (this.gridOptions.api) {
                    this.gridOptions.api.setRowData(res.data)
                }
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
