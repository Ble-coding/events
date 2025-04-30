import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { Button } from '@/components/ui/button'
import { Bold, Italic, Underline as UnderlineIcon, List } from 'lucide-react'

interface EditorProps {
  value: string
  onChange: (content: string) => void
}

export default function Editor({ value, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  });

  // 🔥 IMPORTANT : écouter les changements de "value"
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap border p-2 rounded-md bg-muted">
        <Button
          type="button"
          size="icon"
          variant={editor.isActive('bold') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant={editor.isActive('italic') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant={editor.isActive('underline') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant={editor.isActive('bulletList') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Zone */}
      <div className="border rounded-md min-h-[300px] p-2 bg-white dark:bg-accent/10">
        <EditorContent editor={editor} className="prose max-w-none" />
      </div>
    </div>
  )
}
