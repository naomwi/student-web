"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image'; // Cần cài thêm
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, Image as ImageIcon } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

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
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] border rounded-md p-4',
      },
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
      <div className="flex gap-2 border-b pb-2">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-slate-200' : ''}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-slate-200' : ''}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-slate-200' : ''}
        >
          <List className="w-4 h-4" />
        </Button>
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