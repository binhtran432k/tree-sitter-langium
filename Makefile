.PHONY: build

build: parser/langium.so

parser/langium.so: src/parser.c
	$(RM) $@
	mkdir -p parser
	$(CC) -o $@ -Isrc $^ -shared -fPIC -Os

src/parser.c: grammar.js
	bun run build

.PHONY: all
all: build
	bun run test

.PHONY: update
update: build
	bun run test:update

.PHONY: run
run: all
	tree-sitter build-wasm
	tree-sitter web-ui
