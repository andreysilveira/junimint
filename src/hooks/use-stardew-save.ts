import { useState, useCallback, useEffect, useRef } from 'react';
import { StardewSave, SaveChange, SaveValidationResult } from '@/src/domain/save/types';
import { parseSaveXml } from '@/src/infrastructure/save/xml-parser';
import { serializeSaveXml } from '@/src/infrastructure/save/xml-serializer';
import { validateSave } from '@/src/infrastructure/save/xml-validator';
import { analyzeSaveCompatibility, CompatibilityReport } from '@/src/infrastructure/save/save-format';
import { ActionResult } from '@/src/application/domain-actions';

const MAX_HISTORY = 40;

export interface NotificationToastState {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export function useStardewSave() {
  const [saveData, setSaveData] = useState<StardewSave | null>(null);
  const [originalSave, setOriginalSave] = useState<StardewSave | null>(null);
  const [undoStack, setUndoStack] = useState<StardewSave[]>([]);
  const [redoStack, setRedoStack] = useState<StardewSave[]>([]);
  const [changeHistory, setChangeHistory] = useState<SaveChange[]>([]);
  const [validation, setValidation] = useState<SaveValidationResult | null>(null);
  const [compatibility, setCompatibility] = useState<CompatibilityReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationToastState | null>(null);

  const saveDataRef = useRef<StardewSave | null>(null);
  useEffect(() => {
    saveDataRef.current = saveData;
  }, [saveData]);

  // Auto-validate whenever saveData changes
  useEffect(() => {
    if (saveData) {
      const valResult = validateSave(saveData);
      setValidation(valResult);
      const compReport = analyzeSaveCompatibility(saveData);
      setCompatibility(compReport);
    } else {
      setValidation(null);
      setCompatibility(null);
    }
  }, [saveData]);

  const notify = useCallback((title: string, message: string, type: NotificationToastState['type'] = 'success') => {
    setNotification({
      id: String(Date.now()),
      title,
      message,
      type,
    });
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const loadSaveFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const xmlText = await file.text();
      const parsed = parseSaveXml(xmlText, file.name);
      saveDataRef.current = parsed;
      setSaveData(parsed);
      setOriginalSave(parsed);
      setUndoStack([]);
      setRedoStack([]);
      setChangeHistory([]);
      notify('Save Loaded', `Successfully loaded "${parsed.player.name}" on "${parsed.player.farmName}" Farm`, 'success');
    } catch (err: any) {
      console.error('Failed to parse save file:', err);
      setError(err.message || 'Unable to read this save file. Please ensure it is a valid Stardew Valley save file.');
      notify('Loading Failed', err.message || 'Invalid save file', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [notify]);

  // Execute a domain action with automatic undo stack push & audit logging
  const executeAction = useCallback((actionFn: (save: StardewSave) => ActionResult) => {
    const currentSave = saveDataRef.current;
    if (!currentSave) return;

    try {
      const result = actionFn(currentSave);

      // Push current state to undo stack
      setUndoStack((prev) => [...prev.slice(-MAX_HISTORY), currentSave]);
      // Clear redo stack on new action
      setRedoStack([]);
      // Add to change history, ensuring no duplicate IDs
      setChangeHistory((prev) => {
        const filtered = prev.filter((c) => c.id !== result.change.id);
        return [result.change, ...filtered].slice(0, 100);
      });

      saveDataRef.current = result.save;
      setSaveData(result.save);

      notify(result.change.title, result.change.description, 'success');
    } catch (err: any) {
      console.error('Action failed:', err);
      notify('Action Failed', err.message || 'Could not perform operation', 'error');
    }
  }, [notify]);

  const undo = useCallback(() => {
    if (undoStack.length === 0 || !saveData) return;
    const previous = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    setRedoStack((prev) => [...prev, saveData]);
    setUndoStack(newUndoStack);
    saveDataRef.current = previous;
    setSaveData(previous);
    notify('Undo', 'Reverted previous change', 'info');
  }, [undoStack, saveData, notify]);

  const redo = useCallback(() => {
    if (redoStack.length === 0 || !saveData) return;
    const next = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    setUndoStack((prev) => [...prev, saveData]);
    setRedoStack(newRedoStack);
    saveDataRef.current = next;
    setSaveData(next);
    notify('Redo', 'Re-applied change', 'info');
  }, [redoStack, saveData, notify]);

  const resetToOriginal = useCallback(() => {
    if (!originalSave) return;
    setUndoStack((prev) => (saveData ? [...prev, saveData] : prev));
    setRedoStack([]);
    saveDataRef.current = originalSave;
    setSaveData(originalSave);
    notify('Reset Complete', 'Restored save to original imported state', 'info');
  }, [originalSave, saveData, notify]);

  // Keyboard shortcut listener for Ctrl+Z and Ctrl+Y / Ctrl+Shift+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const downloadModifiedSave = useCallback(() => {
    if (!saveData) return;
    try {
      const xml = serializeSaveXml(saveData);
      const blob = new Blob([xml], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Preserve original file name if available
      const baseName = saveData.metadata.originalFileName || `${saveData.player.name}_${saveData.player.farmName}`;
      a.download = baseName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      notify('Export Successful', `Downloaded modified save as "${baseName}"`, 'success');
    } catch (err: any) {
      console.error('Failed to export save:', err);
      notify('Export Failed', err.message || 'Could not serialize save file', 'error');
    }
  }, [saveData, notify]);

  const downloadOriginalBackup = useCallback(() => {
    if (!originalSave) return;
    try {
      const blob = new Blob([originalSave.originalXml], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = originalSave.metadata.originalFileName || 'SaveGameInfo';
      a.download = `BACKUP_${baseName}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      notify('Backup Downloaded', `Downloaded unmodified backup as "BACKUP_${baseName}"`, 'info');
    } catch (err: any) {
      console.error('Failed to export backup:', err);
      notify('Backup Failed', 'Could not export original backup', 'error');
    }
  }, [originalSave, notify]);

  return {
    saveData,
    originalSave,
    isLoading,
    error,
    validation,
    compatibility,
    changeHistory,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    notification,
    loadSaveFile,
    executeAction,
    undo,
    redo,
    resetToOriginal,
    downloadModifiedSave,
    downloadOriginalBackup,
    dismissNotification,
  };
}
