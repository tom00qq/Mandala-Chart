import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";

import { Underline } from "@tiptap/extension-underline";
import { MarkButton } from "@/components/tiptap-ui/mark-button";

import { TextAlign } from "@tiptap/extension-text-align";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";

import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

import "@/styles/_keyframe-animations.scss";
import "@/styles/_variables.scss";

import { useEffect } from "react";

interface EditorProps {
  content: string;
  onSave?: (content: string) => void;
  viewOnly?: boolean;
}

const Editor: React.FC<EditorProps> = ({
  content,
  onSave,
  viewOnly = false,
}) => {
  const baseSetting = {
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({ nested: true }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: content,
  };

  if (viewOnly) {
    const viewOnlyEditor = useEditor({
      ...baseSetting,
      editable: false,
    });

    useEffect(() => {
      if (viewOnlyEditor && content !== viewOnlyEditor.getHTML()) {
        viewOnlyEditor.commands.setContent(content);
      }
    }, [content, viewOnlyEditor]);

    return <EditorContent editor={viewOnlyEditor} role="presentation" />;
  }

  const editor = useEditor({
    ...baseSetting,
    onUpdate: ({ editor }) => {
      if (onSave) {
        onSave(editor.getHTML());
      }
    },
  });

  return (
    <div
      className="w-full h-full"
      onClick={() => {
        editor?.commands.focus();
      }}
    >
      <EditorContext.Provider value={{ editor }}>
        <div className="tiptap-button-group" data-orientation="horizontal">
          <HeadingDropdownMenu levels={[1, 2, 3]} />
          <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />

          <TextAlignButton align="left" />
          <TextAlignButton align="center" />
          <TextAlignButton align="right" />

          <MarkButton type="bold" />
          <MarkButton type="italic" />
          <MarkButton type="strike" />
          <MarkButton type="underline" />
        </div>

        <EditorContent editor={editor} role="presentation" />
      </EditorContext.Provider>
    </div>
  );
};

export default Editor;
