import { writable, type Writable } from 'svelte/store';

export interface DragState {
	dragging: boolean;
  draggedId?: string;
  hoveredId?: string;
  mousePosition?: { x?: number, y?: number};
  validDrop?: boolean;
}

export const draggingStore: Writable<DragState> = writable({ dragging: false });
