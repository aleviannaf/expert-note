import { useState } from 'react';
import logo from './assets/logo-expert-notes.svg';
import { NewNoteCard } from './components/NewNoteCard.tsx';
import { NoteCard } from './components/NoteCard';

interface Note {
  id: string,
  date: Date,
  content: string
}


export function App() {
  const [note, setNote] = useState<Note[]>(()=>{
    const notesOnStorage = localStorage.getItem('notes')

    if(notesOnStorage){
      return JSON.parse(notesOnStorage)
    }
    return []
  })

  const onNoteCreated = (content: string) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }

    const notesArray = [newNote, ...note]

    setNote(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6'>
      <img src={logo} alt="logo da aplicação" />
      <form className='w-full'>
        <input
          type="text"
          placeholder='Busque em suas notas'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
        />
      </form>
      <div className='h-px bg-slate-700' />

      <div className='grid grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard onAdded={onNoteCreated}/>
        {
          note.map(note => {
            return <NoteCard key={note.id} note={note} />
          })
        }
      </div>
    </div>
  )
}


