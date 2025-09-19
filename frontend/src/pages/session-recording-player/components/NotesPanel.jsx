import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const NotesPanel = ({ 
  currentTime, 
  onSeekTo, 
  isCollapsed, 
  onToggleCollapse,
  className = '' 
}) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [syncStatus, setSyncStatus] = useState('synced'); // synced, syncing, offline
  const textareaRef = useRef(null);

  // Mock existing notes
  useEffect(() => {
    const mockNotes = [
      {
        id: 1,
        timestamp: 45,
        content: "MOSFET structure: Gate, Source, Drain, Body terminals. Key parameters to remember.",
        createdAt: new Date(Date.now() - 3600000),
        synced: true
      },
      {
        id: 2,
        timestamp: 120,
        content: "Moore's Law limitations:\n- Physical constraints\n- Power density issues\n- Manufacturing costs",
        createdAt: new Date(Date.now() - 1800000),
        synced: true
      },
      {
        id: 3,
        timestamp: 210,
        content: "Power optimization techniques:\n1. Clock gating\n2. Power gating\n3. Voltage scaling\n\nEach has different trade-offs in terms of area and complexity.",
        createdAt: new Date(Date.now() - 900000),
        synced: false
      }
    ];
    setNotes(mockNotes);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const handleAddNote = () => {
    if (!newNote?.trim()) return;

    const note = {
      id: Date.now(),
      timestamp: Math.floor(currentTime),
      content: newNote?.trim(),
      createdAt: new Date(),
      synced: false
    };

    setNotes(prev => [...prev, note]?.sort((a, b) => a?.timestamp - b?.timestamp));
    setNewNote('');
    setSyncStatus('syncing');

    // Simulate sync
    setTimeout(() => {
      setNotes(prev => prev?.map(n => n?.id === note?.id ? { ...n, synced: true } : n));
      setSyncStatus('synced');
    }, 2000);
  };

  const handleEditNote = (noteId, newContent) => {
    setNotes(prev => prev?.map(note => 
      note?.id === noteId 
        ? { ...note, content: newContent, synced: false }
        : note
    ));
    setEditingNote(null);
    setSyncStatus('syncing');

    // Simulate sync
    setTimeout(() => {
      setNotes(prev => prev?.map(n => n?.id === noteId ? { ...n, synced: true } : n));
      setSyncStatus('synced');
    }, 1500);
  };

  const handleDeleteNote = (noteId) => {
    setNotes(prev => prev?.filter(note => note?.id !== noteId));
  };

  const handleNoteClick = (timestamp) => {
    onSeekTo(timestamp);
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'syncing':
        return <Icon name="Loader2" size={16} className="animate-spin text-warning" />;
      case 'offline':
        return <Icon name="WifiOff" size={16} className="text-error" />;
      default:
        return <Icon name="Check" size={16} className="text-success" />;
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Syncing...';
      case 'offline':
        return 'Offline';
      default:
        return 'All notes synced';
    }
  };

  if (isCollapsed) {
    return (
      <div className={`bg-card border border-border rounded-lg ${className}`}>
        <Button
          variant="ghost"
          onClick={onToggleCollapse}
          className="w-full p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Icon name="StickyNote" size={20} />
            <span className="font-medium">Notes</span>
            {notes?.length > 0 && (
              <span className="text-sm text-muted-foreground">({notes?.length})</span>
            )}
          </div>
          <Icon name="ChevronUp" size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="StickyNote" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Notes</h3>
          {notes?.length > 0 && (
            <span className="text-sm text-muted-foreground">({notes?.length})</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {getSyncStatusIcon()}
            <span>{getSyncStatusText()}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
          >
            <Icon name="ChevronDown" size={20} />
          </Button>
        </div>
      </div>
      {/* Add Note */}
      <div className="p-4 border-b border-border">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>Current time: {formatTime(currentTime)}</span>
          </div>
          <textarea
            ref={textareaRef}
            value={newNote}
            onChange={(e) => setNewNote(e?.target?.value)}
            placeholder="Add a note at current timestamp..."
            className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            rows={3}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {newNote?.length}/500 characters
            </span>
            <Button
              onClick={handleAddNote}
              disabled={!newNote?.trim() || newNote?.length > 500}
              size="sm"
            >
              <Icon name="Plus" size={16} />
              Add Note
            </Button>
          </div>
        </div>
      </div>
      {/* Notes List */}
      <div className="max-h-96 overflow-y-auto">
        {notes?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="StickyNote" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No notes yet</p>
            <p className="text-sm text-muted-foreground">
              Add your first note at the current timestamp
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {notes?.map((note) => (
              <div
                key={note?.id}
                className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <button
                    onClick={() => handleNoteClick(note?.timestamp)}
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Icon name="Play" size={14} />
                    <span className="font-mono">{formatTime(note?.timestamp)}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    {!note?.synced && (
                      <Icon name="Clock" size={12} className="text-warning" title="Not synced" />
                    )}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingNote(note?.id)}
                        className="h-6 w-6"
                      >
                        <Icon name="Edit2" size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteNote(note?.id)}
                        className="h-6 w-6 text-error hover:text-error hover:bg-error/10"
                      >
                        <Icon name="Trash2" size={12} />
                      </Button>
                    </div>
                  </div>
                </div>

                {editingNote === note?.id ? (
                  <div className="space-y-2">
                    <textarea
                      defaultValue={note?.content}
                      className="w-full p-2 border border-border rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      rows={3}
                      onBlur={(e) => handleEditNote(note?.id, e?.target?.value)}
                      onKeyDown={(e) => {
                        if (e?.key === 'Enter' && e?.ctrlKey) {
                          handleEditNote(note?.id, e?.target?.value);
                        }
                        if (e?.key === 'Escape') {
                          setEditingNote(null);
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          const textarea = e?.target?.closest('.space-y-2')?.querySelector('textarea');
                          handleEditNote(note?.id, textarea?.value);
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingNote(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {note?.content}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>
                        {note?.createdAt?.toLocaleDateString()} at {note?.createdAt?.toLocaleTimeString()}
                      </span>
                      {note?.synced ? (
                        <span className="flex items-center gap-1">
                          <Icon name="Check" size={10} />
                          Synced
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={10} />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer */}
      {notes?.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {notes?.filter(n => n?.synced)?.length} of {notes?.length} synced
            </span>
            <Button variant="ghost" size="sm" className="text-xs">
              Export Notes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPanel;