"use client";
import { ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: ReactNode;
}

export default function ModalPortal({ children }: ModalPortalProps) {
  if (typeof window === "undefined") return null;

  const modalRoot = document.getElementById("modal-root") || createModalRoot();

  return createPortal(children, modalRoot);
}

function createModalRoot() {
  const modalRoot = document.createElement("div");
  modalRoot.id = "modal-root";
  document.body.appendChild(modalRoot);
  return modalRoot;
}
