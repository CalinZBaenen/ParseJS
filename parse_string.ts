/**
* Parses a string and returns a list consisting of one of
* length-1-`string` (`char`) or `symbol`, representing the
* tokens the scanner finds.
* Every time a token is successfully found, a symbol representing
* the token is inserted, otherwise the current character is
* used instead.
* @param str The string to scan.
* @param toks A list of possible tokens to find.
* @return A list representing the scanner's findings.
*/
const parse_string = function parse_string(
	str:string="", toks:Array<string>=null
):Array<string|symbol> {
	if(
		str.length <= 0 ||
		(toks ?? null) === null ||
		toks.length <= 0
	) return new Array();
	
	let parsed_array:Array<string|symbol> = new Array();
	let tok_entpts:Map<string, string[]|string> = new Map();
	for(let i = 0; i < toks.length; i++) {
		const t = toks[i];
		if(tok_entpts.has(t[0])) {
			const v = tok_entpts.get(t[0]);
			if(v instanceof Array) v.push( t );
			else tok_entpts.set(t[0], [v, t]);
		} else tok_entpts.set(t[0], t);
	}
	for(const t of tok_entpts.values())
		if(t instanceof Array) t.sort((x=null, y=null) => {
			[x, y] = [x ?? "", y ?? ""];
			return (y.length - x.length) || x.localeCompare(y);
		});
	
	for(let i = 0; i < str.length; i++) {
		const c = str[i];
		if(tok_entpts.has(c)) {
			const v = tok_entpts.get(c);
			if(typeof v === "string") {
				const slc = str.slice(i, i+v.length);
				const tvs = slc === v;
				if(tvs) {
					parsed_array.push( Symbol.for(slc) );
					i += v.length-1;
				} else parsed_array.push(c);
			}
			if(v instanceof Array) for(let i2 = 0; i2 < v.length; i2++) {
				const tok = v[i2];
				
				const slc = str.slice(i, i+tok.length);
				const tvs = slc === tok;
				if(tvs) {
					parsed_array.push( Symbol.for(tok) );
					i += tok.length-1;
					break;
				} else if(i2 >= v.length) parsed_array.push(c);
			};
		} else parsed_array.push(c);
	}
	
	return parsed_array;
}