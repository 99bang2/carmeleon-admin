export default async function ({ route, redirect, app }) {
	// 모달창 오류
	let modals = document.getElementsByClassName('uk-modal')
	if(modals.length > 0) {
		for(let modal of modals){
			modal.parentNode.removeChild(modal)
		}
	}
}
