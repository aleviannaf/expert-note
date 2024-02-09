import { ChangeEvent, useState } from 'react';
import logo from './assets/logo.svg';
import { NewNoteCard } from './components/NewNoteCard.tsx';
import { NoteCard } from './components/NoteCard';

interface Note {
  id: string,
  date: Date,
  content: string
}


export function App() {
  const [search, setSearch ] = useState<string>('')
  const [notes, setNotes] = useState<Note[]>(()=>{
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

    const notesArray = [newNote, ...notes]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) =>{
    const query = event.target.value

    setSearch(query)
  }

  const onNoteDeleted = (id: string) =>{
    const notesArray = notes.filter(note => {
      return note.id !== id
    })

    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  const filterNotes = search !== '' 
  ? notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase()))
  : notes;

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
      <img className='h-7' src={logo} alt="logo da aplicação" />
      <form className='w-full'>
        <input
          value={search}
          onChange={handleSearch}
          type="text"
          placeholder='Busque em suas notas'
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
        />
      </form>
      <div className='h-px bg-slate-700' />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'>
        <NewNoteCard onAdded={onNoteCreated}/>
        {
          filterNotes.map(note => {
            return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
          })
        }
      </div>
    </div>
  )
}


