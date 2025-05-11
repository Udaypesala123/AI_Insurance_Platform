# Insurance Claim Parser

This is a single-page web application built with Next.js 14 App Router and TypeScript that helps extract and identify the primary insured entity from insurance claim documents using **LLM (OpenAI GPT-4o)**. It supports drag-and-drop uploads of `.pdf`, `.docx`, or `.txt` files, and matches extracted names to a predefined internal ID list.

## Features
- Drag and drop uploader for `.pdf`, `.docx`, `.txt`
- PDF text extraction using [`pdf-parse`](https://www.npmjs.com/package/pdf-parse)
- LLM (OpenAI GPT-4o) integration via secure Next.js API route
- Custom string similarity matching via Levenshtein distance
- Manual fallback for unmatched names with confidence score
- Jest test for matching logic

## Tech Stack
- Frontend: React 18 + Tailwind CSS + TypeScript
- Backend API: Next.js App Router (`app/api/`)
- LLM: [OpenAI Node SDK](https://github.com/openai/openai-node)
- Text Extraction: [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- Matching Logic: [`js-levenshtein`](https://www.npmjs.com/package/js-levenshtein)
- Testing: [Jest](https://jestjs.io/) + [ts-jest](https://www.npmjs.com/package/ts-jest)

## Installation
```bash
npx create-next-app@latest insurance-claim-parser --ts --app --tailwind
git clone https://github.com/uday/insurance-claim-parser
cd insurance-claim-parser
npm install <dependencies> ( which include string-similarity, jest, mammoth, openai, pdf-parse, levenshtein etc.,)
.env.local
```


### `.env.local`
```
OPENAI_API_KEY=<your-API-Key>

LLM_SYSTEM_MESSAGE=Extract the full name of the primary insured entity. !!!very important...only give the text you think is the name in given context(no need to be original name)...no extra text.
```

## Run the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

Upload Files

## Run manual Tests
```bash
npm test
```

## File Structure
```
src/
- app/
|   -page.tsx               # Main UI
|   -api/llm/route.ts       # LLM server API (OpenAI) Server Response
|   -api/parse/route.ts
- components/
|   - Dropzone.tsx           # Drag-and-drop uploader
|   - ResultsTable.tsx       # Results UI with confidence & manual match
| lib/
|   - insureds.ts            # Internal ID list
|  - llm.ts                 # Client API call to /api/llm
|   - match.ts               # Matching logic (Levenshtein, normalization)
|   - parser.ts              # Extract text (uses pdf-parse)
| tests/
    - match.test.ts          # Jest test for matchInsured
```

## Cited Libraries
- [`pdf-parse`](https://www.npmjs.com/package/pdf-parse)
- [`openai`](https://www.npmjs.com/package/openai)
- [`js-levenshtein`](https://www.npmjs.com/package/js-levenshtein)
- [`jest`](https://jestjs.io/) + [`ts-jest`](https://www.npmjs.com/package/ts-jest)

##  Notes & Assumptions
- Assumes input documents contain extractable text.
- Uses simple Levenshtein similarity for fuzzy matching.
- LLM API key is securely accessed via server route.
- Confidence score is visualized with a progress bar.

## Optional Enhancements
- OCR fallback (e.g., Tesseract.js for scanned PDFs)
- Progress indicator per file
- Streaming LLM response
- NLP suffix stripping

## Deliverables
- Drag and drop UI
- LLM-based extraction
- Entity matching
- Confidence score
- Manual override
- Secure API integration
- Jest test


## Architecture Notes :

This project follows a modular and clean structure using Next.js App Router. The UI is built with reusable React components like Dropzone for uploading files and ResultsTable for displaying results. The logic is separated into helper files under the lib/ folder — making it easy to test, update, or replace specific parts (like the parser, LLM, or matcher) without touching the UI.

All LLM calls to OpenAI are made securely through a server-side API route (/api/llm), so the API key never touches the client. Text extraction is handled locally using pdf-parse, and if the LLM can't find a strong match, the app falls back to manual selection with a confidence bar to help users decide. The design keeps everything lightweight, testable, and extensible — just enough structure to be practical without overengineering.

## Assumptions & Trade-offs

LLM over OCR: Instead of running OCR, we rely on GPT-4o's vision model for interpreting scanned PDFs. This simplifies the stack but may incur higher API costs.

Matching Logic: A basic fuzzy match is implemented using Levenshtein distance; this may yield false positives/negatives for very similar names unless further tuned.

PDFS: The pdf-parse library is causing inconsistent behavior with different PDF files. In some cases, it fails to parse the file content correctly, resulting in "no match" errors due to empty or incorrect text extraction.
