// types/react-table.d.ts
import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends object = any, TValue = unknown> {
    isColumnSticky?: boolean;
    stickySide?: "left" | "right";
  }
}
