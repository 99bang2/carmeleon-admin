import {scHelpers} from "~/assets/js/utils";

const {uniqueID} = scHelpers;

export const menuEntries = [
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
	},
	{
		id: uniqueID(),
		title: "Accounts",
		icon: "mdi mdi-account-supervisor",
		page: "/accounts",
	},
];
