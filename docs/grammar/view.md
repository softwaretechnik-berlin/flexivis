
# view.pegjs

## 


### Root

![Root](./view/Root.svg)

References: [ConfigurationList](#ConfigurationList), [ViewType](#ViewType), [ResourceList](#ResourceList)

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

Used by: [Root](#Root)

### ResourceList

![ResourceList](./view/ResourceList.svg)

Used by: [Root](#Root)
References: [Resource](#Resource)

### Resource

![Resource](./view/Resource.svg)

Used by: [ResourceList](#ResourceList)
References: [ConfigurationList](#ConfigurationList), [ResourceValue](#ResourceValue)

### ResourceValue

![ResourceValue](./view/ResourceValue.svg)

Used by: [Resource](#Resource)

