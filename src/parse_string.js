/**
* Parses a string and returns a list consisting of one of
* length-1-`string` (`char`) or `symbol`, representing the
* tokens the scanner finds.
* Every time a token is successfully found, a symbol representing
* the token is inserted, otherwise the current character is
* used instead.
* @param {string} str The string to scan.
* @param {(string|symbol)[]} toks A list of possible tokens to find.
* @param {boolean} includeUnknownChars Whether or not to include the left-over characters in the lexed array.
* @return {(string|symbol)[]} A list representing the scanner's findings.
*/
const parse_string = function parse_string(str="", toks=null, includeUnknownChars=true) {
	if(str.length === 0 || toks == null) return new Array();
	
	const parsedArray = new Array();  // The fully evaluated result.
	const tokEntpts   = new Map();    // The token entrypoints (i.e. a map from the first character to a list of tokens).
	
	// Record the tokens.
	for(const pptok of toks) {
		const tok = String(typeof pptok === "symbol" ? pptok.description : pptok);
		if(tok.length === 0) continue;
		
		if(tokEntpts.has( tok[0] )) tokEntpts.get( tok[0] ).push(tok);
		else tokEntpts.set(tok[0], [tok]);
	}
	
	// Sort the tokens.
	for(const toklist of tokEntpts.values()) if(toklist?.length > 1)
		toklist.sort((x=undefined, y=undefined)=>{
			[x, y] = [x ?? "", y ?? ""];
			return (y.length-x.length) || x.localeCompare(y);
		});
	
	// Find the tokens.
	for(let i = 0; i < str.length; i++) {
		const c = str[i];
		
		if( tokEntpts.has(c) ) {
			
			const toklist = tokEntpts.get(c);
			for(let ti = 0; ti < toklist.length; ti++) {
				const tok = toklist[ti];
				if(str.slice(i, i+tok.length) === tok) {
					parsedArray.push( Symbol.for(tok) );
					i += tok.length-1;
					break;
				} else if(ti === toklist.length-1 && includeUnknownChars) parsedArray.push(c);
			}
			
		} else if(includeUnknownChars) parsedArray.push(c);
	}
	
	return parsedArray;
};