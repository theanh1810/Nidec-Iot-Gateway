const convertToFloat = (val = 0, pow = 1) => {
    if(val == '' || val == null || val == undefined) return 0;
    if(parseFloat(val) == NaN) return 0;
    
    return Math.round(parseFloat(val) * 10)/(Math.pow(10, pow));
}

const  convertToInt = (val = 0, pow = 1) => {
    if(val == '' || val == null || val == undefined) return 0;
    if(parseFloat(val) == NaN) return 0;
    
    return Math.round(parseFloat(val));
}

module.exports = {
	convertToFloat,
	convertToInt,
}