<template>
    <div id="sc-page-wrapper">
        <div id="sc-page-content">
            <div class="uk-grid" data-uk-grid>
                <div class="uk-width-2-3@l">
                    <ParkingList/>
                </div>
                <div class="uk-width-1-3@l">
                    <ParkingForm/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ParkingList from "@/components/parking/ParkingList"
    import ParkingForm from "@/components/parking/ParkingForm"

    export default {
        middleware: ['auth'],
        components: {
            ParkingList,
            ParkingForm
        }
    }
</script>

<style scoped>

</style>
