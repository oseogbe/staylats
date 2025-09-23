import { useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  Undo,
  Redo,
  ChevronDown
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  onTextChange?: (textLength: number) => void
  placeholder?: string
  maxLength?: number
  className?: string
}

interface ToolbarButtonProps {
  onClick: () => void
  disabled?: boolean
  active?: boolean
  children: React.ReactNode
}

const ToolbarButton = ({ onClick, disabled, active, children }: ToolbarButtonProps) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className={cn(
      'h-8 w-8 p-0',
      active && 'bg-muted text-foreground'
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </Button>
)

export function RichTextEditor({
  value,
  onChange,
  onTextChange,
  placeholder = 'Start typing...',
  maxLength,
  className
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [textLength, setTextLength] = useState(0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      })
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none max-w-none min-h-[120px] text-muted-foreground [&_*]:text-muted-foreground',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      const length = editor.getText().length
      setTextLength(length)
      onTextChange?.(length)
      
      if (maxLength && length > maxLength) {
        editor.commands.setContent(value)
        return
      }
      onChange(html)
    }
  })

  useEffect(() => {
    if (!editor) return

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value)
      setTextLength(editor.getText().length)
      onTextChange?.(editor.getText().length)
    }
  }, [editor, value])

  if (!isMounted || !editor) {
    return null
  }

  const headingOptions = [
    { label: 'Heading 1', icon: Heading1, command: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: 'Heading 2', icon: Heading2, command: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'Heading 3', icon: Heading3, command: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: 'Paragraph', icon: Pilcrow, command: () => editor.chain().focus().setParagraph().run() },
  ]

  const getActiveHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1'
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2'
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3'
    return 'Paragraph'
  }

  return (
    <div className="relative">
      <div className="border border-input bg-background rounded-md">
        {/* Toolbar */}
        <div className="flex items-center gap-1 border-b border-input p-1">
          {/* Text Style Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 gap-1"
              >
                {getActiveHeading()}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {headingOptions.map((option) => {
                const Icon = option.icon
                return (
                  <DropdownMenuItem
                    key={option.label}
                    className="flex items-center gap-2"
                    onSelect={option.command}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-4 bg-border mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-4 bg-border mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-4 bg-border mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Editor Content */}
        <div
          className={cn(
            'px-3 py-2',
            className,
            '[&_.is-editor-empty]:before:text-muted-foreground [&_.is-editor-empty]:before:content-[attr(data-placeholder)] [&_.is-editor-empty]:before:float-left [&_.is-editor-empty]:before:pointer-events-none'
          )}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Character Count */}
      {maxLength && (
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {textLength}/{maxLength}
        </div>
      )}
    </div>
  )
}