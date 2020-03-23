Root = Unparenthesized / Empty

Empty = '' { return {view:'url', size: 100}; }

Sep = [/-]

View = view:(Parenthesized / Label) size:Int? { return { view, size}; };

Parenthesized = '(' inner:Unparenthesized ')' { return inner; };

Unparenthesized = Split / SingleView

SingleView = view:View { return view.view }

Split = a:View conts:SplitContinuation+ & { return conts.every(c => c.sep == conts[0].sep) } {
  let views = [a].concat(conts.map(c => c.view))
  let defaultSize = (100 - views.reduce((a, v) => a + v.size, 0)) / views.filter(v => !v.size).length
  views.forEach(v => v.size = v.size || defaultSize)
  return { sep: conts[0].sep, views }
}

SplitContinuation = sep:Sep view:View { return {sep, view}}

Label = [a-zA-Z]+ { return text(); }

Int = [0-9]+ { return parseInt(text(), 10); }
