import React, { useState } from 'react';
import Layout from './components/Layout';
import FileUploader from './components/FileUploader';
import Overview from './components/Overview';
import ProfileEditor from './components/player/ProfileEditor';
import InventoryEditor from './components/inventory/InventoryEditor';
import RelationshipsEditor from './components/relationships/RelationshipsEditor';
import FarmEditor from './components/farm/FarmEditor';
import WorldEditor from './components/world/WorldEditor';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import HackModeEditor from './components/hack/HackModeEditor';
import SaveValidatorModal from './components/save/SaveValidatorModal';
import NotificationToast from './components/shared/NotificationToast';
import { useStardewSave } from './hooks/use-stardew-save';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isValidatorOpen, setIsValidatorOpen] = useState(false);

  const { 
    saveData, 
    isLoading, 
    error, 
    validation,
    compatibility,
    changeHistory,
    canUndo,
    canRedo,
    notification,
    loadSaveFile, 
    executeAction,
    undo,
    redo,
    resetToOriginal,
    downloadModifiedSave,
    downloadOriginalBackup,
    dismissNotification,
  } = useStardewSave();

  if (!saveData) {
    return (
      <div className="min-h-screen bg-bg-main p-8 selection:bg-stardew-primary/30">
        <FileUploader 
          onFileSelect={loadSaveFile} 
          isLoading={isLoading} 
          error={error} 
        />
        <NotificationToast 
          notification={notification} 
          onDismiss={dismissNotification} 
        />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Overview 
            data={saveData} 
            setActiveTab={setActiveTab} 
            onExecute={executeAction} 
          />
        );
      case 'profile':
        return (
          <ProfileEditor 
            data={saveData} 
            onExecute={executeAction} 
          />
        );
      case 'inventory':
        return (
          <InventoryEditor 
            data={saveData} 
            onExecute={executeAction} 
          />
        );
      case 'social':
        return (
          <RelationshipsEditor 
            data={saveData} 
            onExecute={executeAction} 
          />
        );
      case 'farm':
        return (
          <FarmEditor 
            data={saveData} 
            onExecute={executeAction} 
          />
        );
      case 'world':
        return (
          <WorldEditor 
            data={saveData} 
            onExecute={executeAction} 
          />
        );
      case 'analytics':
        return (
          <AnalyticsDashboard 
            data={saveData} 
            changeHistory={changeHistory}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undo}
            onRedo={redo}
          />
        );
      case 'hack':
        return (
          <HackModeEditor 
            data={saveData} 
            onExecute={executeAction} 
          />
        );
      default:
        return (
          <Overview 
            data={saveData} 
            setActiveTab={setActiveTab} 
            onExecute={executeAction} 
          />
        );
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenValidator={() => setIsValidatorOpen(true)}
        hasData={!!saveData}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        validation={validation}
        farmerName={saveData.player.name}
        farmName={saveData.player.farmName}
      >
        {renderContent()}
      </Layout>

      {/* Save Validator and Pre-Export Modal */}
      <SaveValidatorModal
        isOpen={isValidatorOpen}
        onClose={() => setIsValidatorOpen(false)}
        validation={validation}
        compatibility={compatibility}
        onDownloadModified={downloadModifiedSave}
        onDownloadOriginal={downloadOriginalBackup}
        onReset={resetToOriginal}
        fileName={saveData.metadata.originalFileName}
      />

      {/* Notification Toasts */}
      <NotificationToast 
        notification={notification} 
        onDismiss={dismissNotification} 
      />
    </>
  );
}
