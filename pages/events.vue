<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="uk-grid" data-uk-grid>
				<div class="uk-width-2-3@l">
					<EventList/>
				</div>
				<div class="uk-width-1-3@l">
					<EventForm/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import EventList from "@/components/event/EventList"
	import EventForm from "@/components/event/EventForm"

	export default {
		middleware: ['auth'],
		components: {
			EventList,
			EventForm,
		}
	}
</script>
