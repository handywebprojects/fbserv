# Variant polyglot books

The project contains polyglot books for the following variants ( in paranthesis the appropriate lichess variant key ):

- Antichess ( `antichess` )
- Atomic ( `atomic` )
- King of the Hill ( `kingOfTheHill` )
- Three-check ( `threeCheck` )
- Racing Kings ( `racingKings` )
- Horde ( `horde` )

The books were built using cbuild, from all time lichess games where both players were >= 2300 rated, in max depth of 20 plies. ( In the case of some less played variants the 2300 rating limit failed to produce a meaningful book, so these were rebuilt with lower rating limit. See the commit history. )

## Download the books

- visit [https://fbserv.herokuapp.com/](https://fbserv.herokuapp.com/), go to the Dirbrowser tab, select the `books` directory and click on the desired book

- use the file download api of the above server, example: [https://fbserv.herokuapp.com/file/books/antichess.bin](https://fbserv.herokuapp.com/file/books/antichess.bin)

- download or clone the project and go the books directory: `git clone https://github.com/handywebprojects/fbserv`

## Browse the books online

Visit [https://fbserv.herokuapp.com/](https://fbserv.herokuapp.com/), go to the Board tab, select a variant, make some moves, then open the "Book" tab to see the appropriate polyglot book page.

## Use the book API

To get the book page for a given variant and fen, use the API in the format:

`https://fbserv.herokuapp.com/getbook/[variantkey]/[fen]`

example: [https://fbserv.herokuapp.com/getbook/atomic/rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1](https://fbserv.herokuapp.com/getbook/atomic/rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR%20w%20KQkq%20-%200%201)
