<template>
    <div id="sc-page-wrapper">
        <div id="sc-page-content">
            <div class="uk-grid" data-uk-grid>
                <div class="uk-width-2-3@l">
                    <UserList/>
                </div>
                <div class="uk-width-1-3@l">
                    <UserDetail/>
                    <UserCard/>
                    <UserCar/>
                    <UserPointLog/>
                    <UserPayLog/>
                    <UserFavorite/>
                    <UserRating/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UserList     from "@/components/user/UserList"
import UserDetail   from "@/components/user/UserDetail"
import UserCard     from "@/components/user/UserCard"
import UserCar      from "@/components/user/UserCar"
import UserPointLog from "@/components/user/UserPointLog"
import UserPayLog   from "@/components/user/UserPayLog"
import UserFavorite from "@/components/user/UserFavorite"
import UserRating   from "@/components/user/UserRating"

export default {
    middleware: ['auth'],
    components: {
        UserList,
        UserDetail,
        UserCard,
        UserCar,
        UserPointLog,
        UserPayLog,
        UserFavorite,
        UserRating
    }
}
</script>

<style scoped>

</style>
