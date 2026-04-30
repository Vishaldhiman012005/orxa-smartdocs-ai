import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Merge, Scissors, Minimize2, Image, Images, FileText, Upload, Download, Loader, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const TOOLS = [
  { id: 'merge', icon: Merge, label: 'Merge PDFs', desc: 'Combine multiple PDFs into one' },
  { id: 'split', icon: Scissors, label: 'Split PDF', desc: 'Extract specific pages' },
  { id: 'compress', icon: Minimize2, label: 'Compress PDF', desc: 'Reduce file size' },
  { id: 'pdf-to-images', icon: Image, label: 'PDF → Images', desc: 'Convert pages to PNG' },
  { id: 'images-to-pdf', icon: Images, label: 'Images → PDF', desc: 'Build PDF from images' },
  { id: 'word-to-pdf', icon: FileText, label: 'Word → PDF', desc: 'Convert .docx to PDF' },
]

function FileDrop({ multiple, accept, onChange, files }) {
  const ref = useRef()
  return (
    <div
      onClick={() => ref.current.click()}
      className="border-2 border-dashed border-white/20 hover:border-cyan-500/50 rounded-xl p-8 text-center cursor-pointer transition-all hover:bg-cyan-500/5"
    >
      <Upload size={28} className="mx-auto text-white/30 mb-3" />
      {files?.length > 0 ? (
        <div className="space-y-1">
          {Array.from(files).map((f, i) => (
            <p key={i} className="text-sm text-cyan-400 font-mono truncate max-w-xs mx-auto">{f.name}</p>
          ))}
        </div>
      ) : (
        <>
          <p className="text-white/50 text-sm">Click to upload {multiple ? 'files' : 'file'}</p>
          <p className="text-white/25 text-xs mt-1">{accept}</p>
        </>
      )}
      <input ref={ref} type="file" multiple={multiple} accept={accept} onChange={onChange} className="hidden" />
    </div>
  )
}

function ResultDownload({ filename, label }) {
  const handleDownload = async () => {
    try {
      const res = await api.get(`/api/download/${filename}`, { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url; a.download = label || filename; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('Download failed') }
  }
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/25">
      <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium">Processing complete!</p>
        <p className="text-xs text-white/40 truncate">{label}</p>
      </div>
      <button onClick={handleDownload} className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium transition-colors">
        <Download size={16} /> Download
      </button>
    </motion.div>
  )
}

export default function PDFTools() {
  const [active, setActive] = useState('merge')
  const [files, setFiles] = useState([])
  const [extra, setExtra] = useState({ pages: '', dpi: '150' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const reset = (tool) => { setActive(tool); setFiles([]); setResult(null); setExtra({ pages: '', dpi: '150' }) }

  const handleSubmit = async () => {
    if (!files.length) return toast.error('Please select file(s)')
    setLoading(true); setResult(null)
    try {
      const fd = new FormData()
      let endpoint = ''
      let resultLabel = ''

      switch (active) {
        case 'merge':
          if (files.length < 2) { toast.error('Select at least 2 PDFs'); setLoading(false); return }
          Array.from(files).forEach(f => fd.append('files', f))
          endpoint = '/api/merge-pdf'; resultLabel = 'merged.pdf'; break
        case 'split':
          fd.append('file', files[0])
          if (extra.pages) fd.append('pages', extra.pages)
          endpoint = '/api/split-pdf'; resultLabel = 'split_pages.zip'; break
        case 'compress':
          fd.append('file', files[0])
          endpoint = '/api/compress-pdf'; resultLabel = 'compressed.pdf'; break
        case 'pdf-to-images':
          fd.append('file', files[0])
          fd.append('dpi', extra.dpi)
          endpoint = '/api/pdf-to-images'; resultLabel = 'pages.zip'; break
        case 'images-to-pdf':
          Array.from(files).forEach(f => fd.append('files', f))
          fd.append('page_size', extra.page_size || 'A4')
          fd.append('orientation', extra.orientation || 'portrait')
          endpoint = '/api/images-to-pdf'; resultLabel = 'images.pdf'; break
        case 'word-to-pdf':
          fd.append('file', files[0])
          endpoint = '/api/word-to-pdf'; resultLabel = 'document.pdf'; break
      }

      const res = await api.post(endpoint, fd)
      setResult({ filename: res.data.filename, label: resultLabel, message: res.data.message })
      toast.success(res.data.message || 'Done!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed')
    } finally { setLoading(false) }
  }

  const tool = TOOLS.find(t => t.id === active)

  return (
    <div className="max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title mb-1">PDF Tools</h1>
        <p className="text-white/40 text-sm">Professional document operations — fast, secure, and free.</p>
      </motion.div>

      {/* Tool tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {TOOLS.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => reset(id)}
            className={`p-3 rounded-xl border text-center transition-all duration-200 ${
              active === id
                ? 'border-cyan-500/50 bg-cyan-500/15 text-cyan-400'
                : 'border-white/10 bg-white/3 text-white/50 hover:text-white hover:border-white/20'
            }`}
          >
            <Icon size={20} className="mx-auto mb-1.5" />
            <p className="text-xs font-medium font-display leading-tight">{label}</p>
          </button>
        ))}
      </div>

      {/* Active tool panel */}
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="glass-card p-6 space-y-5"
        >
          <div>
            <h2 className="section-title">{tool.label}</h2>
            <p className="text-white/40 text-sm">{tool.desc}</p>
          </div>

          <FileDrop
            multiple={['merge', 'images-to-pdf'].includes(active)}
            accept={active === 'images-to-pdf' ? 'image/*' : active === 'word-to-pdf' ? '.docx,.doc' : 'application/pdf'}
            files={files}
            onChange={e => { setFiles(e.target.files); setResult(null) }}
          />

          {active === 'split' && (
            <div>
              <label className="label">Page Range (optional)</label>
              <input className="input-field" placeholder="e.g. 1-3, 5, 7-9  (blank = all pages)"
                value={extra.pages} onChange={e => setExtra(p => ({ ...p, pages: e.target.value }))} />
            </div>
          )}

          {active === 'images-to-pdf' && (
  <div className="grid grid-cols-2 gap-4">

    {/* Page Size */}
    <div>
      <label className="label">Page Size</label>
      <select
        className="input-field"
        value={extra.page_size || "A4"}
        onChange={(e) =>
          setExtra(p => ({ ...p, page_size: e.target.value }))
        }
      >
        <option value="A4">A4</option>
        <option value="Letter">Letter</option>
      </select>
    </div>

    {/* Orientation */}
    <div>
      <label className="label">Orientation</label>
      <select
        className="input-field"
        value={extra.orientation || "portrait"}
        onChange={(e) =>
          setExtra(p => ({ ...p, orientation: e.target.value }))
        }
      >
        <option value="portrait">Portrait</option>
        <option value="landscape">Landscape</option>
      </select>
    </div>

  </div>
)}

          {result && <ResultDownload filename={result.filename} label={result.label} />}

          <button onClick={handleSubmit} disabled={loading} className="btn-cyan w-full flex items-center justify-center gap-2">
            {loading ? <Loader size={18} className="animate-spin" /> : <tool.icon size={18} />}
            {loading ? 'Processing…' : `Run ${tool.label}`}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
