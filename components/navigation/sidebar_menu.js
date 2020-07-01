import {scHelpers} from "~/assets/js/utils";
import {updateHeightsInViewport} from "codemirror/src/display/update_lines";

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
	{
		id: uniqueID(),
		title: "Parkings",
		icon: "mdi mdi-parking",
		page: "/parkings"
	},
	{
		id: uniqueID(),
		title: "ReviewTemplates",
		icon: "mdi mdi-file-document",
		page: "/reviewTemplates"
	},
	{
		id: uniqueID(),
		title: "PointProducts",
		icon: "mdi mdi-coin",
		page: "/pointProducts"
	}
];
