export default function ({ route, redirect, app }) {
	if (route.path === '/') {
		redirect('/spots/parkings')
		/*if(app.$auth.user && app.$auth.user.grade === 'SUPER') {
			redirect('/home')
		}else {
			redirect('/home2')
		}*/
	}
}
