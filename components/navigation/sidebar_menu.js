import {scHelpers} from "~/assets/js/utils";
import {updateHeightsInViewport} from "codemirror/src/display/update_lines";

const {uniqueID} = scHelpers;

export const menuEntries = [
	{
		id: uniqueID(),
		title: "Spots",
		icon: "mdi mdi-map-marker-multiple",
		page: "/spots",
		isOpen: false,
		submenu: [
			{
				id: uniqueID(),
				title: "Parkings",
				icon: "mdi mdi-parking",
				page: "/spots/parkings"
			},
			{
				id: uniqueID(),
				title: "GasStations",
				icon: "mdi mdi-gas-station",
				page: "/spots/gasStations"
			},
			{
				id: uniqueID(),
				title: "CarWashes",
				icon: "mdi mdi-car-wash",
				page: "/spots/carWashes"
			},
			{
				id: uniqueID(),
				title: "EvCharges",
				icon: "mdi mdi-battery-charging",
				page: "/spots/evCharges"
			},
		]
	},
	{
		id: uniqueID(),
		title: "Users",
		icon: "mdi mdi-account-circle",
		page: "/users"
	},
	{
		id: uniqueID(),
		title: "Operations",
		icon: "mdi mdi-settings",
		page: "/operations",
		isOpen: false,
		submenu: [
			{
				id: uniqueID(),
				title: "Accounts",
				icon: "mdi mdi-account-supervisor",
				page: "/operations/accounts",
			},
			{
				id: uniqueID(),
				title: "Events",
				icon: "mdi mdi-calendar-check",
				page: "/operations/events",
			}, {
				id: uniqueID(),
				title: "Notices",
				icon: "mdi mdi-alarm-light",
				page: "/operations/notices",
			},
			{
				id: uniqueID(),
				title: "ReviewTemplates",
				icon: "mdi mdi-file-document",
				page: "/operations/reviewTemplates"
			},
			{
				id: uniqueID(),
				title: "PointProducts",
				icon: "mdi mdi-coin",
				page: "/operations/pointProducts"
			},
			{
				id: uniqueID(),
				title: "Tutorials",
				icon: "mdi mdi-book-open-page-variant",
				page: "/operations/tutorials"
			},
		]
	}
	// {
	// 	id: uniqueID(),
	// 	title: "Statistics",
	// 	icon: "mdi mdi-chart-bar",
	// 	page: "/statistics",
	// 	isOpen: false,
	// 	submenu: [
	// 		{
	// 			id: uniqueID(),
	// 			title:"ParkingSiteStatistic",
	// 			page: "/statistics/parkingSiteStatistic"
	// 		},
	// 		{
	// 			id: uniqueID(),
	// 			title: "CarStatistic",
	// 			page: "/statistics/carStatistic"
	// 		},
	// 		{
	// 			id: uniqueID(),
	// 			title: "PointStatistic",
	// 			page: "/statistics/pointStatistic"
	// 		}
	// 	]
	// }
];
