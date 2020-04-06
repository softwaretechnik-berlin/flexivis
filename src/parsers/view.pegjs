Root =
  config:ConfigurationList?
  view:ViewType
  resources:(
  	':'
    list:ResourceList?
    { return list; }
  )?
  { return { view, config: config || [], resources: resources || [] }; }

ConfigurationList =
  '('
  head:Configuration
  tail:(
    ';'
    pairs:Configuration
    { return pairs; }
  )*
  ')'
  { return [head, ...tail].flat(); };
Configuration =
  key:ConfigurationKey
  value:(
    '='
    v:ConfigurationValue
    { return v; }
  )?
  {
    return { key, value };
  }
ConfigurationKey =
  [a-zA-Z]+
  { return text(); }
ConfigurationValue =
  head:[^;),]*
  tail:(
    ','
    values:[^;),]*
    { return values; }
  )*
  { return tail.length === 0 ? head.join("") : [head, ...tail].map(str => str.join("")); }

ViewType =
  [a-zA-Z]+
  { return text(); }

ResourceList =
  head:Resource
  tail:(
    ';'
    resources:Resource
    { return resources; }
  )*
  { return [head, ...tail].flat(); }
Resource =
  config:ConfigurationList?
  value:ResourceValue
  { return { value, config: config || [] }; }
ResourceValue =
  [^;]+
  { return text(); }
