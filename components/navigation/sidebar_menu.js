import { scHelpers } from "~/assets/js/utils";
const { uniqueID } = scHelpers;

export const menuEntries = [
	{
		id: uniqueID(),
		title: "Examples",
		icon: "mdi mdi-view-list",
		page: "/examples",
	}
];
