import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { Entity, ThematicConnection } from '../types';

interface KnowledgeGraphProps {
  entities: Entity[];
  connections: ThematicConnection[];
}

interface NodeObject {
    id: string;
    name: string;
    type: string;
    val: number;
}

interface LinkObject {
    source: string;
    target: string;
}

const entityTypeColors: { [key: string]: string } = {
    'Person': '#0ea5e9', // sky-500
    'Organization': '#10b981', // emerald-500
    'Location': '#f97316', // orange-500
    'default': '#64748b' // slate-500
};

export const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ entities, connections }) => {
    const graphRef = useRef<any>(null);
    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [hoverNode, setHoverNode] = useState<NodeObject | null>(null);

    useEffect(() => {
        if (graphRef.current) {
            graphRef.current.zoomToFit(400, 100);
        }
    }, [entities]);

    const graphData = useMemo(() => {
        const nodes: NodeObject[] = entities.map(e => ({
            id: e.name,
            name: e.name,
            type: e.type,
            val: Math.log(e.mentions.length + 1) * 3 + 2,
        }));

        const links: LinkObject[] = [];
        const linkSet = new Set<string>();

        const docToEntities: { [key: string]: string[] } = {};
        entities.forEach(entity => {
            entity.mentions.forEach(mention => {
                if (!docToEntities[mention.document]) {
                    docToEntities[mention.document] = [];
                }
                docToEntities[mention.document].push(entity.name);
            });
        });

        connections.forEach(connection => {
            const connectedDocs = connection.connectingDocuments.map(cd => cd.document);
            connectedDocs.forEach(doc => {
                const entitiesInDoc = docToEntities[doc] || [];
                if (entitiesInDoc.length > 1) {
                    for (let i = 0; i < entitiesInDoc.length; i++) {
                        for (let j = i + 1; j < entitiesInDoc.length; j++) {
                            const source = entitiesInDoc[i];
                            const target = entitiesInDoc[j];
                            const linkKey1 = `${source}->${target}`;
                            const linkKey2 = `${target}->${source}`;

                            if (!linkSet.has(linkKey1) && !linkSet.has(linkKey2)) {
                                links.push({ source, target });
                                linkSet.add(linkKey1);
                            }
                        }
                    }
                }
            });
        });

        return { nodes, links };
    }, [entities, connections]);

    const handleNodeHover = (node: NodeObject | null) => {
        setHoverNode(node);
    };

    const handleNodeClick = useCallback((node: NodeObject) => {
        const newHighlightNodes = new Set();
        const newHighlightLinks = new Set();
        if (node) {
            newHighlightNodes.add(node);
            graphData.links.forEach(link => {
                if (link.source === node.id || link.target === node.id) {
                    newHighlightLinks.add(link);
                    newHighlightNodes.add(link.source === node.id ? link.target : link.source);
                }
            });
        }
        setHighlightNodes(newHighlightNodes);
        setHighlightLinks(newHighlightLinks);
    }, [graphData.links]);


    if (graphData.nodes.length === 0) {
        return <div className="flex items-center justify-center h-full text-slate-400">No entities found to build knowledge graph.</div>;
    }

    return (
        <div className="w-full h-full bg-slate-900 rounded-lg relative">
            <div className="absolute top-2 left-2 z-10 bg-slate-800/70 p-2 rounded-md text-xs">
                <h4 className="font-bold mb-1 text-slate-200">Legend</h4>
                {Object.entries(entityTypeColors).filter(([key]) => key !== 'default').map(([type, color]) => (
                    <div key={type} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                        <span className="text-slate-300">{type}</span>
                    </div>
                ))}
            </div>
            <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                nodeLabel="name"
                nodeVal="val"
                onNodeClick={handleNodeClick as any}
                onNodeHover={handleNodeHover as any}
                linkColor={(link: any) => highlightLinks.has(link) ? 'rgba(255, 255, 255, 0.8)' : 'rgba(100, 116, 139, 0.3)'}
                linkWidth={(link: any) => highlightLinks.has(link) ? 2 : 1}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = (node as NodeObject).name;
                    const color = entityTypeColors[(node as NodeObject).type] || entityTypeColors.default;
                    const isHighlighted = highlightNodes.size === 0 || highlightNodes.has(node);

                    ctx.globalAlpha = isHighlighted ? 1 : 0.3;
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(node.x!, node.y!, (node.val || 1) as number, 0, 2 * Math.PI, false);
                    ctx.fill();

                    if (hoverNode === node || highlightNodes.has(node)) {
                        const fontSize = 12 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = '#f1f5f9'; // slate-100
                        ctx.fillText(label, node.x!, node.y! + (node.val || 1) + 8);
                    }
                     ctx.globalAlpha = 1;
                }}
                backgroundColor="transparent"
            />
        </div>
    );
};
