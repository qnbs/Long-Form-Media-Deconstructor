import type { AnalysisResult, PublicationAnalysisResult, NarrativeAnalysisResult, AudioAnalysisResult, VideoNarrativeAnalysisResult, ArchiveAnalysisResult, ImageAnalysisResult } from '../types';

function downloadFile(content: string, fileName: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportPublicationMarkdown(data: PublicationAnalysisResult): string {
    let md = `## Summary\n\n`;
    md += `### Thesis\n${data.summary.thesis}\n\n`;
    md += `### Methodology\n${data.summary.methodology}\n\n`;
    md += `### Results\n${data.summary.results}\n\n`;
    
    md += `## Argument Map\n\n`;
    md += `**Main Thesis:** ${data.argumentMap.mainThesis}\n\n`;
    data.argumentMap.primaryArguments.forEach(arg => {
        md += `### Argument: ${arg.point}\n`;
        md += `**Supporting Evidence:**\n`;
        arg.supportingEvidence.forEach(ev => md += `- ${ev}\n`);
        if (arg.counterArguments && arg.counterArguments.length > 0) {
            md += `\n**Counter Arguments:**\n`;
            arg.counterArguments.forEach(ca => md += `- ${ca}\n`);
        }
        md += `\n`;
    });

    md += `## Glossary\n\n`;
    data.glossary.forEach(item => {
        md += `**${item.term}:** ${item.definition}\n\n`;
    });

    return md;
}

function exportNarrativeMarkdown(data: NarrativeAnalysisResult): string {
    let md = `## Plot Summary\n\n${data.plotSummary}\n\n`;
    
    md += `## Characters\n\n`;
    data.characters.forEach(char => {
        md += `### ${char.name}\n${char.description}\n\n`;
    });

    md += `## Themes\n\n`;
    data.themes.forEach(theme => {
        md += `### ${theme.title}\n${theme.explanation}\n\n`;
    });
    
    return md;
}

function exportAudioMarkdown(data: AudioAnalysisResult): string {
    let md = `## Transcript\n\n`;
    data.transcript.forEach(entry => {
        md += `**[${entry.timestamp}] ${entry.speaker}:** ${entry.text}\n\n`;
    });

    if (data.thematicSegments && data.thematicSegments.length > 0) {
        md += `## Thematic Segments\n\n`;
        data.thematicSegments.forEach(seg => {
            md += `### ${seg.topic} (starts at ${seg.timestamp_start})\n`;
            md += `${seg.summary}\n\n`;
        });
    }

    if (data.sentimentAnalysis) {
        md += `## Sentiment Analysis\n\n`;
        md += `**Overall Sentiment:** ${data.sentimentAnalysis.overallSentiment}\n`;
        md += `**Tone:** ${data.sentimentAnalysis.tone}\n`;
        md += `*${data.sentimentAnalysis.summary}*\n\n`;
    }

    if (data.factChecks && data.factChecks.length > 0) {
        md += `## Fact Checks\n\n`;
        data.factChecks.forEach(fc => {
            md += `### Claim: "${fc.claim}"\n`;
            md += `**Verification:** ${fc.verification}\n`;
            if (fc.sources && fc.sources.length > 0) {
                md += `**Sources:**\n`;
                fc.sources.forEach(s => md += `- [${s.web.title}](${s.web.uri})\n`);
            }
            md += `\n`;
        });
    }

    return md;
}

function exportVideoMarkdown(data: VideoNarrativeAnalysisResult): string {
    let md = `## Plot Points\n\n`;
    data.plot_points.forEach(p => {
        md += `**[${p.timestamp}] ${p.event}:** ${p.description}`;
        if (p.charactersInvolved.length > 0) {
            md += ` (Characters: ${p.charactersInvolved.join(', ')})\n`;
        }
        md += '\n';
    });

    md += `\n## Character Arcs\n\n`;
    data.characters.forEach(c => {
        md += `### ${c.name}\n${c.arc_summary}\n\n`;
    });

    md += `\n## Themes\n\n`;
    data.themes.forEach(t => {
        md += `### ${t.theme}\n`;
        t.instances.forEach(i => {
            md += `- **[${i.timestamp}]**: ${i.description}\n`;
        });
        md += `\n`;
    });
    
    return md;
}

function exportArchiveMarkdown(data: ArchiveAnalysisResult): string {
     let md = `## Timeline of Events\n\n`;
    data.timeline.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).forEach(item => {
        md += `**${item.date} - ${item.event}:** ${item.description} (Source: ${item.sourceDocument})\n\n`;
    });

    md += `## Key Entities\n\n`;
    data.entities.forEach(entity => {
        md += `### ${entity.name} (${entity.type})\n`;
        entity.mentions.forEach(mention => {
            md += `- Mentioned in **${mention.document}**: "${mention.context}"\n`;
        });
        md += '\n';
    });

    md += `## Thematic Connections\n\n`;
    data.connections.forEach(conn => {
        md += `### Theme: ${conn.theme}\n`;
        md += `*${conn.description}*\n`;
        conn.connectingDocuments.forEach(doc => {
            md += `- **${doc.document}**: "${doc.context}"\n`;
        });
        md += '\n';
    });
    
    return md;
}

function exportImageMarkdown(data: ImageAnalysisResult): string {
    let md = `## AI Description\n\n${data.description}\n\n`;

    if (data.identifiedObjects && data.identifiedObjects.length > 0) {
        md += `## Identified Objects\n\n`;
        data.identifiedObjects.forEach(obj => {
            md += `- ${obj}\n`;
        });
        md += `\n`;
    }

    if (data.extractedText) {
        md += `## Extracted Text (OCR)\n\n`;
        md += '```\n';
        md += `${data.extractedText}\n`;
        md += '```\n\n';
    }

    return md;
}


export function exportToMarkdown(analysisResult: AnalysisResult, fileName: string) {
    let markdownContent = `# Analysis for: ${fileName}\n\n`;
    
    switch (analysisResult.type) {
        case 'publication':
            markdownContent += exportPublicationMarkdown(analysisResult);
            break;
        case 'narrative':
            markdownContent += exportNarrativeMarkdown(analysisResult);
            break;
        case 'audio':
            markdownContent += exportAudioMarkdown(analysisResult);
            break;
        case 'video':
            markdownContent += exportVideoMarkdown(analysisResult);
            break;
        case 'image':
            markdownContent += exportImageMarkdown(analysisResult);
            break;
        case 'archive':
             markdownContent += exportArchiveMarkdown(analysisResult);
            break;
        default:
            throw new Error('Unsupported analysis type for Markdown export.');
    }
    
    const safeFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    downloadFile(markdownContent, `${safeFileName}_analysis.md`, 'text/markdown');
}