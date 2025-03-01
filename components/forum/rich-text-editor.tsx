'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import { Button } from '@/components/ui/button';
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent 
} from '@/components/ui/tooltip';
import { 
  Bold, Italic, List, ListOrdered, Quote, 
  Link2, Image as ImageIcon, Heading2, 
  Code, Strikethrough 
} from 'lucide-react';
import { useUploadThing } from '@/utils/uploadthing';
import { suggestion } from './mention-suggestion';
import { cn } from '@/lib/utils';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: EditorProps) {
  const { startUpload } = useUploadThing("imageUploader");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion,
      }),
    ],
    content: content || '', // Ensure content is never undefined
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap p-4',
        ...(placeholder && { 'data-placeholder': placeholder }), // Only add if placeholder exists
      },
    },
  });

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (!input.files?.length) return;
      
      try {
        const result = await startUpload([input.files[0]]);
        if (result && result.length > 0 && editor) {
          editor.chain().focus().setImage({ src: result[0].ufsUrl }).run();
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
    input.click();
  };

  if (!editor) return null;

  const tools = [
    {
      icon: <Bold className="h-4 w-4" />,
      title: "Bold",
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleBold().run();
      },
      isActive: () => editor?.isActive('bold') ?? false,
    },
    {
      icon: <Italic className="h-4 w-4" />,
      title: "Italic",
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleItalic().run();
      },
      isActive: () => editor?.isActive('italic') ?? false,
    },
    {
      icon: <Strikethrough className="h-4 w-4" />,
      title: "Strike",
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleStrike().run();
      },
      isActive: () => editor?.isActive('strike') ?? false,
    },
    {
      icon: <Code className="h-4 w-4" />,
      title: "Code",
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleCode().run();
      },
      isActive: () => editor?.isActive('code') ?? false,
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      title: "Heading",
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleHeading({ level: 2 }).run();
      },
      isActive: () => editor?.isActive('heading', { level: 2 }) ?? false,
    },
    {
      icon: <List className="h-4 w-4" />,
      title: "Bullet List",
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleBulletList().run();
      },
      isActive: () => editor?.isActive('bulletList') ?? false,
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      title: "Numbered List",
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleOrderedList().run();
      },
      isActive: () => editor?.isActive('orderedList') ?? false,
    },
    {
      icon: <Quote className="h-4 w-4" />,
      title: "Blockquote",
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        editor?.chain().focus().toggleBlockquote().run();
      },
      isActive: () => editor?.isActive('blockquote') ?? false,
    },
    {
      icon: <Link2 className="h-4 w-4" />,
      title: "Link",
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        const url = window.prompt('Enter URL');
        if (url) {
          editor?.chain().focus().setLink({ href: url }).run();
        }
      },
      isActive: () => editor?.isActive('link') ?? false,
    },
    {
      icon: <ImageIcon className="h-4 w-4" />,
      title: "Image",
      action: (e: React.MouseEvent) => {
        e.preventDefault();
        addImage();
      },
      isActive: () => false,
    },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="border-b bg-muted p-2 flex flex-wrap gap-2">
        <TooltipProvider>
          {tools.map((tool) => (
            <Tooltip key={tool.title}>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={tool.action}
                  className={cn(
                    "h-8 w-8 p-0",
                    tool.isActive() && "bg-accent text-accent-foreground"
                  )}
                >
                  {tool.icon}
                  <span className="sr-only">{tool.title}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{tool.title}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
