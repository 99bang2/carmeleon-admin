import {scHelpers} from "~/assets/js/utils";

const {uniqueID} = scHelpers;

export const menuEntries = [
	// {
	// 	id: uniqueID(),
	// 	title: "Examples",
	// 	icon: "mdi mdi-view-list",
	// 	page: "/examples",
	// },
	{
		id: uniqueID(),
		title: "Events",
		icon: "mdi mdi-calendar-check",
		page: "/events",
	}, {
		id: uniqueID(),
		title: "Notices",
		icon: "mdi mdi-alarm-light",
		page: "/notices",
	}
];
