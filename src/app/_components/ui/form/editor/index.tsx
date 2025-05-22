"use client";
import React, { useState } from "react";

import { useQuill } from "react-quilljs";

import "quill/dist/quill.snow.css";
import { cn } from "@sohanemon/utils";
import "./editor.css";

interface Props {
  onChange: (html: any) => void;
  value: string;
}

export default function Editor({ onChange = () => {}, value = "" }: Props) {
  const [defaultVal, setDefaultVal] = useState(value || null);
  const theme = "snow";

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
    ],
  };

  const placeholder = "Compose an epic...";

  const { quill, quillRef } = useQuill({
    theme,
    modules,
    placeholder,
  });

  React.useEffect(() => {
    if (quill) {
      quill.on("text-change", (delta, oldDelta, source) => {
        console.log("Text change!");
        console.log(quill.root.innerHTML); // Get innerHTML using quill
        onChange(quill.root.innerHTML);
      });
    }
  }, [quill]);

  React.useEffect(() => {
    if (quill && defaultVal) {
      quill.clipboard.dangerouslyPasteHTML(defaultVal);
      setDefaultVal(null);
    }
  }, [quill]);

  return (
    <div className={cn("&.ql-toolbar:rounded-t-xl")}>
      <div
        ref={quillRef}
        className="min-h-[200px] rounded-b-xl border border-t-transparent pt-3"
      />
    </div>
  );
}
