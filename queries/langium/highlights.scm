[
  "grammar"
  "with"
  "hidden"
  "entry"
  "fragment"
  "infers"
  "returns"
  "infer"
  "current"
] @keyword

(id) @variable

(string) @string

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
  "{"
  "}"
  "<"
  ">"
] @punctuation.bracket

(parameters
  (id) @variable.parameter)

(action_expression
  feature: (id) @property)

(assignment_expression
  feature: (id) @property)
