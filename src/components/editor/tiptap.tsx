"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image'; // Cần cài thêm
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Extension } from '@tiptap/core';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Undo, Redo, Image as ImageIcon, Highlighter, Palette } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize }).run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
      },
    };
  },
});

interface TiptapProps {
  content: string;
  onChange: (html: string) => void;
}

export default function Tiptap({ content, onChange }: TiptapProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image, // Kích hoạt Image extension
      Highlight,
      TextStyle,
      Color,
      FontSize,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl dark:prose-invert dark:text-slate-200 mx-auto focus:outline-none min-h-[300px] border border-slate-200 dark:border-slate-800 rounded-md p-4',
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const supabase = createClient();
        const user = (await supabase.auth.getUser()).data.user;

        if (!user) return alert("Vui lòng đăng nhập để upload ảnh");

        // Sửa lại đường dẫn: Đưa user.id lên đầu để khớp với RLS Policy
        const filePath = `${user.id}/blog-images/${Date.now()}-${file.name}`;

        // Upload
        const { error } = await supabase.storage
          .from('student-docs') // Tạm dùng bucket này hoặc tạo bucket mới 'blog-images'
          .upload(filePath, file);

        if (error) {
          alert("Lỗi upload ảnh: " + error.message);
          return;
        }

        // Get Public URL
        const { data } = supabase.storage
          .from('student-docs')
          .getPublicUrl(filePath);

        if (data.publicUrl) {
          editor?.chain().focus().setImage({ src: data.publicUrl }).run();
        }
      }
    };

    input.click();
  };

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 items-center">
        <select
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontSize(e.target.value).run();
            } else {
              editor.chain().focus().unsetFontSize().run();
            }
          }}
          value={editor.getAttributes('textStyle').fontSize || ''}
          className="h-8 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent text-sm px-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-600"
        >
          <option value="" className="bg-white dark:bg-slate-900">Cỡ chữ</option>
          <option value="12px" className="bg-white dark:bg-slate-900">12px</option>
          <option value="14px" className="bg-white dark:bg-slate-900">14px</option>
          <option value="16px" className="bg-white dark:bg-slate-900">16px</option>
          <option value="18px" className="bg-white dark:bg-slate-900">18px</option>
          <option value="20px" className="bg-white dark:bg-slate-900">20px</option>
          <option value="24px" className="bg-white dark:bg-slate-900">24px</option>
          <option value="30px" className="bg-white dark:bg-slate-900">30px</option>
        </select>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-slate-200 dark:bg-slate-800' : ''}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-slate-200 dark:bg-slate-800' : ''}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'bg-slate-200 dark:bg-slate-800' : ''}
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive('highlight') ? 'bg-slate-200 dark:bg-slate-800' : ''}
        >
          <Highlighter className="w-4 h-4" />
        </Button>
        <div className="relative flex items-center justify-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer" title="Đổi màu chữ">
          <Palette className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          <input
            type="color"
            onInput={(event) => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 self-center"></div>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 dark:bg-slate-800' : ''}
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 dark:bg-slate-800' : ''}
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 dark:bg-slate-800' : ''}
        >
          <Heading3 className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 self-center"></div>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-slate-200 dark:bg-slate-800' : ''}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-slate-200 dark:bg-slate-800' : ''}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-slate-200 dark:bg-slate-800' : ''}
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'bg-slate-200 dark:bg-slate-800' : ''}
        >
          <Code className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 self-center"></div>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 self-center"></div>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={addImage}
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}