
# view.pegjs

## 


### Root

![Root](./view/Root.svg)

References: [ConfigurationList](#ConfigurationList), [InlineView](#InlineView), [RegularView](#RegularView)

### InlineView

![InlineView](./view/InlineView.svg)

Used by: [Root](#Root)
References: [ViewType](#ViewType)

### RegularView

![RegularView](./view/RegularView.svg)

Used by: [Root](#Root)
References: [ViewType](#ViewType), [ResourceList](#ResourceList)

### ConfigurationList

![ConfigurationList](./view/ConfigurationList.svg)

Used by: [Root](#Root), [ConfigurationValue](#ConfigurationValue), [Resource](#Resource)
References: [Configuration](#Configuration)

### Configuration

![Configuration](./view/Configuration.svg)

Used by: [ConfigurationList](#ConfigurationList)
References: [ConfigurationKey](#ConfigurationKey), [ConfigurationValue](#ConfigurationValue)

### ConfigurationKey

![ConfigurationKey](./view/ConfigurationKey.svg)

Used by: [Configuration](#Configuration)

### ConfigurationValue

![ConfigurationValue](./view/ConfigurationValue.svg)

Used by: [Configuration](#Configuration)
References: [ConfigurationList](#ConfigurationList)

### ViewType

![ViewType](./view/ViewType.svg)

Used by: [InlineView](#InlineView), [RegularView](#RegularView)

### ResourceList

![ResourceList](./view/ResourceList.svg)

Used by: [RegularView](#RegularView)
References: [Resource](#Resource)

### Resource

![Resource](./view/Resource.svg)

Used by: [ResourceList](#ResourceList)
References: [ConfigurationList](#ConfigurationList), [ResourceValue](#ResourceValue)

### ResourceValue

![ResourceValue](./view/ResourceValue.svg)

Used by: [Resource](#Resource)

