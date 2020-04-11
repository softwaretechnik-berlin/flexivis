Root =
  config:ConfigurationList? view:(InlineView / RegularView) {
    view.config = config || [];
    return view;
  }

InlineView = type:ViewType ':inline:' content:(.* { return text(); }) {
  return { type, resources: [{ config: [], value: "data:," + encodeURIComponent(content) }] }
}
RegularView = type:ViewType resources:(
  	':'
    list:ResourceList?
    { return list; }
  )?
  { return { type, resources: resources || [] }; }

ConfigurationList =
  '('
  head:Configuration
  tail:(
    ';'
    pairs:Configuration
    { return pairs; }
  )*
  ')'
  { return Object.fromEntries([head, ...tail]); };
Configuration =
  key:ConfigurationKey
  value:(
    '='
    v:ConfigurationValue
    { return v; }
  )?
  {
    return [key, value];
  }
ConfigurationKey =
  [a-zA-Z]+
  { return text(); }
ConfigurationValue =
  ConfigurationList /
  (
    head:[^;),]*
    tail:(
      ','
      values:[^;),]*
      { return values; }
    )*
    { return tail.length === 0 ? head.join("") : [head, ...tail].map(str => str.join("")); }
  )

ViewType =
  [a-zA-Z-]+
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
