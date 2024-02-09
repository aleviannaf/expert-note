import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { ChangeEvent, FormEvent, useState } from 'react';

interface NewNoteCardProps {
    onAdded: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onAdded }: NewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState<boolean>(true)
    const [isRecording, setIsRecording] = useState<boolean>(false)
    const [content, setContent] = useState<string>('')

    const handleStartEditor = () => {
        setShouldShowOnboarding(false)
    }

    const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value)

        if (event.target.value === '') {
            setShouldShowOnboarding(true)
        }

    }

    const handleSaveNote = (event: FormEvent) => {
        event.preventDefault()

        if (content === '') return

        onAdded(content)
        setContent('')
        setShouldShowOnboarding(true)
        toast.success('Nota criada com sucesso!')
    }

    const handleStartRecRecording = () => {


        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

        if (!isSpeechRecognitionAPIAvailable) {
            alert('Infelizmente seu navegador não suporta a API de gravação!')
            return
        }

        setIsRecording(true)
        setShouldShowOnboarding(false)

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition

        speechRecognition = new SpeechRecognitionAPI()

        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true //não para até eu clicar para parar
        speechRecognition.maxAlternatives = 1 //maximo uma alternativa de retorno
        speechRecognition.interimResults //tras os resultado conforme eu vou falando

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript)
            }, '')

            setContent(transcription)
        }

        speechRecognition.onerror = (event) => {
            console.error(event)
        }

        speechRecognition.start()



    }

    const handleStopRecRecording = () => {
        setIsRecording(false)

        if (speechRecognition !== null) {
            speechRecognition.stop()
        }

        if(!content){
            setShouldShowOnboarding(true)
        }
    }


    return (
        <Dialog.Root>
            <Dialog.Trigger className='rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'>
                <span className='text-sm font-medium text-slate-200'>
                    Adicionar nota
                </span>
                <p className='text-sm leading-6 text-slate-400'>
                    Grave uma nota em áudio que será convertida para texto automaticamente
                </p>

            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/50' />
                <Dialog.Content
                    className='fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2  md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'
                >
                    <Dialog.Close className='absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
                        <X className='size-5' />
                    </Dialog.Close>

                    <form className='flex flex-1 flex-col'>

                        <div className='flex flex-1 flex-col gap-3 p-5'>
                            <span className='text-sm font-medium text-slate-300 first-letter:uppercase'>
                                Adicionar nota
                            </span>

                            {
                                shouldShowOnboarding ? (
                                    <p className='text-sm leading-6 text-slate-400'>
                                        Comece <button
                                            type='button'
                                            onClick={handleStartRecRecording}
                                            className='font-medium text-lime-400 hover:underline'
                                        >gravando uma nota
                                        </button> em áudio ou se preferir <button
                                            type='button'
                                            className='font-medium text-lime-400 hover:underline'
                                            onClick={handleStartEditor}
                                        >utilize apenas texto</button>.
                                    </p>
                                ) : (
                                    <textarea
                                        value={content}
                                        autoFocus
                                        className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                                        onChange={handleContentChange}
                                    />
                                )
                            }

                        </div>

                        {
                            isRecording ? (
                                <button
                                    type="button"
                                    onClick={handleStopRecRecording}
                                    className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100 cursor-pointer'
                                >
                                    <div className='size-3 rounded-full bg-red-500 animate-pulse' />
                                    Gravando! (clique p/ interromper)
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSaveNote}
                                    className='w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500 cursor-pointer'
                                >
                                    Salvar nota
                                </button>
                            )
                        }
                    </form>
                </Dialog.Content>
            </Dialog.Portal>



        </Dialog.Root>
    )
}