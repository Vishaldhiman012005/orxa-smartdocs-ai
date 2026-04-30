import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Upload, Send, BookOpen, ListOrdered, Languages, Loader, AlertCircle, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const TABS = [
  { id: 'ask', icon: Send, label: 'Ask PDF' },
  { id: 'summarize', icon: BookOpen, label: 'Summarize' },
  { id: 'notes', icon: ListOrdered, label: 'Exam Notes' },
  { id: 'points', icon: Sparkles, label: 'Key Points' },
  { id: 'translate', icon: Languages, label: 'Translate' },
]

export default function AIAssistant() {
  const [tab, setTab] = useState('ask')
  const [file, setFile] = useState(null)
  const [question, setQuestion] = useState('')
  const [direction, setDirection] = useState('en_to_hi')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const fileRef = useRef()

  const reset = (t) => { setTab(t); setResult(null); setError(null) }

  const handleRun = async () => {
    if (!file) return toast.error('Please upload a PDF first')
    if (tab === 'ask' && !question.trim()) return toast.error('Please enter a question')
    setLoading(true); setResult(null); setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('mode', tab)
      fd.append('question', question)
      let res
      res = await api.post('/api/ask-pdf', fd)
      setResult(res.data.answer)
    } catch (err) {
      const msg = err.response?.data?.error || 'AI request failed'
      setError(msg)
      toast.error(msg)
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Bot className="text-cyan-400" size={26} />
          <h1 className="page-title">AI PDF Assistant</h1>
        </div>
        <p className="text-white/40 text-sm">Upload a PDF and use AI to ask questions, summarize, generate notes, and translate.</p>
      </motion.div>

      {/* Mode tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => reset(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium font-display transition-all ${
              tab === id
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
                : 'border border-white/10 text-white/50 hover:text-white hover:border-white/20'
            }`}
          >
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6 space-y-5">

          {/* File upload */}
          <div>
            <label className="label">Upload PDF</label>
            <div
              onClick={() => fileRef.current.click()}
              className="border-2 border-dashed border-white/15 hover:border-cyan-500/40 rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-cyan-500/5"
            >
              <Upload size={24} className="mx-auto text-white/30 mb-2" />
              {file ? (
                <p className="text-cyan-400 text-sm font-mono">{file.name}</p>
              ) : (
                <><p className="text-white/40 text-sm">Click to upload PDF</p>
                  <p className="text-white/20 text-xs mt-1">Max 20MB</p></>
              )}
            </div>
            <input ref={fileRef} type="file" accept="application/pdf" onChange={e => { setFile(e.target.files[0]); setResult(null) }} className="hidden" />
          </div>

          {/* Ask question */}
          <AnimatePresence>
            {tab === 'ask' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <label className="label">Your Question</label>
                <textarea
                  className="input-field min-h-24 resize-none"
                  placeholder="What is the main topic of this document? What are the key findings?"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  rows={4}
                />
              </motion.div>
            )}
            {tab === 'translate' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <label className="label">Translation Direction</label>
                <select className="input-field" value={direction} onChange={e => setDirection(e.target.value)}>
                  <option value="en_to_hi">English → Hindi</option>
                  <option value="hi_to_en">Hindi → English</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mode descriptions */}
          {tab === 'summarize' && <p className="text-white/35 text-sm p-3 bg-white/3 rounded-lg border border-white/8">Creates a clear, concise summary of your entire PDF document.</p>}
          {tab === 'notes' && <p className="text-white/35 text-sm p-3 bg-white/3 rounded-lg border border-white/8">Generates structured exam notes with headings and key points for studying.</p>}
          {tab === 'points' && <p className="text-white/35 text-sm p-3 bg-white/3 rounded-lg border border-white/8">Extracts the 10 most important points from your document.</p>}

          <button onClick={handleRun} disabled={loading} className="btn-cyan w-full flex items-center justify-center gap-2">
            {loading ? <Loader size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? 'AI Processing…' : 'Run AI Analysis'}
          </button>
        </motion.div>

        {/* Result panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Bot size={16} className="text-cyan-400" />
            <span className="section-title text-base">AI Response</span>
          </div>

          <div className="flex-1 min-h-64">
            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-white/30 gap-3">
                <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                <p className="text-sm">AI is analyzing your document…</p>
              </div>
            )}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 p-4">
                <AlertCircle size={28} className="text-red-400" />
                <p className="text-red-400 text-sm font-medium">AI Unavailable</p>
                <p className="text-white/40 text-xs leading-relaxed">{error}</p>
                {error.includes('API_KEY') && (
                  <div className="text-xs text-white/30 bg-white/5 p-3 rounded-lg text-left w-full mt-2">
                    <p className="font-mono">Add to backend .env:</p>
                    <p className="font-mono text-cyan-400 mt-1">ANTHROPIC_API_KEY=sk-ant-...</p>
                  </div>
                )}
              </div>
            )}
            {result && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-96 pr-2">
                {result}
              </motion.div>
            )}
            {!result && !loading && !error && (
              <div className="h-full flex flex-col items-center justify-center text-white/20 gap-3">
                <Bot size={36} />
                <p className="text-sm text-center">Upload a PDF and run an AI mode<br />to see results here.</p>
              </div>
            )}
          </div>

          {result && (
            <button
              onClick={() => navigator.clipboard.writeText(result).then(() => toast.success('Copied!'))}
              className="mt-4 btn-outline text-sm py-2 text-xs"
            >
              Copy Result
            </button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
