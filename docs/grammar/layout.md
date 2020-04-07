
# layout.pegjs

## 


### Root

![Root](./layout/Root.svg)

References: [Unparenthesized](#Unparenthesized)

### Unparenthesized

![Unparenthesized](./layout/Unparenthesized.svg)

Used by: [Root](#Root), [Parenthesized](#Parenthesized)
References: [View](#View), [VerticalSplits](#VerticalSplits), [HorizontalSplits](#HorizontalSplits)

### View

![View](./layout/View.svg)

Used by: [Unparenthesized](#Unparenthesized), [VerticalSplits](#VerticalSplits), [HorizontalSplits](#HorizontalSplits)
References: [Parenthesized](#Parenthesized), [Name](#Name), [Size](#Size)

### Parenthesized

![Parenthesized](./layout/Parenthesized.svg)

Used by: [View](#View)
References: [Unparenthesized](#Unparenthesized)

### VerticalSplits

![VerticalSplits](./layout/VerticalSplits.svg)

Used by: [Unparenthesized](#Unparenthesized)
References: [View](#View)

### HorizontalSplits

![HorizontalSplits](./layout/HorizontalSplits.svg)

Used by: [Unparenthesized](#Unparenthesized)
References: [View](#View)

### Name

![Name](./layout/Name.svg)

Used by: [View](#View)

### Size

![Size](./layout/Size.svg)

Used by: [View](#View)

