<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="uk-grid" data-uk-grid>
				<div class="uk-width-1-1@l">
					<ScCard>
						<ScCardHeader class="uk-flex uk-flex-middle sc-theme-bg-dark sc-light" separator>
							<div class="uk-flex-1">
								<ScCardTitle>
									<i class="mdi mdi-ticket-percent"></i> 일별 통계
								</ScCardTitle>
							</div>
						</ScCardHeader>
						<ScCardBody>
                            <div class="uk-grid-small uk-grid uk-margin" data-uk-grid>
                                <div class="uk-width-1-4@s"></div>
                                <div class="uk-width-3-4@s">
                                    <div class="uk-grid-small uk-grid uk-margin">
                                        <div class="uk-width-1-2@s uk-grid uk-margin">
                                            <select v-model="searchYear" class="uk-select uk-width-1-2@s">
                                                <option v-for="yearOpts in yearOpts" :key="yearOpts.id" :value="yearOpts.id">
                                                    {{ yearOpts.text }}
                                                </option>
                                            </select>
                                            <select v-model="searchMonth" class="uk-select uk-width-1-2@s">
                                                <option v-for="monthOpts in monthOpts" :key="monthOpts.id" :value="monthOpts.id">
                                                    {{ monthOpts.text }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="uk-width-1-2@s">
                                            <select v-model="searchParkingSite" class="uk-select">
                                                <option value="">주차장</option>
                                                <option v-for="siteOpts in siteOpts" :key="siteOpts.id" :value="siteOpts.id">
                                                    {{ siteOpts.text }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="barChart"></div>
                            <div class="uk-overflow-auto">
                                <table class="uk-table uk-table-divider uk-table-striped uk-table-hover">
                                    <thead>
                                    <tr>
                                        <th v-for="(item,index) in dayArray" v-bind:key="'d'+index">{{ item }}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <th v-for="(item,index) in totalArray" v-bind:key="'t'+index">{{ item }}</th>
                                    </tr>
                                    <tr>
                                        <th v-for="(item,index) in totalArray1" v-bind:key="'t1'+index">{{ item }}</th>
                                    </tr>
                                    <tr>
                                        <th v-for="(item,index) in totalArray2" v-bind:key="'t2'+index">{{ item }}</th>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
						</ScCardBody>
					</ScCard>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {agGridMixin} from "@/plugins/ag-grid.mixin"
import bb from "billboard.js"
import BillboardChart from '~/components/billboard-charts/Chart'

export default {
        //name: "parkingSiteStatistic"
        components: {
            //SearchMenu,
            //ScInput,
            //Select2
        },
        mixins: [
            agGridMixin
        ],
        data: () => ({
            dayArray : [],
            totalArray : [],
            totalArray1 : [],
            totalArray2 : [],
            searchParkingSite: '',
            siteOpts: [],
            searchYear: '',
            yearOpts: [],
            searchMonth: '',
            monthOpts: []
        }),
        watch: {
            'searchParkingSite': function() {
                this.loadData()
            },
            'searchYear': function() {
                this.loadData()
            },
            'searchMonth': function(){
                this.loadData()
            }
        },
        async mounted() {
            await this.getYear()
            await this.getMonth()
            await this.loadSite()
            await this.loadData()
        },
        methods: {
            async loadData(){
                let params = {}
                if(this.$auth.user.grade > 0){
                    params.accountUid = this.$auth.user.uid
                }
                params.searchYear = this.searchYear
                params.searchMonth = this.searchMonth
                if(this.searchParkingSite){
                    params.searchParkingSite = this.searchParkingSite
                }
                console.log(params)
                await this.$axios.$get(this.config.apiUrl + '/parkingStatistics', {params: params}).then(response => {
                    let dayArray = []
                    let totalArray = ["사용완료"]
                    let totalArray1 = ["미사용"]
                    let totalArray2 = ["총 결제 건수"]
                    response.data.forEach(function (value){
                        dayArray.push(value.selected_date)
                        totalArray.push(value.complete_count?value.complete_count:0)
                        totalArray1.push(value.non_complete_count?value.non_complete_count:0)
                        totalArray2.push(value.complete_count+value.non_complete_count?value.complete_count+value.non_complete_count:0)
                    })
                    this.dayArray = dayArray
                    this.dayArray.unshift('날짜')
                    this.totalArray = totalArray
                    this.totalArray1 = totalArray1
                    this.totalArray2 = totalArray2
                    console.log(this.totalArray)
                    bb.generate({
                        data: {
                            columns: [
                                totalArray,
                                totalArray1,
                                totalArray2
                            ],
                            type: "bar"
                        },
                        axis: {
                            x: {
                                tick: {
                                    format: function(index) {
                                        return dayArray[index + 1]
                                    },
                                }
                            }
                        },
                        bindto: "#barChart",
                    })
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
                await this.$axios.$get(this.config.apiUrl + '/parkingLists', params).then(response => {
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
            async getYear(){
                let year = this.$moment().format("YYYY")
                this.searchYear = year
                for(let i=parseInt(year)-5; i<=parseInt(year); i++){
                    this.yearOpts.push({id:i, text:i+"년"})
                }
            },
            async getMonth(){
                this.searchMonth = this.$moment().format("M")
                for(let i=1; i<=12; i++){
                    this.monthOpts.push({id:i, text:i+"월"})
                }
            }
        }
    }

</script>

<style scoped>
</style>
