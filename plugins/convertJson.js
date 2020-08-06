const Convert = {}

Convert.convertJson = function (json, type) {
	let dataArray = []
	Object.entries(json).map(function (obj) {
		let data = {}
		if (type === "select") {
			data.id = obj[0]
			data.text = obj[1]
		} else {
			data.value = obj[0]
			data.name = obj[1]
		}
		dataArray.push(data)
	})
	return dataArray
}

export default Convert
