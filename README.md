# ParseJS
ParseJS is a simple library I made (and bug-fixed) in the span of two (2) days.
Currently, ParseJS (and ParseTS) remain \*mostly\* complete.



## Description.
### English.
The `parse_string` function of ParseJS takes in a block of text, and a list of keywords (tokens\*) and scans the text you provided letter by letter and returns a list.  
If there is a keyword that begins with the letter the function is currently looking at,  checks if the sequence of letters ahead of the current letter (in combination with the current one) spells out a valid keyword.   If it does, a `symbol` representing the token found will be inserted into the list, otherwise the current letter is inserted instead.



### Programmernese.
The `parse_string` function of ParseJS takes in a string (`str`) and an array of strings (`toks`) and returns an array (`parsed_array`) of `string` OR `symbol` (`Array<string|symbol>`).
`parse_string` iterates over `str`, and if there is a string (keyword\*) in `toks` that begins with the current character being iterated over, it will check if the following sequence of characters forms a valid keyword.
If a valid keyword is found, a `symbol` (`Symbol.for( tok )`) is inserted into `parsed_array`, otherwise the current character is inserted instead.



## Examples
### Sonic The Hedgehog. <img alt="Image of Sonic the Hedgehog." src="https://vignette3.wikia.nocookie.net/iwbtb/images/2/26/Sonic_Sprite.png/revision/latest?cb=20140605232648" width="42" height="60"/><img alt="Image of Tails the two-tailed Fox." src="https://vignette.wikia.nocookie.net/animal-jam-clans-1/images/7/7a/Tails_flying_sprite(1).gif/revision/latest?cb=20170901164051" width="42" height="60"/><img alt="Image of Knuckles the Echidna." src="https://vignette.wikia.nocookie.net/exenightmare/images/9/9f/Knuxsprite.png/revision/latest/scale-to-width-down/310?cb=20180714012135" width="42" height="60"/>
![A `parse_string` test that uses Sonic characters as tokens. - `example.png`](./example.png)

So, we have this code. - Let's try to explain what's going on, and why we get the output we do.
```javascript
// We tell `parse_string` that we want it to read "Knuckles, Tails, Amy, Sonic", but only search for "Sonic", "Tails", "Knuckles".
parse_string("Knuckles, Tails, Amy, Sonic", [
  "Sonic", // "Sonic" is a keyword because it is included in this list.
  "Tails", // Same for "Tails".
  "Knuckles" // Ditto.
]);
```
This produces the output:
```javascript
[
  Symbol.for(Knuckles), // "Knuckles" was a keyword - `parse_string` found "Knuckles".
  
  ',', // The character right after "Knuckles".
  ' ', // Character after the character after knuckles. -- This isn't a keyword, so it's left alone.
  
  Symbol.for(Tails),
  
  ',',
  ' ',
  'A', // "Amy" isn't a keyword, so her name is left alone.
  'm',
  'y',
  ',',
  ' ',
  
  Symbol.for(Sonic) // Sonic's at the end, but he was still found, so his name is "tokenized".
]
```

### Testing. Testing! One (1). Two (2). Three (3).
![A `parse_string` test that uses keywords that are variants of each other. - `example2.png`](./example2.png)

Now. Lets do some more fiddling around. . .
```javascript
parse_string("test12 test1 test2 test", [
  "test",
  "test1",
  "test12",
  "test2"
]);
```
Ok, so, let's walk through this.
```
t
```
Well, we have `t`. That's a good start. Now we look to see what keywords start with `t`-  
Oh... well, that's strange. It looks like we have four "candidates".  
Let's remove the obvious loser: ~~`test2`~~.

Now, we still have three possible candidates: `test`, `test1`, and `test12`.  
How do we know which one to pick? - Simple. First we sort the candidates by length; `test12`, `test1`, `test`.
Then, we arrange candidates in dictionary order. For this case, it doesn't change anything.  
So. Now what? Well, let's scan ahead, if the next characters are `est1`, then we could use `test1`. - BUT, if  the next characters are `est12`, we could use `test12`.  
Since `test12` is longer than `test1` or `test`, it takes precedents. I.e. `parse_string` prefers this longer token because it's more confident this prediction is correct.



## Bugs
 - [Version 0.01](https://github.com/CalinZBaenen/ParseJS/commit/2c45829fad3271c238963d8e3ec441b5df2144e6): Tokens aren't sorted in order of length, causing inaccuracies. - Fixed in [Version 0.02](https://github.com/CalinZBaenen/ParseJS/commit/7f9878e6f14daef1492ece3121b4e8f4ac6848fa).
 - [Version 0.01](https://github.com/CalinZBaenen/ParseJS/commit/2c45829fad3271c238963d8e3ec441b5df2144e6) \- [Version 0.04](https://github.com/CalinZBaenen/ParseJS/commit/81fb910d8a979881e2c3a762f0135d1922b092f9): When searching for multiple keyword "candidates", ghost characters would be left behind. See [this DEV article](https://dev.to/baenencalin/critical-update-for-parsejsparsets-4mpf) for more info. - Fixed in [Version 0.05](https://github.com/CalinZBaenen/ParseJS/commit/78ec5f7e7addeab9d9eca7c64be6b54025360d57).
