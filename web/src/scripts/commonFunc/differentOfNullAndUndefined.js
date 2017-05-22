export function notNullNotUndefined(val){
	return (val !== undefined && val !== null) ? true : false;
}

export function NullOrUndefined(val){
	return (val === undefined || val === null) ? true : false;
}