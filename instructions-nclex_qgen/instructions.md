# **Product Requirements Document (PRD)**  
### *NCLEX Slide Generator (Two-Slide Approach with LLM Parsing)*

---

## **1. Overview & Goals**

1. **Purpose**  
   - Build a **local** Next.js application that:  
     1. Uses **OpenAI** (LLM) to parse raw NCLEX-style text into structured JSON (with question text, multiple-choice options, correct answer, rationale).  
     2. Produces **two separate 16:9 slides** per question:  
       - **Slide A**: Question text + multiple-choice options.  
       - **Slide B**: Correct answer + rationale.  
     3. Allows the user to **style** (template) each slide type in a WYSIWYG editor, then **lock** the style.  
     4. **Batch-generate** all slides as image files (PNG/JPG) saved locally.

2. **Primary Objectives**  
   - **Quick MVP**: Implement the simplest approach that meets these new 2-slide requirements.  
   - **LLM-based parsing**: Rely on carefully designed prompts to ensure consistent JSON output.  
   - **Local Execution**: Everything happens on `localhost`; images are stored locally.  
   - **Minimal Dependencies**: Use Next.js + React + shadcn/ui + Puppeteer + OpenAI; skip advanced preview of both slides if that slows us down.

3. **Success Criteria**  
   - A user can paste text containing multiple questions → parse → get a structured array.  
   - The user can define and lock styles for Slide A (Question + options) and Slide B (Answer + rationale).  
   - For each question, the system generates two distinct 16:9 PNGs using the locked styles.  
   - Basic console logging to aid debugging.

---

## **2. Technical Stack**

1. **Framework & Language**  
   - **Next.js (React + Node)** for front-end + server-side logic.  
   - JavaScript or TypeScript (whichever is preferred).

2. **UI & Styling**  
   - **shadcn/ui** for consistent, accessible React components (modals, buttons, color pickers, etc.).  
   - **Tailwind CSS** (native to shadcn/ui) for utility classes.

3. **Parsing**  
   - **OpenAI** (LLM) for parsing raw text into a JSON structure.  
   - A well-crafted prompt to ensure fields: `{ questionStem, answerChoices[], correctAnswer, rationale }`.

4. **WYSIWYG Editing**  
   - React-based editor library (e.g., `react-quill` or `@tinymce/tinymce-react`).  
   - Used to design how Slide A (question) and Slide B (answer/rationale) will look.

5. **Two-Slide Template & Locking**  
   - **Template A**: For question stem + answer choices.  
   - **Template B**: For correct answer + rationale.  

6. **Image Generation**  
   - **Puppeteer** to render each slide in 16:9 and export as PNG.

7. **Local Storage & Execution**  
   - Output slides to a local folder (`/slidesOutput`).  
   - Minimal or no external hosting.  
   - Logging via `console.log`.

---

## **3. Feature Scope & User Flow**

1. **Text Input & LLM Parse**  
   - **User** pastes bulk text containing multiple NCLEX questions.  
   - **App** calls an endpoint (e.g., `POST /api/parse-llm`) with user’s text + carefully designed prompt to get structured JSON.  
   - **JSON Output** example:  
     ```json
     [
       {
         "questionStem": "...",
         "answerChoices": [
           "1. ...",
           "2. ...",
           "3. ...",
           "4. ..."
         ],
         "correctAnswer": "2",
         "rationale": "Because..."
       },
       ...
     ]
     ```

2. **Slide A Style Setup** (Question + Choices)  
   - **User** sees one question’s data inserted into a WYSIWYG or preview.  
   - They pick fonts, colors, layout, alignment for the question stem & answer choices.  
   - **Lock**: The user finalizes and locks “Template A” (stores style config in memory or local JSON).

3. **Slide B Style Setup** (Answer + Rationale)  
   - **User** sees a WYSIWYG for the same or a sample question’s answer + rationale.  
   - They style it (background color, text font, size, possible highlight for correct answer, etc.).  
   - **Lock**: The user finalizes and locks “Template B.”

4. **Batch Generation**  
   - **User** clicks “Generate Slides.”  
   - **Process**:
     1. For each question object:  
        - **Slide A**: Insert questionStem + answerChoices into “Template A.” Puppeteer screenshot → `Question_1A.png`.  
        - **Slide B**: Insert correctAnswer + rationale into “Template B.” Puppeteer screenshot → `Question_1B.png`.  
     2. Save images in `slidesOutput/`.  
   - **Console Logs**: “Generating Q1 Slide A… done. Generating Q1 Slide B… done.”

---

## **4. Development Plan & Phases**

### Phase 1: Project Setup & LLM Parsing

1. **Create Next.js Project**  
   - `npx create-next-app nclex-two-slide`  
   - Integrate **shadcn/ui**.  
2. **Implement LLM Parsing**  
   - `pages/api/parse-llm.js`:  
     - Receives raw text + optional user’s OpenAI key.  
     - Builds a **prompt** that includes instructions + an example structure.  
     - Calls OpenAI’s `createChatCompletion` (or `createCompletion`), specifying `JSON`-formatted output.  
     - Returns the parsed JSON array or an error.  
   - **Prompt Example** (roughly):  
     ```
     You are an expert text parser. 
     Read the following nursing questions and produce valid JSON. 
     Each question object must have:
       questionStem, answerChoices (array of strings), correctAnswer (string), rationale (string).
     Return an array of these objects and ensure valid JSON.
     ```
   - **Testing**:  
     - Use a sample text block → confirm the JSON is valid.  
   - **Console Logs**: “Sending parse request to OpenAI…,” “Received X question objects.”

### Phase 2: Slide A Style Setup (Question + Choices)

1. **UI for Slide A**  
   - Provide a form with color pickers (shadcn/ui), font dropdown, etc.  
   - Display a live preview of the question + answer choices in a 16:9 container (`SlidePreviewA`).  
   - Underlying code uses a WYSIWYG for text styling or structured styling if easier.  
2. **Lock Template A**  
   - On “Lock Slide A,” store a config object, e.g.:
     ```js
     {
       questionStyle: { fontSize: "24px", color: "#000", ... },
       choiceStyle: { ... },
       backgroundColor: "#fff",
       ...
     }
     ```
   - **Console Logs**: “Template A locked! { … }”.

3. **Testing**  
   - **Manual**: Paste sample question → style it → check the preview → lock → confirm no errors.  

### Phase 3: Slide B Style Setup (Answer + Rationale)

1. **UI for Slide B**  
   - Similar approach, but now we show a snippet that includes “Answer: X” and “Rationale: ….”  
   - The user styles it (font, color, highlight correct answer, etc.).  
2. **Lock Template B**  
   - Similar to Template A, store a config object for answers + rationale.  
   - **Console Logs**: “Template B locked! { … }”.

3. **Testing**  
   - **Manual**: With the same question data, see how it looks for the answer/rationale → lock → confirm it’s stored.

### Phase 4: Batch Generation of Two Slides per Question

1. **Generation Endpoint**  
   - `pages/api/generate.js`:  
     - Receives array of parsed questions + locked configs A/B.  
     - Loops through each question:  
       1. **Slide A**: merges questionStem + answerChoices into a hidden route or template HTML applying Template A’s styles → Puppeteer screenshot → `Question_{i}A.png`.  
       2. **Slide B**: merges correctAnswer + rationale with Template B → Puppeteer screenshot → `Question_{i}B.png`.  
     - **Console Logs**: “Generating Q{i} Slide A… done. Generating Q{i} Slide B… done.”

2. **Hidden Routes or Components**  
   - e.g., `pages/templates/slideA.js` and `pages/templates/slideB.js`, each referencing the locked style config to render.  
   - Puppeteer navigates to those with query params like `?questionId=1&slide=question`.

3. **Testing**  
   - **Integration**:  
     - Parse 2–3 questions, lock Slide A/B, generate → check 2 images *per question* in `slidesOutput/`.  
     - Confirm the correct text is in each PNG.

### Phase 5 (Optional Polishing)

- If time permits:  
  - Add partial previews of “final slides” for both A/B in one combined view.  
  - Add progress bar for generation.  
  - Add more advanced logging or highlight correct answer in a distinct color.

---

## **5. Logging & Error Handling**

1. **LLM Parse**  
   - Print “Sending to OpenAI…,” “Parsed JSON: …,” or “Parse error: ….”  
2. **Template Locking**  
   - Print the locked style config object.  
3. **Generation**  
   - Print each question ID, slide type being generated, and success/failure messages.  
4. **Failure Cases**  
   - If a question is missing correctAnswer or rationale, log a warning: “Skipping Q{i}: missing data.”  
   - If Puppeteer fails to screenshot, print an error stack trace.

---

## **6. Project Structure (Example)**

```
nclex-two-slide/
├── pages/
│   ├── index.js                   # Main UI (paste text, parse LLM, show #questions)
│   ├── api/
│   │   ├── parse-llm.js           # LLM parse endpoint
│   │   └── generate.js            # Two-slide generation endpoint
│   ├── templates/
│   │   ├── slideA.js             # Renders question + choices using Template A config
│   │   └── slideB.js             # Renders answer + rationale using Template B config
│   └── _app.js                    # shadcn/ui setup, global styles
├── components/
│   ├── SlidePreviewA.js           # 16:9 preview for question + choices
│   ├── SlidePreviewB.js           # 16:9 preview for answer + rationale
│   ├── StyleControlsA.js          # shadcn/ui form to set question/choices style
│   ├── StyleControlsB.js          # shadcn/ui form for answer/rationale style
│   └── Editor.js                  # (Optional) WYSIWYG integration
├── lib/
│   ├── openaiPrompt.js            # Prompt + function for LLM calls
│   ├── generateLogic.js           # Puppeteer logic (2 slides per question)
├── slidesOutput/                  # Output PNGs stored here
├── tailwind.config.js
├── package.json
└── README.md
```

---

## **7. Testing Strategy**

1. **Phase 1 (LLM Parse)**  
   - **Manual**: Paste known text → parse → see console logs with the JSON array.  
   - **Mock/OpenAI** tests: Possibly a unit test with a known response.

2. **Phase 2 & 3 (Lock Templates)**  
   - **Manual**: Use a sample question object → style Slide A → lock → style Slide B → lock.  
   - Check console logs confirm the locked config.

3. **Phase 4 (Generate Slides)**  
   - **Integration**: Provide 2–3 question objects → run generation → see 4–6 PNG files (2 per question) in slidesOutput.  
   - Visually confirm correctness.

4. **Error Handling**  
   - Test with incomplete data (missing rationale, etc.) → ensure logs show warnings and don’t crash.

---

## **8. Acceptance Criteria**

1. **LLM Parsing**  
   - The system successfully converts raw text into a JSON array with `questionStem`, `answerChoices[]`, `correctAnswer`, and `rationale`.  
   - Logging confirms parse success.

2. **Two Separate Style Templates**  
   - Slide A style config for question + choices.  
   - Slide B style config for answer + rationale.  
   - Both can be locked independently.

3. **Batch Generation**  
   - For each question, **two distinct 16:9 PNGs** appear in `slidesOutput`: `Question_iA.png` and `Question_iB.png`.  
   - The correct text/data is displayed in each slide.

4. **Local-Only**  
   - No forced cloud storage; images stored locally.  
   - LLM calls require internet, but the rest is local.

5. **MVP Timeliness**  
   - The solution can be built and tested quickly—no extraneous features delaying the MVP.

---
