

import React, { useState, useEffect, useMemo } from 'react';
import type { ArchiveAnalysisResult, Entity } from '../types';
import { TimelineIcon, EntityIcon, ConnectionIcon, GraphIcon, ChatIcon, NotesIcon } from './IconComponents';
import { KnowledgeGraph } from './KnowledgeGraph';
import { ChatInterface } from './ChatInterface';
import { DashboardHeader } from './DashboardHeader';
import { useAppContext } from './AppContext';

interface ArchiveAnalysisDashboardProps {
  result: ArchiveAnalysisResult;
  projectTitle: string;
  fileNames: string[];
}

type Tab = 'timeline' | 'entities' | 'connections' | 'graph';
type SidebarView = 'notes' | 'chat';

const TabButton: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-3 px-4 py-2 rounded-t-lg border-b-2 transition-colors duration-300 ${isActive ? 'border-brand-primary text-brand-primary bg-white/10 dark:bg-slate-800/50' : 'border-transparent text-slate-500 dark:text-slate-400 hover:bg-white/5 dark:hover:bg-slate-800/30'}`}>
        {icon}
        <span className="font-semibold">{label}</span>
    </button>
);

export const ArchiveAnalysisDashboard: React.FC<ArchiveAnalysisDashboardProps> = ({ result, projectTitle, fileNames }) => {
    const { resetAnalysis } = useAppContext();
    const [activeTab, setActiveTab] = useState<Tab>('timeline');
    const [sidebarView, setSidebarView] = useState<SidebarView>('notes');
    const [notes, setNotes] = useState('');
    const [timelineSearch, setTimelineSearch] = useState('');
    const [entitySearch, setEntitySearch] = useState('');
    const [hoveredFile, setHoveredFile] = useState<string | null>(null);
    const chatContext = JSON.stringify(result, null, 2);

    const storageKey = useMemo(() => `archive-notes-${fileNames.sort().join('|')}`, [fileNames]);

    useEffect(() => {
        const savedNotes = localStorage.getItem(storageKey);
        if (savedNotes) {
            setNotes(savedNotes);
        }
    }, [storageKey]);

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
        localStorage.setItem(storageKey, e.target.value);
    };

    const filteredTimeline = useMemo(() => result.timeline
        .filter(item => 
            item.event.toLowerCase().includes(timelineSearch.toLowerCase()) || 
            item.description.toLowerCase().includes(timelineSearch.toLowerCase())
        )
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        [result.timeline, timelineSearch]
    );

    const filteredEntities = useMemo(() => result.entities
        .filter(entity => entity.name.toLowerCase().includes(entitySearch.toLowerCase())),
        [result.entities, entitySearch]
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'timeline':
                return (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-slate-300/20 dark:border-slate-700/50 flex-shrink-0">
                             <input type="text" placeholder="Search timeline..." value={timelineSearch} onChange={e => setTimelineSearch(e.target.value)} className="w-full bg-white/10 dark:bg-slate-900/30 border border-slate-300/50 dark:border-slate-600/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"/>
                        </div>
                        <div className="flex-grow overflow-y-auto p-4 space-y-4">
                            {filteredTimeline.map((item, index) => (
                                <div 
                                    key={index}
                                    className="flex items-start gap-4"
                                    onMouseEnter={() => setHoveredFile(item.sourceDocument)}
                                    onMouseLeave={() => setHoveredFile(null)}
                                >
                                    <div className="flex flex-col items-center h-full">
                                        <div className="w-4 h-4 rounded-full bg-brand-primary mt-1 flex-shrink-0"></div>
                                        <div className="w-0.5 grow bg-slate-400/50 dark:bg-slate-700/50"></div>
                                    </div>
                                    <div className="pb-8 flex-1">
                                        <p className="font-bold text-slate-800 dark:text-slate-100">{item.date}: <span className="font-semibold text-sky-600 dark:text-sky-300">{item.event}</span></p>
                                        <p className="text-slate-600 dark:text-slate-300 mt-1">{item.description}</p>
                                        <p className="text-xs text-slate-500 mt-2">Source: {item.sourceDocument}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'entities':
                const [selectedEntity, setSelectedEntity] = useState<Entity | null>(filteredEntities[0] || null);
                useEffect(() => {
                    if (!selectedEntity || !filteredEntities.find(e => e.name === selectedEntity.name)) {
                        setSelectedEntity(filteredEntities[0] || null);
                    }
                }, [filteredEntities, selectedEntity]);

                return (
                     <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-slate-300/20 dark:border-slate-700/50 flex-shrink-0">
                             <input type="text" placeholder="Search entities..." value={entitySearch} onChange={e => setEntitySearch(e.target.value)} className="w-full bg-white/10 dark:bg-slate-900/30 border border-slate-300/50 dark:border-slate-600/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 flex-grow overflow-hidden">
                            <div className="md:col-span-1 h-full overflow-y-auto pr-2">
                                <ul className="space-y-2">
                                    {filteredEntities.map((entity, index) => (
                                        <li key={index}>
                                            <button onClick={() => setSelectedEntity(entity)} className={`w-full text-left p-3 rounded-lg transition-colors ${selectedEntity?.name === entity.name ? 'bg-brand-primary text-white shadow-lg' : 'bg-white/20 dark:bg-slate-800/50 hover:bg-white/30 dark:hover:bg-slate-700/50'}`}>
                                                <p className="font-semibold">{entity.name}</p>
                                                <p className="text-xs opacity-80">{entity.type} ({entity.mentions.length} mentions)</p>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="md:col-span-2 bg-white/10 dark:bg-slate-900/20 p-4 rounded-lg h-full overflow-y-auto ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                                {selectedEntity ? (
                                    <div>
                                        <h4 className="text-xl font-bold text-sky-600 dark:text-sky-300 mb-4">{selectedEntity.name}</h4>
                                        <ul className="space-y-4 pr-2">
                                            {selectedEntity.mentions.map((mention, i) => (
                                                <li 
                                                    key={i} 
                                                    className="border-l-4 border-slate-400/50 dark:border-slate-600/50 pl-4"
                                                    onMouseEnter={() => setHoveredFile(mention.document)}
                                                    onMouseLeave={() => setHoveredFile(null)}
                                                >
                                                    <p className="text-slate-700 dark:text-slate-300">"{mention.context}"</p>
                                                    <p className="text-xs text-slate-500 mt-1">Source: {mention.document}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : <p className="text-slate-500 dark:text-slate-400 text-center pt-16">Select an entity to see its mentions.</p>}
                            </div>
                        </div>
                    </div>
                );
            case 'connections':
                return (
                    <div className="space-y-6 h-full overflow-y-auto p-4">
                        {result.connections.map((conn, index) => (
                            <div key={index} className="bg-white/10 dark:bg-slate-800/50 p-4 rounded-lg ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                                <h4 className="text-xl font-bold text-sky-600 dark:text-sky-300">{conn.theme}</h4>
                                <p className="text-slate-600 dark:text-slate-300 my-2">{conn.description}</p>
                                <div className="mt-3 space-y-2">
                                    {conn.connectingDocuments.map((doc, i) => (
                                        <div 
                                            key={i} 
                                            className="border-l-4 border-slate-400/50 dark:border-slate-600/50 pl-4 text-sm"
                                            onMouseEnter={() => setHoveredFile(doc.document)}
                                            onMouseLeave={() => setHoveredFile(null)}
                                        >
                                            <p className="text-slate-700 dark:text-slate-300">"{doc.context}"</p>
                                            <p className="text-xs text-slate-500 mt-1">Source: {doc.document}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'graph':
                return <KnowledgeGraph entities={result.entities} connections={result.connections} />;
        }
    };
    
    return (
        <div className="w-full animate-fade-in max-w-7xl">
            <DashboardHeader
                fileName={projectTitle}
                analysisType="archive"
                onReset={resetAnalysis}
                analysisResult={result}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
                <main className="lg:col-span-4">
                     <div className="border-b border-slate-300/20 dark:border-slate-700/50">
                        <nav className="flex items-center gap-2 -mb-px flex-wrap">
                            <TabButton icon={<TimelineIcon />} label="Timeline" isActive={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} />
                            <TabButton icon={<EntityIcon />} label="Entities" isActive={activeTab === 'entities'} onClick={() => setActiveTab('entities')} />
                            <TabButton icon={<ConnectionIcon />} label="Connections" isActive={activeTab === 'connections'} onClick={() => setActiveTab('connections')} />
                            <TabButton icon={<GraphIcon />} label="Knowledge Graph" isActive={activeTab === 'graph'} onClick={() => setActiveTab('graph')} />
                        </nav>
                    </div>
                    <div className="bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-t-0 border-white/20 dark:border-slate-700/40 rounded-b-lg min-h-[70vh] w-full h-[70vh] overflow-hidden ring-1 ring-inset ring-white/10 dark:ring-slate-700/50">
                        {renderTabContent()}
                    </div>
                </main>
                <aside className="lg:col-span-1 flex flex-col">
                     <div className="flex-shrink-0">
                         <div className="flex p-1 bg-white/10 dark:bg-slate-900/30 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-lg mb-2">
                            <button onClick={() => setSidebarView('notes')} className={`w-1/2 flex items-center justify-center gap-2 text-sm p-2 rounded-md transition-colors ${sidebarView === 'notes' ? 'bg-brand-secondary text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/50'}`}>
                                <NotesIcon /> Notes
                            </button>
                            <button onClick={() => setSidebarView('chat')} className={`w-1/2 flex items-center justify-center gap-2 text-sm p-2 rounded-md transition-colors ${sidebarView === 'chat' ? 'bg-brand-secondary text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-white/20 dark:hover:bg-slate-700/50'}`}>
                                <ChatIcon /> Chat
                            </button>
                         </div>
                    </div>

                    <div className="flex-grow min-h-0">
                        {sidebarView === 'notes' ? (
                            <div className="h-full flex flex-col gap-4">
                                <textarea value={notes} onChange={handleNotesChange} placeholder="Add your notes and observations here... Your notes will be saved in this browser." className="w-full flex-grow bg-white/10 dark:bg-slate-900/20 backdrop-blur-md border border-white/20 dark:border-slate-700/50 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder:text-slate-500 dark:placeholder:text-slate-400"></textarea>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Files in Archive</h3>
                                    <ul className="space-y-1 text-sm text-slate-500 dark:text-slate-400 max-h-48 overflow-y-auto">
                                        {fileNames.map(name => (
                                            <li key={name} className={`truncate p-1 rounded transition-colors ${hoveredFile === name ? 'bg-brand-primary/20 text-slate-800 dark:text-slate-200' : ''}`}>
                                                - {name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full w-full">
                                <ChatInterface documentContext={chatContext} contextType="analysis" />
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};