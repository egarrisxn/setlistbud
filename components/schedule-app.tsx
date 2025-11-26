'use client'

import { useState, useEffect } from 'react'
import { ScheduleGrid } from './schedule-grid'
import { ArtistList } from './artist-list'
import { Button } from './ui/button'
import { CalendarDays, List } from 'lucide-react'

export type Artist = {
  id: string
  name: string
  stage?: string
  time?: string
}

export type ScheduleSlot = {
  stage: string
  time: string
  artistId?: string
}

const TIME_SLOTS = [
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
]

const STAGES = [
  'Vans Right Foot Stage',
  'Vans Left Foot Stage',
  'Geico Stage',
  'Owen\'s Mixer Stage',
  'Trojan Stage',
  'Club Wyndham Stage',
  'Beatbox Stage',
  'Ghost Stage',
  'Unplugged Stage',
  'Smartpunk Stage',
]

const MAIN_STAGE_ARTISTS = [
  '3OH!3',
  '408',
  'A Day To Remember',
  'A Loss For Words',
  'All Time Low',
  'Amigo The Devil',
  'Anberlin',
  'Angel Du$t',
  'Arrows In Action',
  'As It Is',
  'Attila',
  'August Burns Red',
  'Aviva',
  'Bad Rabbits',
  'Beauty School Dropout',
  'Better Lovers',
  'Big Ass Truck',
  'Black Veil Brides',
  'Blessthefall',
  'Boundaries',
  'Bowling For Soup',
  'Boys Like Girls',
  'Carolesdaughter',
  'Caskets',
  'Chained Saint',
  'Chandler Leighton',
  'Charlotte Sands',
  'Chiodos',
  'Comeback Kid',
  'Crown The Empire',
  'Deathbyromy',
  'Dinosaur Pile! Up',
  'Drain',
  'Escape The Fate',
  'Falling In Reverse',
  'Fame On Fire',
  'Fever 333',
  'Flycatcher',
  'Four Year Strong',
  'From Ashes To New',
  'Games We Play',
  'Girlfriends',
  'Good Riddance',
  'Gravas',
  'Gwar',
  'Gym Class Heroes',
  'Hail The Sun',
  'Hawthorne Heights',
  'Head Automatica',
  'Holding Absence',
  'Hollow Pact',
  'Holywatr',
  'Honey Revenge',
  'Huddy',
  'I Prevail',
  'I See Stars',
  'IDKHOW',
  'Jeremy Romance',
  'Johnnie Guilbert',
  'Julia Wolf',
  'Jutes',
  'Killswitch Engage',
  'Kim Dracula',
  'Knuckle Puck',
  'Koyo',
  'Lacey Sturm',
  'Left To Suffer',
  'Less Than Jake',
  'Letlive.',
  'Lil Lotus',
  'Magnolia Park',
  'Maryjo',
  'Mayday Parade',
  'Memphis May Fire',
  'MGK',
  'Microwave',
  'Millionaires',
  'Miss May I',
  'Mod Sun',
  'Motionless In White',
  'Movements',
  'Narrow Head',
  'Noelle Sucks',
  'New Years Day',
  'Not Enough Space',
  'Nothing, Nowhere.',
  'Of Mice & Men',
  'Oxymorrons',
  'Pennywise',
  'People R Ugly',
  'Plain White T\'s',
  'Point North',
  'Royal & The Serpent',
  'Sace6',
  'Scene Queen',
  'Scowl',
  'Senses Fail',
  'Slaughter To Prevail',
  'Sophie Powers',
  'Speed Of Light',
  'State Champs',
  'Story Of The Year',
  'Stratejacket',
  'Streetlight Manifesto',
  'Sueco',
  'Sunami',
  'Surfer Girl',
  'Taylor Acorn',
  'Ten56.',
  'The Dark',
  'The Devil Wears Prada',
  'The Dollyrots',
  'The Elovaters',
  'The Expendables',
  'The Ghost Inside',
  'The Home Team',
  'The Interrupters',
  'The Maine',
  'The Red Jumpsuit Apparatus',
  'The Wonder Years',
  'The Word Alive',
  'Thursday',
  'Traitors',
  'Trxvis',
  'Vended',
  'Wage War',
  'Waves',
  'We The Kings',
  'Winona Fighter',
  'World\'s First Cinema',
  'Yellowcard',
  'Yung Gravy',
  'Zero 9:36',
]

const UNPLUGGED_STAGE_ARTISTS = [
  'Anna Valenzuela',
  'Beebs',
  'Bryce Wettstein',
  'Charlotte Sands (unplugged)',
  'Coolie Ranx',
  'Dan Kelly',
  'Divina Jasso & Helena Holleran',
  'Geoff Weers',
  'Gritty in Pink',
  'Jaret Ray Reddick',
  'Jon Gazi',
  'Kat Halll',
  'Kristin Lytie',
  'Myverse',
  'Niko Is',
  'Reverie',
]

const SMARTPUNK_STAGE_ARTISTS = [
  'Gilt',
  'Glazed',
  'Hungover',
  'Keep Flying',
  'School of Rock',
  'Watts',
  'Wounded Touch',
]

const INITIAL_ARTISTS: Artist[] = [
  ...MAIN_STAGE_ARTISTS.map((name, idx) => ({ id: `main-${idx}`, name })),
  ...UNPLUGGED_STAGE_ARTISTS.map((name, idx) => ({ id: `unplugged-${idx}`, name })),
  ...SMARTPUNK_STAGE_ARTISTS.map((name, idx) => ({ id: `smartpunk-${idx}`, name })),
]

export function ScheduleApp() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [artists, setArtists] = useState<Artist[]>(INITIAL_ARTISTS)
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedArtists = localStorage.getItem('warped-artists')
    const savedSchedule = localStorage.getItem('warped-schedule')
    
    if (savedArtists) {
      setArtists(JSON.parse(savedArtists))
    }
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule))
    }
    
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('warped-artists', JSON.stringify(artists))
      localStorage.setItem('warped-schedule', JSON.stringify(schedule))
    }
  }, [artists, schedule, isLoaded])

  const handleScheduleChange = (newSchedule: ScheduleSlot[]) => {
    setSchedule(newSchedule)
    
    // Update artists with their scheduled times
    const updatedArtists = artists.map(artist => {
      const slot = newSchedule.find(s => s.artistId === artist.id)
      if (slot) {
        return { ...artist, stage: slot.stage, time: slot.time }
      }
      return { ...artist, stage: undefined, time: undefined }
    })
    setArtists(updatedArtists)
  }

  const handleAddArtist = (name: string) => {
    const newArtist: Artist = {
      id: Date.now().toString(),
      name,
    }
    setArtists([...artists, newArtist])
  }

  const handleRemoveArtist = (id: string) => {
    setArtists(artists.filter(a => a.id !== id))
    setSchedule(schedule.filter(s => s.artistId !== id))
  }

  const handleReset = () => {
    if (confirm('Reset all data? This will clear your schedule and restore the original artist list.')) {
      localStorage.removeItem('warped-artists')
      localStorage.removeItem('warped-schedule')
      setArtists(INITIAL_ARTISTS)
      setSchedule([])
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const scheduledCount = artists.filter(a => a.stage && a.time).length
  const unscheduledCount = artists.length - scheduledCount

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="px-4 py-3 md:py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div>
              <h1 className="text-lg md:text-xl font-bold font-mono tracking-tight">
                WARPED TOUR
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {scheduledCount}/{artists.length} scheduled
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('grid')}
              >
                <CalendarDays className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Grid</span>
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView('list')}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">List</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="hidden sm:flex"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="p-2 md:p-4">
        {view === 'grid' ? (
          <ScheduleGrid
            artists={artists}
            schedule={schedule}
            onScheduleChange={handleScheduleChange}
            stages={STAGES}
            timeSlots={TIME_SLOTS}
          />
        ) : (
          <ArtistList
            artists={artists}
            onAddArtist={handleAddArtist}
            onRemoveArtist={handleRemoveArtist}
          />
        )}
      </main>
    </div>
  )
}
