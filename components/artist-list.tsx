'use client'

import { useState } from 'react'
import { type Artist } from './schedule-app'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Trash2, Plus } from 'lucide-react'

type ArtistListProps = {
  artists: Artist[]
  onAddArtist: (name: string) => void
  onRemoveArtist: (id: string) => void
}

export function ArtistList({ artists, onAddArtist, onRemoveArtist }: ArtistListProps) {
  const [newArtistName, setNewArtistName] = useState('')

  const handleAdd = () => {
    if (newArtistName.trim()) {
      onAddArtist(newArtistName.trim())
      setNewArtistName('')
    }
  }

  const scheduledArtists = artists.filter(a => a.stage && a.time)
  const unscheduledArtists = artists.filter(a => !a.stage || !a.time)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Add Artist */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
          Add Artist
        </h2>
        <div className="flex gap-2">
          <Input
            value={newArtistName}
            onChange={(e) => setNewArtistName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Artist name..."
            className="flex-1"
          />
          <Button onClick={handleAdd} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Scheduled Artists */}
      {scheduledArtists.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
            Scheduled ({scheduledArtists.length})
          </h2>
          <div className="space-y-2">
            {scheduledArtists.map(artist => (
              <div
                key={artist.id}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{artist.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {artist.stage} · {artist.time}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveArtist(artist.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unscheduled Artists */}
      {unscheduledArtists.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
            Unscheduled ({unscheduledArtists.length})
          </h2>
          <div className="space-y-2">
            {unscheduledArtists.map(artist => (
              <div
                key={artist.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="font-medium">{artist.name}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveArtist(artist.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
