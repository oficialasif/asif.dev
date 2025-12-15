'use client';

import { Highlight, Underline, Notice, Badge, Circle, MarkerLine } from './highlight';
import { ReactNode } from 'react';

interface ContentRendererProps {
    html: string;
    className?: string;
}

export default function ContentRenderer({ html, className }: ContentRendererProps) {
    if (!html) return null;

    // Parse custom syntax and convert to React components
    const parseContent = (content: string): ReactNode[] => {
        const parts: ReactNode[] = [];
        let lastIndex = 0;

        // Regex patterns for our custom syntax
        const patterns = [
            { regex: /\{\{circle:([^}]+)\}\}/g, component: 'circle' },
            { regex: /\{\{marker:([^}]+)\}\}/g, component: 'marker' },
            { regex: /\{\{highlight:([^}]+)\}\}/g, component: 'highlight' },
            { regex: /\[\[badge:([^}]+)\]\]/g, component: 'badge' },
        ];

        // Find all matches for all patterns
        const allMatches: Array<{ index: number; length: number; text: string; component: string }> = [];

        patterns.forEach(({ regex, component }) => {
            let match;
            const localRegex = new RegExp(regex.source, regex.flags);
            while ((match = localRegex.exec(content)) !== null) {
                allMatches.push({
                    index: match.index,
                    length: match[0].length,
                    text: match[1],
                    component: component
                });
            }
        });

        // Sort matches by index
        allMatches.sort((a, b) => a.index - b.index);

        // Build the result
        allMatches.forEach((match, i) => {
            // Add text before this match
            if (match.index > lastIndex) {
                const textBefore = content.substring(lastIndex, match.index);
                parts.push(<span key={`text-${i}`} dangerouslySetInnerHTML={{ __html: textBefore }} />);
            }

            // Add the component
            switch (match.component) {
                case 'circle':
                    parts.push(
                        <Circle key={`circle-${i}`} color="red" animated="draw">
                            {match.text}
                        </Circle>
                    );
                    break;
                case 'marker':
                    parts.push(
                        <MarkerLine key={`marker-${i}`} color="red" animated="draw">
                            {match.text}
                        </MarkerLine>
                    );
                    break;
                case 'highlight':
                    parts.push(
                        <Highlight key={`highlight-${i}`} color="yellow" animated="draw">
                            {match.text}
                        </Highlight>
                    );
                    break;
                case 'badge':
                    parts.push(
                        <Badge key={`badge-${i}`} variant="filled" color="primary">
                            {match.text}
                        </Badge>
                    );
                    break;
            }

            lastIndex = match.index + match.length;
        });

        // Add remaining text
        if (lastIndex < content.length) {
            const textAfter = content.substring(lastIndex);
            parts.push(<span key="text-end" dangerouslySetInnerHTML={{ __html: textAfter }} />);
        }

        return parts.length > 0 ? parts : [<span key="all" dangerouslySetInnerHTML={{ __html: content }} />];
    };

    return (
        <>
            {parseContent(html)}
        </>
    );
}
