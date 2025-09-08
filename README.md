# Long-Form Media Deconstructor

[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini-blue.svg)](https://deepmind.google/technologies/gemini/)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB.svg)](https://react.dev/)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)

An advanced, AI-powered progressive web app designed to analyze and deconstruct long-form and complex media. It transforms unstructured content from scientific publications, audio files, videos, images, and entire document archives into structured, queryable knowledge.

This tool acts as a cognitive partner, helping users quickly synthesize information, uncover hidden connections, and interact with their content in a conversational way.

---

## Live Demo on Google AI Studio

You can try the live version of this application directly in your browser, hosted on Google AI Studio.

**[➡️ Launch the Deconstructor App on AI Studio](https://ai.studio/apps/drive/1VBLsQI0BuGruIs4RSbZ9OQppd1sJdcXh)**

**What is AI Studio?**
[Google AI Studio](https://ai.google.dev/aistudio) is a web-based toolkit for developers to discover, prototype, and build with Google's generative AI models. This application is a great example of an "AI Studio App," which allows developers to create and share sophisticated AI-powered tools with a user-friendly interface, backed by the power of the Gemini API.

---

## Why Use The Deconstructor?

-   **Accelerate Research:** Quickly extract the thesis, arguments, and key terms from dense academic papers.
-   **Understand Complex Conversations:** Get timestamped transcripts, thematic breakdowns, and fact-checks from podcasts or interviews.
-   **Analyze Narrative Structures:** Deconstruct the plot, characters, and themes from videos or scripts.
-   **Synthesize Archives:** Uncover hidden connections, timelines, and key entities across a collection of documents.
-   **Enhance Accessibility:** Use advanced accessibility settings like high-contrast mode and font-size adjustments for a comfortable user experience.

---

## Core Features

The Deconstructor provides tailored analysis dashboards for each content type.

### For All Content
-   **Dual Analysis Modes:** Choose **Express** for a fast overview or **Standard** for a deep, comprehensive analysis.
-   **Conversational AI Chat:** Ask follow-up questions about any analysis in natural language.
-   **Flexible Export Options:** Download your results as a formatted Markdown file or raw JSON data.
-   **URL Analysis:** Analyze content directly from URLs, with specialized support for **YouTube**, **TED Talks**, and the **Internet Archive**.

### Analysis-Specific Capabilities
-   **Publication Analysis (`.txt`):** Generates an interactive argument map, a structured summary (thesis, methodology, results), and a key concepts glossary.
-   **Audio Analysis (`.mp3`, `.wav`):** Provides a clickable, speaker-differentiated transcript, thematic segments, sentiment/tone analysis, and (in Standard Mode) AI-powered fact-checking with sources.
-   **Video Analysis (`.mp4`, `.mov`):** Creates an interactive timeline of plot points, summarizes character arcs, and identifies recurring themes with timestamped examples.
-   **Image Analysis (`.jpg`, `.png`):** Produces a rich AI description, a list of identified objects, and extracts any text via OCR.
-   **Archive Analysis (Multiple Files):** Synthesizes a cross-document timeline, identifies and disambiguates key entities, reveals thematic connections, and visualizes relationships in an interactive knowledge graph.

---

## Power-User Features

-   **Persistent Analysis Archive:** Every analysis is automatically saved. Browse, search, edit titles and notes, and delete past results from a dedicated archive page.
-   **Command Palette (`Cmd/Ctrl + K`):** Instantly access any major function—from starting a new analysis to exporting results—with a searchable command menu.
-   **Productivity Shortcuts:** Navigate the app and perform common actions using global keyboard shortcuts (e.g., `Cmd+N` for New Analysis, `Cmd+O` for Open Archive).
-   **Full Data Sync & Backup:** Export your entire application state, including all archived analyses, notes, and settings, to a single JSON file. Import it to another browser or device to restore your workspace.

---

## Technology Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **AI Engine:** Google Gemini API (`@google/genai`), primarily using the `gemini-2.5-flash` model for its powerful multimodal and long-context capabilities.
-   **Graph Visualization:** `react-force-graph-2d`

---

## How to Use

1.  **Choose Scope & Depth:** Select 'Single Source' or 'Archival Collection', and then 'Standard' (deep) or 'Express' (fast).
2.  **Provide Content:** Drag and drop your file(s) or paste a URL.
3.  **Specify Text Type (if needed):** If you upload a `.txt` file, specify if it's a 'Scientific Publication' or a 'Narrative Work' for a tailored analysis.
4.  **Explore the Dashboard:** Interact with the custom dashboard. Click timestamps, hover over arguments, filter timelines, and explore the knowledge graph.
5.  **Manage & Export:** Your analysis is auto-saved to the archive. Use the 'Export' menu or Command Palette to download your results.

---
<br>

---
# Long-Form Media Deconstructor (Deutsch)

[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini-blue.svg)](https://deepmind.google/technologies/gemini/)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB.svg)](https://react.dev/)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)

Eine fortschrittliche, KI-gestützte Progressive Web App zur Analyse und Dekonstruktion von langen und komplexen Medieninhalten. Sie wandelt unstrukturierte Inhalte aus wissenschaftlichen Publikationen, Audiodateien, Videos, Bildern und ganzen Dokumentenarchiven in strukturiertes, abfragbares Wissen um.

Dieses Tool agiert als kognitiver Partner, der Nutzern hilft, Informationen schnell zu synthetisieren, verborgene Zusammenhänge aufzudecken und auf konversationelle Weise mit ihren Inhalten zu interagieren.

---

## Live-Demo im Google AI Studio

Sie können die Live-Version dieser Anwendung direkt in Ihrem Browser ausprobieren, gehostet im Google AI Studio.

**[➡️ Deconstructor-App im AI Studio starten](https://ai.studio/apps/drive/1VBLsQI0BuGruIs4RSbZ9OQppd1sJdcXh)**

**Was ist AI Studio?**
[Google AI Studio](https://ai.google.dev/aistudio) ist ein webbasiertes Toolkit für Entwickler, um die generativen KI-Modelle von Google zu entdecken, Prototypen zu erstellen und damit zu entwickeln. Diese Anwendung ist ein hervorragendes Beispiel für eine "AI Studio App", die es Entwicklern ermöglicht, anspruchsvolle, KI-gestützte Werkzeuge mit einer benutzerfreundlichen Oberfläche zu erstellen und zu teilen, unterstützt durch die Leistungsfähigkeit der Gemini-API.

---
## Warum den Deconstructor verwenden?

-   **Forschung beschleunigen:** Extrahieren Sie schnell die These, Argumente und Schlüsselbegriffe aus dichten wissenschaftlichen Texten.
-   **Komplexe Gespräche verstehen:** Erhalten Sie Transkripte mit Zeitstempeln, thematische Gliederungen und Faktenprüfungen von Podcasts oder Interviews.
-   **Narrative Strukturen analysieren:** Dekonstruieren Sie Handlung, Charaktere und Themen aus Videos oder Drehbüchern.
-   **Archive synthetisieren:** Decken Sie verborgene Zusammenhänge, Zeitlinien und Schlüsselentitäten in einer Sammlung von Dokumenten auf.
-   **Barrierefreiheit verbessern:** Nutzen Sie erweiterte Einstellungen wie den Hochkontrastmodus und die Anpassung der Schriftgröße für ein angenehmes Nutzungserlebnis.
---

## Kernfunktionen

Der Deconstructor bietet maßgeschneiderte Analyse-Dashboards für jeden Inhaltstyp.

### Für alle Inhalte
-   **Zwei Analysemodi:** Wählen Sie **Express** für einen schnellen Überblick oder **Standard** für eine tiefgehende, umfassende Analyse.
-   **Konversationeller KI-Chat:** Stellen Sie Folgefragen zu jeder Analyse in natürlicher Sprache.
-   **Flexible Exportoptionen:** Laden Sie Ihre Ergebnisse als formatierte Markdown-Datei oder als rohe JSON-Daten herunter.
-   **URL-Analyse:** Analysieren Sie Inhalte direkt von URLs, mit spezieller Unterstützung für **YouTube**, **TED Talks** und das **Internet Archive**.

### Analysespezifische Fähigkeiten
-   **Publikationsanalyse (`.txt`):** Erstellt eine interaktive Argumentationskarte, eine strukturierte Zusammenfassung (These, Methodik, Ergebnisse) und ein Glossar der Schlüsselkonzepte.
-   **Audioanalyse (`.mp3`, `.wav`):** Bietet ein klickbares, nach Sprechern differenziertes Transkript, thematische Segmente, eine Stimmungs-/Tonanalyse und (im Standard-Modus) KI-gestützte Faktenprüfung mit Quellen.
-   **Videoanalyse (`.mp4`, `.mov`):** Erstellt eine interaktive Zeitleiste der Handlungspunkte, fasst die Entwicklung der Charaktere zusammen und identifiziert wiederkehrende Themen mit Zeitstempel-Beispielen.
-   **Bildanalyse (`.jpg`, `.png`):** Erzeugt eine reichhaltige KI-Beschreibung, eine Liste identifizierter Objekte und extrahiert jeglichen Text mittels OCR.
-   **Archivanalyse (Mehrere Dateien):** Synthetisiert eine dokumentübergreifende Zeitleiste, identifiziert und disambiguiert Schlüsselentitäten, deckt thematische Verbindungen auf und visualisiert Beziehungen in einem interaktiven Wissensgraphen.

---

## Power-User-Funktionen

-   **Persistentes Analyse-Archiv:** Jede Analyse wird automatisch gespeichert. Durchsuchen, suchen, bearbeiten Sie Titel und Notizen und löschen Sie frühere Ergebnisse auf einer dedizierten Archivseite.
-   **Befehlspalette (`Cmd/Ctrl + K`):** Greifen Sie sofort auf jede wichtige Funktion zu – vom Start einer neuen Analyse bis zum Exportieren von Ergebnissen – mit einem durchsuchbaren Befehlsmenü.
-   **Produktivitäts-Tastenkürzel:** Navigieren Sie durch die App und führen Sie allgemeine Aktionen mit globalen Tastenkürzeln aus (z. B. `Cmd+N` für Neue Analyse, `Cmd+O` zum Öffnen des Archivs).
-   **Vollständige Datensynchronisierung & -sicherung:** Exportieren Sie Ihren gesamten Anwendungsstatus, einschließlich aller archivierten Analysen, Notizen und Einstellungen, in eine einzige JSON-Datei. Importieren Sie sie in einen anderen Browser oder auf ein anderes Gerät, um Ihren Arbeitsbereich wiederherzustellen.
---

## Technologie-Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **KI-Engine:** Google Gemini API (`@google/genai`), hauptsächlich unter Verwendung des `gemini-2.5-flash`-Modells wegen seiner leistungsstarken multimodalen und langen Kontextfähigkeiten.
-   **Graph-Visualisierung:** `react-force-graph-2d`

---

## Anleitung

1.  **Umfang & Tiefe wählen:** Wählen Sie 'Einzelquelle' oder 'Archivsammlung' und dann 'Standard' (tiefgehend) oder 'Express' (schnell).
2.  **Inhalt bereitstellen:** Ziehen Sie Ihre Datei(en) per Drag-and-Drop oder fügen Sie bei einer Einzelquelle eine URL ein.
3.  **Texttyp angeben (falls erforderlich):** Wenn Sie eine `.txt`-Datei hochladen, geben Sie an, ob es sich um eine 'Wissenschaftliche Publikation' oder ein 'Narratives Werk' handelt, um eine maßgeschneiderte Analyse zu gewährleisten.
4.  **Dashboard erkunden:** Interagieren Sie mit dem benutzerdefinierten Dashboard. Klicken Sie auf Zeitstempel, fahren Sie mit der Maus über Argumente, filtern Sie Zeitlinien und erkunden Sie den Wissensgraphen.
5.  **Verwalten & Exportieren:** Ihre Analyse wird automatisch im Archiv gespeichert. Verwenden Sie das 'Exportieren'-Menü oder die Befehlspalette, um Ihre Ergebnisse herunterzuladen.