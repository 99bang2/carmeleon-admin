<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="uk-grid" data-uk-grid>
				<div class="uk-width-2-3@l">
					<NoticeList />
				</div>
				<div class="uk-width-1-3@l">
					<NoticeForm />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import NoticeList from "@/components/notice/NoticeList"
import NoticeForm from "@/components/notice/NoticeForm"
export default {
	middleware: ['auth'],
	components: {
		NoticeList,
		NoticeForm,
	}
}
</script>
