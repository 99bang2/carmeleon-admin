<template>
    <div>
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
        ></ag-grid-vue>
    </div>
</template>

<script>
    import {agGridMixin} from "~/plugins/ag-grid.mixin"

    export default {
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
                    getRowStyle: this.getRowStyle,
                    rowHeight: 45,
                },
            }
        },
        computed: {
            columnDefs() {
                return [
                    {
                        headerName: '세차장명',
                        field: 'carWash.carWashName',
                        width: 110,
                    }, {
                        headerName: '업종명',
                        field: 'carWash.carWashIndustry',
                        width: 120,
                        cellRenderer: (obj) => {
                            if (obj.data) {
                                if (obj.value.includes('세차')) {
                                    return "세차장"
                                } else if (obj.value.includes('주차')) {
                                    return "주차장"
                                } else if (obj.value.includes('정비')) {
                                    return "정비업소"
                                } else {
                                    return "기타"
                                }
                            }
                        }
                    }, {
                        headerName: '세차유형',
                        field: 'carWash.carWashTypeName',
                        width: 120,
                    }, {
                        headerName: '평점',
                        field: 'carWash.rate',
                        width: 120,
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
                            }
                        }
                    }
                ]
            }
        },
        created() {
            let vm = this
            this.$nuxt.$on('open-carWash-favorite', (uid, type) => {
                vm.fetchData(uid, type)
            })
        },
        methods: {
            async fetchData(targetUid, targetType) {
                this.cardFormClosed = false
                let res = await this.$axios.$get(this.config.apiUrl + '/favorites/' + targetUid)
                let result = res.data.filter(data => data.targetType === targetType)
                this.gridOptions.api.setRowData(result)
            },
        }
    }
</script>

<style scoped>

</style>
