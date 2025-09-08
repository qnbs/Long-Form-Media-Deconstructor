import React, { useMemo, useEffect } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import html from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';

// Register only the languages we want to support to keep the bundle smaller
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', html);
hljs.registerLanguage('xml', html);
hljs.registerLanguage('json', json);
hljs.registerLanguage('md', markdown);
hljs.registerLanguage('markdown', markdown);

marked.setOptions({
  gfm: true, // Enable GitHub Flavored Markdown
  breaks: true, // Render line breaks as <br>
  highlight: (code, lang) => {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
});

interface MarkdownPreviewProps {
  markdownText: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdownText }) => {
  const parsedHtml = useMemo(() => {
    if (!markdownText) {
        return '<p class="text-slate-400 italic">Preview will appear here...</p>';
    }
    // `marked.parse` is synchronous
    return marked.parse(markdownText) as string;
  }, [markdownText]);

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: parsedHtml }}
    />
  );
};