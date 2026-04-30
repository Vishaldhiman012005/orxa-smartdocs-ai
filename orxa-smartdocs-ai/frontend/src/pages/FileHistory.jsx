import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { History, FileText, Download, Search, Loader } from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const OPERATION_LABELS = {
  create_pdf: 'Created PDF', merge_pdf: 'Merged PDFs', split_pdf: 'Split PDF',
  compress_pdf: 'Compressed PDF', pdf_to_images: 'PDF → Images',
  images_to_pdf: 'Images → PDF', word_to_pdf: 'Word → PDF',
}
const OP_COLORS = {
  create_pdf: 'text-cyan-400 bg-cyan-500/15', merge_pdf: 'text-purple-400 bg-purple-500/15',
  split_pdf: 'text-amber-400 bg-amber-500/15', compress_pdf: 'text-green-400 bg-green-500/15',
  pdf_to_images: 'text-blue-400 bg-blue-500/15', images_to_pdf: 'text-pink-400 bg-pink-500/15',
  word_to_pdf: 'text-orange-400 bg-orange-500/15',
}

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function FileHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/api/history')
      .then(r => setHistory(r.data))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false))
  }, [])

  const handleDownload = async (filename, original) => {
    try {
      const res = await api.get(`/api/download/${filename}`, { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url; a.download = original || filename; a.click()
      URL.revokeObjectURL(url)
    } catch { toast.error('File no longer available') }
  }

  const filtered = history.filter(f =>
    !search || (f.original_name || f.filename).toLowerCase().includes(search.toLowerCase()) ||
    (OPERATION_LABELS[f.operation] || f.operation).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <History className="text-cyan-400" size={26} />
          <h1 className="page-title">File History</h1>
        </div>
        <p className="text-white/40 text-sm">All documents you've created and processed.</p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          className="input-field pl-10"
          placeholder="Search by filename or operation…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="glass-card overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center text-white/30 gap-3">
            <Loader size={28} className="animate-spin" />
            <p className="text-sm">Loading history…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-white/20 gap-3">
            <History size={36} />
            <p className="text-sm">{search ? 'No matching files found' : 'No files processed yet'}</p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/8 text-xs font-mono text-white/30 uppercase tracking-wider">
              <div className="col-span-5">File</div>
              <div className="col-span-3">Operation</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            <div className="divide-y divide-white/8">
              {filtered.map((f, i) => (
                <motion.div key={f.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/3 transition-colors"
                >
                  <div className="col-span-12 sm:col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                      <FileText size={14} className="text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{f.original_name || f.filename}</p>
                      <p className="text-xs text-white/30 font-mono">{new Date(f.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${OP_COLORS[f.operation] || 'text-white/40 bg-white/10'}`}>
                      {OPERATION_LABELS[f.operation] || f.operation}
                    </span>
                  </div>
                  <div className="col-span-4 sm:col-span-2 text-xs text-white/40 font-mono">{formatSize(f.file_size)}</div>
                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={() => handleDownload(f.filename, f.original_name)}
                      className="p-2 rounded-lg text-white/40 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                      title="Download"
                    >
                      <Download size={15} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      <p className="text-white/25 text-xs text-center font-mono">{filtered.length} file{filtered.length !== 1 ? 's' : ''} found</p>
    </div>
  )
}
