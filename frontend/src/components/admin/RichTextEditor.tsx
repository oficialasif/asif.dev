'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    className?: string;
}

export default function RichTextEditor({
    content,
    onChange,
    placeholder = 'Start typing...',
    className,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content,
        immediatelyRender: false, // Fix SSR hydration mismatch
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3',
            },
        },
    });

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({
        onClick,
        isActive = false,
        icon: Icon,
        title
    }: {
        onClick: () => void;
        isActive?: boolean;
        icon: any;
        title: string
    }) => (
        <button
            onClick={(e) => {
                e.preventDefault();
                onClick();
            }}
            className={cn(
                'p-2 rounded hover:bg-purple-500/20 transition-colors',
                isActive && 'bg-purple-500/30 text-purple-300'
            )}
            title={title}
            type="button"
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    return (
        <div className={cn('border border-purple-500/30 rounded-lg bg-[#0a0a0f] overflow-hidden', className)}>
            {/* Toolbar */}
            <div className="border-b border-purple-500/30 p-2 flex flex-wrap gap-1 bg-purple-900/10">
                {/* Basic Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={Bold}
                    title="Bold"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={Italic}
                    title="Italic"
                />

                <div className="w-px h-6 bg-purple-500/30 mx-1" />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    icon={Heading1}
                    title="Heading 1"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    icon={Heading2}
                    title="Heading 2"
                />

                <div className="w-px h-6 bg-purple-500/30 mx-1" />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    icon={List}
                    title="Bullet List"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    icon={ListOrdered}
                    title="Numbered List"
                />
            </div>


            {/* Editor Content */}
            <EditorContent editor={editor} className="text-white" />

            {/* Syntax Help */}
            <div className="border-t border-purple-500/30 p-3 text-xs text-gray-300 bg-purple-900/5 space-y-1">
                <div className="font-semibold text-purple-300 mb-1">✨ Highlight Syntax:</div>
                <div className="grid grid-cols-2 gap-2">
                    <code className="bg-purple-900/30 px-2 py-1 rounded">{`{{circle:text}}`}</code>
                    <span className="text-gray-400">→ Red circle animation</span>
                    <code className="bg-purple-900/30 px-2 py-1 rounded">{`{{marker:text}}`}</code>
                    <span className="text-gray-400">→ Red marker underline</span>
                    <code className="bg-purple-900/30 px-2 py-1 rounded">{`{{highlight:text}}`}</code>
                    <span className="text-gray-400">→ Yellow highlight</span>
                    <code className="bg-purple-900/30 px-2 py-1 rounded">{`[[badge:NEW]]`}</code>
                    <span className="text-gray-400">→ Badge</span>
                </div>
            </div>
        </div>
    );
}
