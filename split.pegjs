Root = Split / Single / Empty

Empty = '' { return ['url', 100, 'X', 0, '']; }

Sep = [/-]

Single = a:Val { return [a, 100, 'X', 0, '']; };

Val = val:(Parenthesized / Label) { return val; };

Parenthesized = '(' inner:(Split / Val) ')' { return inner; };

Split
	=
    a:Val sep:Sep b:Val { return [a, 50, sep, 50, b]}
    / a:Val i:Int sep:Sep b:Val { return [a, i, sep, 100 - i, b]}
    / a:Val sep:Sep i:Int b:Val { return [a, 100 - i, sep, i, b]}

Label = [a-zA-Z]+ { return text(); }

Int = [0-9]+ { return parseInt(text(), 10); }
