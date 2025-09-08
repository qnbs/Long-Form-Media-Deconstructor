

import React, { useState } from 'react';
import { BackIcon, ChevronDownIcon } from './IconComponents';

interface HelpCenterProps {
    onBack: () => void;
}

type Tab = 'tutorial' | 'troubleshooting' | 'faq' | 'glossary' | 'about';

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button onClick={onClick} className={`px-4 py-3 text-sm sm:text-base font-semibold border-b-2 transition-colors duration-200 ${isActive ? 'border-brand-primary text-brand-primary' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
        {label}
    </button>
);

const TutorialStep: React.FC<{ number: number; title: string; illustration: React.ReactNode; children: React.ReactNode }> = ({ number, title, illustration, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-6 border-b border-slate-300/20 dark:border-slate-700/50">
        <div className="flex flex-col items-center justify-center bg-white/10 dark:bg-slate-900/20 backdrop-blur-md p-6 rounded-lg h-full ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
            {illustration}
        </div>
        <div>
            <h3 className="text-xl font-bold text-sky-600 dark:text-sky-300 mb-3"><span className="text-slate-400 dark:text-slate-500 font-mono text-lg">{number}.</span> {title}</h3>
            <div className="space-y-2 text-slate-600 dark:text-slate-300">
                {children}
            </div>
        </div>
    </div>
);

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-300/20 dark:border-slate-700/50">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left py-4 px-2 hover:bg-white/10 dark:hover:bg-slate-800/30 rounded-md">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{question}</span>
                 <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><ChevronDownIcon /></div>
            </button>
             <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="p-4 bg-white/5 dark:bg-slate-900/20 text-slate-600 dark:text-slate-300 rounded-b-md">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const HelpCenter: React.FC<HelpCenterProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<Tab>('tutorial');
    
    const renderContent = () => {
        switch (activeTab) {
            case 'tutorial':
                return (
                    <div className="animate-fade-in">
                        <TutorialStep number={1} title="Choose Scope & Depth" illustration={
                             <div className="w-64 h-48 bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/50 rounded-lg p-4 flex flex-col justify-center items-center text-slate-800 dark:text-slate-200 space-y-4">
                                <div className="flex bg-slate-200 dark:bg-slate-800 rounded-full p-1 w-full max-w-xs">
                                    <div className="w-1/2 bg-brand-primary text-white text-sm rounded-full py-1">Single Source</div>
                                    <div className="w-1/2 text-slate-500 dark:text-slate-400 text-sm py-1">Archival</div>
                                </div>
                                <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 w-full max-w-xs">
                                    <div className="w-1/2 bg-brand-primary text-white text-xs rounded-md p-2">Standard<span className="block opacity-80 font-normal">In-depth</span></div>
                                    <div className="w-1/2 text-slate-500 dark:text-slate-400 text-xs rounded-md p-2">Express<span className="block opacity-80 font-normal">Faster</span></div>
                                </div>
                            </div>
                        }>
                            <p>First, decide on your project's scope and the desired level of detail:</p>
                            <ul className="list-disc list-inside ml-4">
                                <li><strong>Single Source vs. Archival:</strong> Choose 'Single' for one file/URL or 'Archival' to find connections across multiple files.</li>
                                <li><strong>Standard vs. Express:</strong> 'Standard' provides a deep, comprehensive analysis (including fact-checking), while 'Express' offers a faster, high-level overview.</li>
                            </ul>
                        </TutorialStep>
                        
                        <TutorialStep number={2} title="Provide Your Content" illustration={
                             <div className="w-64 h-48 bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/50 rounded-lg p-4 flex flex-col justify-around items-center">
                                <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1 w-full max-w-xs">
                                    <div className="w-1/2 bg-brand-secondary text-white text-sm rounded-md py-1">Upload File</div>
                                    <div className="w-1/2 text-slate-500 dark:text-slate-400 text-sm py-1">From URL</div>
                                </div>
                                <div className="w-full p-4 border-2 border-dashed border-slate-400 dark:border-slate-600 rounded-xl text-center">
                                    <p className="text-sm font-semibold">Drag, Paste, or Click</p>
                                </div>
                             </div>
                        }>
                            <p>You can provide content in multiple ways:</p>
                             <ul className="list-disc list-inside ml-4">
                                <li><strong>Upload File:</strong> Drag-and-drop, paste, or browse for text, audio, video, or image files.</li>
                                <li><strong>From URL:</strong> In Single Source mode, switch to the URL tab to paste a link to an article, YouTube video, TED Talk, or Internet Archive page.</li>
                            </ul>
                        </TutorialStep>

                        <TutorialStep number={3} title="Explore the Dashboard" illustration={
                             <div className="w-64 h-48 bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/50 rounded-lg p-4 flex flex-col justify-start items-center">
                                 <div className="w-full bg-slate-200 dark:bg-slate-800 h-4 rounded-sm flex justify-between items-center px-1"><div className="w-10 h-2 bg-slate-400 dark:bg-slate-600 rounded-sm"></div><div className="w-16 h-2 bg-brand-primary rounded-sm"></div></div>
                                 <div className="w-full flex gap-2 mt-2">
                                     <div className="w-1/3 h-20 bg-slate-200 dark:bg-slate-700 rounded-md p-1 space-y-1">
                                        <div className="w-full h-2 bg-slate-400 dark:bg-slate-600 rounded-sm"></div>
                                        <div className="w-full h-2 bg-slate-400 dark:bg-slate-600 rounded-sm"></div>
                                        <div className="w-2/3 h-2 bg-slate-400 dark:bg-slate-600 rounded-sm"></div>
                                     </div>
                                     <div className="w-2/3 h-20 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                                 </div>
                             </div>
                        }>
                            <p>Your results are presented in a dynamic dashboard tailored to your content. Interact with the elements, use the built-in media players, filter timelines, and use the AI chat to ask follow-up questions.</p>
                        </TutorialStep>
                        
                        <TutorialStep number={4} title="Manage Your Archive" illustration={
                             <div className="w-64 h-48 bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/50 rounded-lg p-4 flex flex-col justify-center items-center">
                                 <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-md p-2 shadow-md">
                                    <p className="font-bold text-sm">My Analysis Title</p>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                        <p>- [x] Review key findings</p>
                                        <p>- [ ] Draft summary</p>
                                    </div>
                                 </div>
                                 <p className="text-xs text-slate-500 mt-4">Every analysis is automatically saved.</p>
                             </div>
                        }>
                            <p>Every analysis you run is automatically saved to the **Analysis Archive**.</p>
                             <ul className="list-disc list-inside ml-4">
                                 <li>Access it via the archive icon in the header or Command Palette (`Cmd+O`).</li>
                                 <li>Search and filter your past work.</li>
                                 <li>Click "Edit" to give your analysis a custom title and add notes using Markdown, including task lists (`- [ ] Task`).</li>
                             </ul>
                        </TutorialStep>
                        
                         <TutorialStep number={5} title="Use Power Tools" illustration={
                             <div className="w-64 h-48 bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/50 rounded-lg p-4 flex flex-col justify-center items-center text-slate-800 dark:text-slate-200">
                                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-md p-2 shadow-md text-center">
                                    <p className="text-sm font-semibold">Command Palette</p>
                                    <p className="text-xs text-slate-500">Cmd/Ctrl + K</p>
                                </div>
                             </div>
                        }>
                            <p>Speed up your workflow with advanced features:</p>
                             <ul className="list-disc list-inside ml-4">
                                 <li>**Command Palette:** Press `Cmd/Ctrl + K` to open a searchable menu of every action in the app.</li>
                                 <li>**Keyboard Shortcuts:** Use shortcuts like `Cmd+N` (New) and `Cmd+O` (Archive) for instant navigation.</li>
                             </ul>
                        </TutorialStep>
                        
                         <TutorialStep number={6} title="Sync & Backup" illustration={
                             <div className="w-64 h-48 bg-white/20 dark:bg-slate-900/50 border border-white/30 dark:border-slate-700/50 rounded-lg p-4 flex flex-col justify-center items-center text-slate-800 dark:text-slate-200">
                                 <div className="w-full flex gap-2">
                                     <button className="w-1/2 bg-sky-600 text-white text-xs rounded-md p-2">Export Data</button>
                                     <button className="w-1/2 bg-emerald-600 text-white text-xs rounded-md p-2">Import Data</button>
                                 </div>
                                 <p className="text-xs text-slate-500 mt-4">Take your data with you.</p>
                             </div>
                        }>
                            <p>Go to **Settings → Sync & Backup** to manage your data.</p>
                             <ul className="list-disc list-inside ml-4">
                                 <li>**Export All Data:** Download a single JSON file containing all your archived analyses, notes, and settings.</li>
                                 <li>**Import from Backup:** Restore your entire workspace on a new browser or device.</li>
                             </ul>
                        </TutorialStep>
                    </div>
                );
            case 'troubleshooting':
                return (
                    <div className="animate-fade-in space-y-2">
                        <FaqItem question="URL analysis failed or returned no content. Why?">
                            <p>This is often caused by **CORS (Cross-Origin Resource Sharing)** restrictions. Many websites block scripts from other domains (like this app) from fetching their content directly. This is a security feature of the web and cannot be bypassed from the user's side.</p>
                            <ul className="list-disc list-inside ml-4 mt-2">
                                <li>**Solution:** If possible, save the article's content to a `.txt` file and upload it directly. The app has specialized agents for YouTube, TED, and Internet Archive, which are more reliable.</li>
                            </ul>
                        </FaqItem>
                        <FaqItem question="Analysis is very slow or fails for a large file.">
                             <p>Analyzing large media files (especially long videos or large archives) is computationally intensive and can take several minutes.</p>
                             <ul className="list-disc list-inside ml-4 mt-2">
                                <li>**Use 'Express' Mode:** For a quicker initial pass, use the 'Express' analysis depth, which uses a more streamlined AI pipeline.</li>
                                 <li>**Check Connection:** A stable internet connection is crucial, as the file needs to be uploaded for analysis.</li>
                                 <li>**Context Limits:** Very large files or archives may exceed the AI model's context window, which can lead to errors. If this happens, try analyzing a smaller subset of the content.</li>
                            </ul>
                        </FaqItem>
                         <FaqItem question="My saved analyses in the Archive disappeared!">
                            <p>The Analysis Archive and your settings are stored in your browser's **Local Storage**. This data can be cleared under certain circumstances:</p>
                             <ul className="list-disc list-inside ml-4 mt-2">
                                <li>**Private/Incognito Mode:** Browsing in this mode will clear all data when you close the window.</li>
                                 <li>**Browser Settings:** Your browser might be configured to clear site data automatically on exit.</li>
                                 <li>**Manual Clearing:** Manually clearing your browser's cache or site data will remove the archive.</li>
                            </ul>
                             <p className="mt-2">**Solution:** To prevent data loss, regularly use the **Sync & Backup** feature in Settings to export your archive to a file you can save externally.</p>
                        </FaqItem>
                         <FaqItem question="The AI's analysis seems incorrect or incomplete.">
                            <p>Generative AI is a powerful tool, but it's not perfect. Results can sometimes contain inaccuracies or miss nuances.</p>
                             <ul className="list-disc list-inside ml-4 mt-2">
                                <li>**Use Standard Mode:** 'Standard' mode uses a more complex process and is generally more accurate than 'Express' mode.</li>
                                 <li>**Consult Source Material:** Always treat the AI analysis as a first-pass guide and refer back to the original content for critical details.</li>
                                 <li>**Refine Chat Queries:** If the AI chat isn't giving you the answer you want, try rephrasing your question to be more specific.</li>
                            </ul>
                        </FaqItem>
                    </div>
                );
            case 'faq':
                return (
                    <div className="animate-fade-in space-y-2">
                        <FaqItem question="What is the Analysis Archive?">
                            <p>Every analysis you successfully complete is automatically saved in your browser. The **Analysis Archive** is the central hub where you can view, search, and manage all your past work. You can also edit the title and add your own notes (in Markdown) to any saved item, turning the app into a personal knowledge base.</p>
                        </FaqItem>
                        <FaqItem question="What is the Command Palette?">
                            <p>The Command Palette is a productivity feature for power users. Press `Cmd/Ctrl + K` anywhere in the app to open a searchable menu of all available actions. You can start a new analysis, open the archive, go to settings, or even export your current dashboard—all without taking your hands off the keyboard.</p>
                        </FaqItem>
                         <FaqItem question="What's the difference between Standard and Express mode?">
                            <p>It's a trade-off between depth, speed, and cost.</p>
                             <ul className="list-disc list-inside ml-4 mt-2">
                                <li><strong>Standard Mode</strong> uses a more comprehensive analysis pipeline. For example, in audio analysis, it performs transcription, deeper analysis of themes and sentiment, and also extracts and verifies factual claims using Google Search. This provides the richest output but takes more time.</li>
                                <li><strong>Express Mode</strong> uses a streamlined pipeline for faster results. For audio analysis, it will transcribe and perform the deeper analysis but will skip the claim extraction and fact-checking steps. This is useful for getting a quick overview of your content.</li>
                            </ul>
                        </FaqItem>
                        <FaqItem question="How does the Sync & Backup feature work?">
                            <p>This feature, found in the Settings page, gives you full control over your data. 'Export All Data' bundles your entire archive, notes, and personal settings into a single JSON file that you can download. 'Import from Backup' allows you to select one of these files to completely restore your workspace on a different browser or computer. **Warning:** Importing will overwrite any existing data in the browser.</p>
                        </FaqItem>
                         <FaqItem question="Is my data private and secure?">
                            <p>Your privacy is a priority. Here's how your data is handled:</p>
                             <ul className="list-disc list-inside ml-4 mt-2">
                                <li>Uploaded files are sent directly to the secure Google Gemini API for processing and are handled according to Google's privacy policy. They are not stored on any intermediate servers.</li>
                                <li>The **Analysis Archive**, **Notes**, and **Settings** are saved **locally** to your browser's storage only. This data is never transmitted anywhere and remains on your device.</li>
                             </ul>
                        </FaqItem>
                    </div>
                );
            case 'glossary':
                return (
                    <div className="animate-fade-in space-y-6">
                        <dl className="space-y-6 text-slate-800 dark:text-slate-200">
                             <div>
                                <dt className="text-lg font-semibold text-sky-600 dark:text-sky-300">CORS (Cross-Origin Resource Sharing)</dt>
                                <dd className="mt-1 text-slate-600 dark:text-slate-300 pl-4 border-l-2 border-slate-400/50 dark:border-slate-600/50">A browser security feature that restricts web pages from making requests to a different domain than the one that served the page. This is why the URL analysis feature may not work on all websites.</dd>
                            </div>
                             <div>
                                <dt className="text-lg font-semibold text-sky-600 dark:text-sky-300">Diarization (Speaker Diarization)</dt>
                                <dd className="mt-1 text-slate-600 dark:text-slate-300 pl-4 border-l-2 border-slate-400/50 dark:border-slate-600/50">The process of partitioning an audio stream into segments according to speaker identity. It answers the question "who spoke when?" and is used to generate the interactive transcript.</dd>
                            </div>
                            <div>
                                <dt className="text-lg font-semibold text-sky-600 dark:text-sky-300">Knowledge Graph</dt>
                                <dd className="mt-1 text-slate-600 dark:text-slate-300 pl-4 border-l-2 border-slate-400/50 dark:border-slate-600/50">A visual, node-based representation of the relationships between entities in an archive. It helps to quickly see which people, places, and organizations are connected and co-occur in documents.</dd>
                            </div>
                             <div>
                                <dt className="text-lg font-semibold text-sky-600 dark:text-sky-300">Markdown</dt>
                                <dd className="mt-1 text-slate-600 dark:text-slate-300 pl-4 border-l-2 border-slate-400/50 dark:border-slate-600/50">A lightweight markup language for creating formatted text. It's supported in the Archive notes, allowing for headers, lists, bold text, and task lists (e.g., `- [ ] My Task`).</dd>
                            </div>
                             <div>
                                <dt className="text-lg font-semibold text-sky-600 dark:text-sky-300">Multimodal AI</dt>
                                <dd className="mt-1 text-slate-600 dark:text-slate-300 pl-4 border-l-2 border-slate-400/50 dark:border-slate-600/50">An AI model, like Gemini, that can understand and process information from multiple types of data (modalities) simultaneously, such as text, images, audio, and video.</dd>
                            </div>
                        </dl>
                    </div>
                );
            case 'about':
                return (
                    <div className="animate-fade-in space-y-8 text-slate-600 dark:text-slate-300">
                        <section>
                            <h3 className="text-lg font-semibold text-sky-600 dark:text-sky-300 mb-2">Project Mission</h3>
                            <p>The Long-Form Media Deconstructor aims to be an advanced cognitive partner for knowledge workers, researchers, students, and anyone looking to quickly understand complex content. By leveraging cutting-edge AI, it transforms dense, unstructured information into clear, structured, and interactive knowledge, making deep insights more accessible and saving valuable time.</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-sky-600 dark:text-sky-300 mb-2">Core Technology</h3>
                            <p>This application is powered by Google's Gemini family of models. It primarily utilizes the <code className="bg-slate-300 dark:bg-slate-700 text-sm px-1 rounded">gemini-2.5-flash</code> model, which is optimized for speed, long-context understanding, and powerful multimodal capabilities—allowing it to process text, audio, images, and video seamlessly. The application employs a multi-agent architecture where specialized AI prompts tackle different tasks like transcription, visual analysis, or argument synthesis to produce high-quality, structured results.</p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-sky-600 dark:text-sky-300 mb-2">Powered by Google AI Studio</h3>
                             <p>This app is proudly built and shared using <a href="https://ai.google.dev/aistudio" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Google AI Studio</a>, a web-based toolkit for developers to prototype and build with generative AI. AI Studio enables the creation and sharing of sophisticated applications like this one, providing a user-friendly interface backed by the power of the Gemini API.</p>
                             <p className="mt-4">You can try the live version of this application on AI Studio: <a href="https://ai.studio/apps/drive/1W5qD7J9NrNLMOcaXG9-FS5bs9s7etgTH" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Launch the Deconstructor App</a>.</p>
                        </section>

                        <section>
                             <h3 className="text-lg font-semibold text-sky-600 dark:text-sky-300 mb-2">Disclaimer</h3>
                             <p>The analysis provided by the AI is generated based on patterns in data and may not always be perfectly accurate or complete. While it serves as a powerful tool for synthesis and exploration, it is recommended to verify any critical information against the source material.</p>
                        </section>
                    </div>
                );
        }
    }

    return (
        <div className="w-full animate-fade-in">
            <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors duration-300 mb-2"
                    >
                        <BackIcon />
                        Back to App
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Help Center</h1>
                </div>
            </header>
            <div className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-lg rounded-xl p-4 sm:p-6 lg:p-8 ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                <nav className="border-b border-slate-300/20 dark:border-slate-700/50 mb-6">
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                        <TabButton label="Step-by-Step Tutorial" isActive={activeTab === 'tutorial'} onClick={() => setActiveTab('tutorial')} />
                         <TabButton label="Troubleshooting" isActive={activeTab === 'troubleshooting'} onClick={() => setActiveTab('troubleshooting')} />
                        <TabButton label="FAQ" isActive={activeTab === 'faq'} onClick={() => setActiveTab('faq')} />
                        <TabButton label="Glossary" isActive={activeTab === 'glossary'} onClick={() => setActiveTab('glossary')} />
                        <TabButton label="About the App" isActive={activeTab === 'about'} onClick={() => setActiveTab('about')} />
                    </div>
                </nav>
                <div className="max-h-[70vh] overflow-y-auto pr-4">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};