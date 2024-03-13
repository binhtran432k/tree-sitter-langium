[
  "grammar"
  "interface"
  "extends"
  "with"
  "hidden"
  "entry"
  "fragment"
  "infers"
  "returns"
  "infer"
  "current"
  "terminal"
] @keyword

(id) @variable

[
  (string)
  (keyword)
] @string

"import" @keyword.import

[
  "="
  "+="
  "?="
  "=>"
  "->"
  "*"
  "+"
  "?"
  "|"
  "&"
  "!"
  ".."
  "?="
  "?!"
  "?<="
  "?<!"
] @operator

[
  (line_comment)
  (block_comment)
] @comment @spell

[
  ":"
  ";"
  ","
  "."
] @keyword.symbol ; HACK: same as VSCode

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
  "<"
  ">"
  "/"
] @punctuation.bracket

(primitive_type) @type.builtin

(builtin_feature_name) @keyword

(boolean) @boolean

(regex_pattern) @string.regexp

(regex_flags) @string.special

(parameter_reference) @variable.parameter

(parameters
  (id) @variable.parameter)

(action
  feature: (id) @property)

(assignment
  feature: (id) @property)

(returns
  type: (id) @type)
