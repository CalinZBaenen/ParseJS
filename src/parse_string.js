/**
* Parses a string and returns a list consisting of one of
* length-1-`string` (`char`) or `symbol`, representing the
* tokens the scanner finds.
* Every time a token is successfully found, a symbol representing
* the token is inserted, otherwise the current character is
* used instead.
* @param {string} str The string to scan.
* @param {(string|symbol)[]} toks A list of possible tokens to find.
* @param {boolean} iukwc Whether or not to include the left-over characters in the lexed array.
* @return {(string|symbol)[]} A list representing the scanner's findings.
*/
const parse_string = function parse_string(str="", toks=null, iukwc=true) {
	if(
		str.length <= 0 ||
		(toks ?? null) === null ||
		toks.length <= 0
	) return new Array();
	
	let parsed_array = new Array();
	let tok_entpts = new Map();
	for(let i = 0; i < toks.length; i++) {
		const tok = (
			(typeof toks[i] === "symbol") ?
			String(toks[i].description ?? "") :
			toks[i]
		);
		if(tok.length <= 0) continue;
		if( tok_entpts.has(tok[0]) ) {
			const val = tok_entpts.get( tok[0] );
			if(val instanceof Array) val.push( tok );
			else tok_entpts.set(tok[0], [val, tok]);
		} else tok_entpts.set(tok[0], tok);
	}
	for(const tok of tok_entpts.values())
		if(tok instanceof Array) tok.sort((x=null, y=null) => {
			[x, y] = [x ?? "", y ?? ""];
			return (y.length - x.length) || x.localeCompare(y);
		});
	
	for(let i = 0; i < str.length; i++) {
		const c = str[i];
		if(tok_entpts.has(c)) {
			const val = tok_entpts.get(c);
			if(typeof val === "string") {
				const slc = str.slice(i, i+val.length);
				if(slc === val) {
					parsed_array.push( Symbol.for(slc) );
					i += val.length-1;
				} else parsed_array.push(c);
			}
			if(val instanceof Array) for(let i2 = 0; i2 < val.length; i2++) {
				const tok = val[i2];
				
				const slc = str.slice(i, i+tok.length);
				if(slc === val) {
					parsed_array.push( Symbol.for(tok) );
					i += tok.length-1;
					break;
				} else if(i2 >= v.length-1) parsed_array.push(c);
			};
		} else if(iukwc) parsed_array.push(c);
	}
	
	return parsed_array;
}
