# Long-Form Media Deconstructor

[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini-blue.svg)](https://deepmind.google/technologies/gemini/)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB.svg)](https://react.dev/)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)

An advanced, AI-powered progressive web app designed to analyze and deconstruct long-form and complex media. It transforms unstructured content from scientific publications, audio files, videos, images, and entire document archives into structured, queryable knowledge.

This tool acts as a cognitive partner, helping researchers, analysts, and students to rapidly synthesize information, uncover hidden connections, and interact with their content in a conversational, intuitive way.

---

## Live Demo on Google AI Studio

You can try the live version of this application directly in your browser, hosted on Google AI Studio.

**[➡️ Launch the Deconstructor App on AI Studio](https://ai.studio/apps/drive/1W5qD7J9NrNLMOcaXG9-FS5bs9s7etgTH)**

**What is AI Studio?**
[Google AI Studio](https://ai.google.dev/aistudio) is a web-based toolkit for developers to discover, prototype, and build with Google's generative AI models. This application is a great example of an "AI Studio App," which allows developers to create and share sophisticated AI-powered tools with a user-friendly interface, backed by the power of the Gemini API.

---

## Why Use The Deconstructor?

-   **Accelerate Research:** Instantly extract the thesis, arguments, and key terms from dense academic papers, saving hours of reading time.
-   **Decode Complex Conversations:** Get timestamped, speaker-differentiated transcripts, thematic breakdowns, and fact-checks from podcasts, interviews, or lectures.
-   **Unravel Narrative Structures:** Deconstruct the plot points, character arcs, and thematic elements from videos, scripts, or literary works.
-   **Synthesize Entire Archives:** Discover hidden connections, build timelines, and identify key entities across a large collection of disparate documents.

---

## Core Features

The Deconstructor provides tailored analysis dashboards for each content type.

### For All Content
-   **Dual Analysis Modes:** Choose **Express** for a fast, cost-effective overview or **Standard** for a deep, comprehensive analysis with higher-quality results.
-   **Conversational AI Chat:** Ask follow-up questions about any analysis in natural language to dive deeper into the results.
-   **Flexible Export Options:** Download your results as a formatted Markdown file for easy integration into your notes or reports.
-   **URL Analysis:** Analyze content directly from the web, with specialized support for **YouTube**, **TED Talks**, and the **Internet Archive**.

### Analysis-Specific Capabilities
-   **Publication Analysis (`.txt`):** Generates an interactive argument map, a structured summary (thesis, methodology, results), and a key concepts glossary.
-   **Audio Analysis (`.mp3`, `.wav`):** Provides a clickable, speaker-differentiated transcript, thematic segments, sentiment/tone analysis, and (in Standard Mode) AI-powered fact-checking with sources.
-   **Video Analysis (`.mp4`, `.mov`):** Creates an interactive timeline of plot points, summarizes character arcs, and identifies recurring themes with timestamped examples.
-   **Image Analysis (`.jpg`, `.png`):** Produces a rich AI description, a list of identified objects, and extracts any text via Optical Character Recognition (OCR).
-   **Archive Analysis (Multiple Files):** Synthesizes a cross-document timeline, identifies and disambiguates key entities, reveals thematic connections, and visualizes relationships in an interactive knowledge graph.

---

## Power-User Features

-   **Persistent Analysis Archive:** Every analysis is automatically saved to your browser. Browse, search, edit titles, and add notes (with Markdown and task lists) from a dedicated archive page.
-   **Command Palette (`Cmd/Ctrl + K`):** Instantly access any major function—from starting a new analysis to exporting results—with a searchable command menu.
-   **Productivity Shortcuts:** Navigate the app and perform common actions using global keyboard shortcuts (e.g., `Cmd+N` for New Analysis, `Cmd+O` for Open Archive).
-   **Full Data Sync & Backup:** Export your entire application state, including all archived analyses, notes, and settings, to a single JSON file. Import it to another browser or device to restore your workspace.

---

## Accessibility
- **High Contrast Mode:** A dedicated theme for users with visual impairments, ensuring maximum readability.
- **Adjustable Font Size:** Scale the UI text to your preferred reading size.
- **Animation Control:** Disable all UI animations for a simpler, motion-free experience, which also respects your OS-level "Reduce Motion" setting.
- **Full Keyboard Navigation:** The entire application is designed to be navigable and operable using only a keyboard.

---

## How to Use

1.  **Select Project Type & Analysis Depth:**
    -   Choose **Single Source** for one file/URL or **Archival Collection** to analyze multiple files together.
    -   Select **Standard** (deep analysis) or **Express** (faster overview).

2.  **Provide Your Content:**
    -   If 'Single Source' is selected, you can either **Upload a File** (drag-and-drop or browse) or switch to the **From URL** tab to paste a link.
    -   If 'Archival Collection' is selected, add all your files to the staging area.

3.  **Specify Document Type (if applicable):**
    -   If you upload a `.txt` file in Single Source mode, you'll be prompted to specify if it's a **Scientific Publication** or a **Narrative Work** to ensure the most accurate analysis.

4.  **Explore the Interactive Dashboard:**
    -   Once the analysis is complete, a custom dashboard appears. Click timestamps, hover over arguments, filter timelines, and interact with the knowledge graph.

5.  **Manage, Query, and Export:**
    -   Your analysis is automatically saved to the **Archive**. Access it anytime via the header or Command Palette (`Cmd+O`).
    -   Use the integrated **AI Chat** to ask follow-up questions.
    -   Use the **Export** button to download your analysis as a Markdown file.