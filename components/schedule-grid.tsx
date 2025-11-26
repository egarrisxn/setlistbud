'use client'

import { useState } from 'react'
import { type Artist, type ScheduleSlot } from './schedule-app'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

type ScheduleGridProps = {
  artists: Artist[]
  schedule: ScheduleSlot[]
  onScheduleChange: (schedule: ScheduleSlot[]) => void
  stages: string[]
  timeSlots: string[]
}

export function ScheduleGrid({
  artists,
  schedule,
  onScheduleChange,
  stages,
  timeSlots,
}: ScheduleGridProps) {
  const [draggedArtist, setDraggedArtist] = useState<Artist | null>(null)
  const [selectedCell, setSelectedCell] = useState<{ stage: string; time: string } | null>(null)

  const getArtistForSlot = (stage: string, time: string) => {
    const slot = schedule.find(s => s.stage === stage && s.time === time)
    if (!slot?.artistId) return null
    return artists.find(a => a.id === slot.artistId)
  }

  const handleDragStart = (artist: Artist) => {
    setDraggedArtist(artist)
  }

  const handleDrop = (stage: string, time: string) => {
    if (!draggedArtist) return

    // Remove artist from previous slot
    const newSchedule = schedule.filter(s => s.artistId !== draggedArtist.id)
    
    // Remove any existing artist from this slot
    const filteredSchedule = newSchedule.filter(
      s => !(s.stage === stage && s.time === time)
    )

    // Add artist to new slot
    onScheduleChange([
      ...filteredSchedule,
      { stage, time, artistId: draggedArtist.id },
    ])

    setDraggedArtist(null)
  }

  const handleCellClick = (stage: string, time: string) => {
    const existingArtist = getArtistForSlot(stage, time)
    if (existingArtist) {
      // Remove artist from slot
      onScheduleChange(schedule.filter(s => s.artistId !== existingArtist.id))
    } else {
      setSelectedCell({ stage, time })
    }
  }

  const handleArtistSelect = (artistId: string) => {
    if (!selectedCell) return

    const { stage, time } = selectedCell

    // Remove artist from previous slot
    const newSchedule = schedule.filter(s => s.artistId !== artistId)
    
    // Remove any existing artist from this slot
    const filteredSchedule = newSchedule.filter(
      s => !(s.stage === stage && s.time === time)
    )

    // Add artist to new slot
    onScheduleChange([
      ...filteredSchedule,
      { stage, time, artistId },
    ])

    setSelectedCell(null)
  }

  const unscheduledArtists = artists.filter(
    artist => !schedule.some(s => s.artistId === artist.id)
  )

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Unscheduled Artists */}
      {unscheduledArtists.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-3 md:p-4">
          <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
            Unscheduled Artists
          </h2>
          <div className="flex flex-wrap gap-2">
            {unscheduledArtists.map(artist => (
              <div
                key={artist.id}
                draggable
                onDragStart={() => handleDragStart(artist)}
                onClick={() => selectedCell && handleArtistSelect(artist.id)}
                className={cn(
                  'px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-sm cursor-move select-none',
                  'hover:bg-accent hover:text-accent-foreground transition-colors',
                  selectedCell && 'cursor-pointer'
                )}
              >
                {artist.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Grid */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 z-20 bg-card border-b border-r border-border p-2 text-left text-xs font-semibold uppercase tracking-wide w-24 md:w-32">
                    Time
                  </th>
                  {stages.map(stage => (
                    <th
                      key={stage}
                      className="border-b border-border p-2 text-left text-xs font-semibold uppercase tracking-wide min-w-32 md:min-w-40"
                    >
                      {stage}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time}>
                    <td className="sticky left-0 z-10 bg-card border-r border-border p-2 text-xs font-mono text-muted-foreground">
                      {time}
                    </td>
                    {stages.map(stage => {
                      const artist = getArtistForSlot(stage, time)
                      return (
                        <td
                          key={`${stage}-${time}`}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDrop(stage, time)}
                          onClick={() => handleCellClick(stage, time)}
                          className={cn(
                            'border-b border-border p-2 cursor-pointer transition-colors',
                            'hover:bg-secondary/50',
                            artist && 'bg-accent/20',
                            selectedCell?.stage === stage && selectedCell?.time === time && 'ring-2 ring-accent'
                          )}
                        >
                          {artist && (
                            <div className="flex items-center justify-between gap-1 group">
                              <span className="text-sm font-medium truncate">
                                {artist.name}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onScheduleChange(schedule.filter(s => s.artistId !== artist.id))
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                              </button>
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p className="hidden md:block">
          <strong>Desktop:</strong> Drag artists from above onto time slots, or click a slot then click an artist
        </p>
        <p className="md:hidden">
          <strong>Tap</strong> a time slot, then tap an artist to schedule
        </p>
      </div>
    </div>
  )
}
