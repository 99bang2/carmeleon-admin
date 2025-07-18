import {scHelpers} from "~/assets/js/utils"
import {updateHeightsInViewport} from "codemirror/src/display/update_lines"

const {uniqueID} = scHelpers

export const menuEntries = [
    {
        id: uniqueID(),
        title: "Spots",
        icon: "mdi mdi-map-marker-multiple",
        page: "/spots",
        isOpen: false,
        level: 0,
        grade: ['0', '1'],
        submenu: [
            {
                id: uniqueID(),
                title: "Parkings",
                icon: "mdi mdi-parking",
                page: "/spots/parkings",
                grade: ['0', '1']
            },
            {
                id: uniqueID(),
                title: "EvCharges",
                icon: "mdi mdi-battery-charging",
                page: "/spots/evCharges",
                grade: ['0']
            },
            {
                id: uniqueID(),
                title: "GasStations",
                icon: "mdi mdi-gas-station",
                page: "/spots/gasStations",
                grade: ['0']
            },
            {
                id: uniqueID(),
                title: "CarWashes",
                icon: "mdi mdi-car-wash",
                page: "/spots/carWashes",
                grade: ['0']
            },
        ]
    },
    {
        id: uniqueID(),
        title: "Users",
        icon: "mdi mdi-account-circle",
        page: "/users",
        grade: ['0']
    },
    {
        id: uniqueID(),
        title: "Operations",
        icon: "mdi mdi-settings",
        page: "/operations",
        isOpen: false,
        level: 0,
        grade: ['0'],
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
                title: "Pushes",
                icon: "mdi mdi-lightbulb-on",
                page: "/operations/pushes",
            },
            // {
            //     id: uniqueID(),
            //     title: "ReviewTemplates",
            //     icon: "mdi mdi-file-document",
            //     page: "/operations/reviewTemplates"
            // },
            {
                id: uniqueID(),
                title: "PointProducts",
                icon: "mdi mdi-coin",
                page: "/operations/pointProducts"
            },
            {
                id: uniqueID(),
                title: "PointOrder",
                icon: "mdi mdi-cart",
                page: "/operations/pointOrders"
            },
            {
                id: uniqueID(),
                title: "Questions",
                icon: "mdi mdi-comment-question-outline",
                page: "/operations/questions"
            },
            {
                id: uniqueID(),
                title: "Popups",
                icon: "mdi mdi-checkbox-multiple-blank-outline",
                page: "/operations/popups"
            },
            {
                id: uniqueID(),
                title: "Versions",
                icon: "mdi mdi-android",
                page: "/operations/versions"
            },
            {
                id: uniqueID(),
                title: "Keys",
                icon: "mdi mdi-key",
                page: "/operations/keys"
            }
            // {
            //     id: uniqueID(),
            //     title: "Tutorials",
            //     icon: "mdi mdi-book-open-page-variant",
            //     page: "/operations/tutorials"
            // },
        ]
    },
    {
        id: uniqueID(),
        title: "PayLogs",
        icon: "mdi mdi-calendar-text",
        page: "/payLogs",
        grade: ['0']
    },
    {
        id: uniqueID(),
        title: "Bookings",
        icon: "mdi mdi-calendar-clock",
        page: "/bookings",
        grade: ['0']
    },
    {
        id: uniqueID(),
        title: "Settlements",
        icon: "mdi mdi-file-chart",
        page: "/settlements",
        grade: ['0', '1']
    },
    {
    	id: uniqueID(),
    	title: "Statistics",
    	icon: "mdi mdi-chart-bar",
    	page: "/statistics",
    	isOpen: false,
    	submenu: [
    		{
    			id: uniqueID(),
    			title:"ParkingSiteStatistic",
    			page: "/statistics/parkingSiteStatistic"
    		},
    		/*{
    			id: uniqueID(),
    			title: "CarStatistic",
    			page: "/statistics/carStatistic"
    		},
    		{
    			id: uniqueID(),
    			title: "PointStatistic",
    			page: "/statistics/pointStatistic"
    		}*/
    	]
    }
]
