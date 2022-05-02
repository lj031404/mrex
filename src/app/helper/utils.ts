const stringToFloat = (str) => {
	const numberPattern = /[+-]?\d+(\.\d+)?/g
	let rawNumber = 0

	try {
		rawNumber = parseFloat(str.replace(',', '').match(numberPattern).join(''))
	}
	catch (e) {}

	return rawNumber
}

export { stringToFloat }
