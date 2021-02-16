<template>
    <div id="sc-page-wrapper">
        <div id="sc-page-content">
            <div class="uk-grid" data-uk-grid>
                <div class="uk-width-2-3@l">
                    <BookingList/>
                </div>
                <div class="uk-width-1-3@l">
                    <BookingDetail/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BookingList from "@/components/booking/bookingList"
import BookingDetail from "@/components/booking/bookingDetail"

export default {
    middleware: ['auth'],
    components: {
        BookingList,
        BookingDetail
    }
}
</script>

<style scoped>

</style>
