Root = Unparenthesized / Empty

Empty = '' { return null }

View = view:(Parenthesized / Name) size:Size? { return { view, size}; };

Parenthesized = '(' inner:Unparenthesized ')' { return inner; };

Unparenthesized = a:View splits:(VerticalSplits / HorizontalSplits)? {
  if (!splits) return a.view
  let views = [a].concat(splits.views)
  let defaultSize = (100 - views.reduce((a, v) => a + v.size, 0)) / views.filter(v => !v.size).length
  views.forEach(v => v.size = v.size || defaultSize)
  return { sep: splits.sep, views }
}

VerticalSplits = views:("/" v:View {return v} )+ { return {sep: "/", views} }
HorizontalSplits = views:("-" v:View {return v} )+ { return {sep: "-", views} }

Name "view name (consisting of alphabetic characters)" = [a-zA-Z]+ { return text(); }

Size "size specifier (number between 0 and 100)" = [0-9]+ { return parseInt(text(), 10); }
