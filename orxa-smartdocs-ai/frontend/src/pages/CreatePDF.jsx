import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FilePlus, Download, Eye, ImagePlus, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const PAGE_SIZES = ['A4', 'A5', 'Letter', 'Custom']
const FONTS = ['Helvetica', 'Times', 'Courier']
const ALIGNMENTS = ['left', 'center', 'right', 'justify']

export default function CreatePDF() {
  const [form, setForm] = useState({
    title: '', content: '', filename: 'my-document',
    page_size: 'A4', orientation: 'portrait',
    custom_width: '', custom_height: '',
    margin: 20, font_size: 12,
    font_style: 'Helvetica', text_align: 'left',
  })
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const fileRef = useRef()

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleImageChange = (e) => {
  const files = Array.from(e.target.files)
  if (!files.length) return

  setImages(prev => [...prev, ...files])
  setImagePreviews(prev => [
    ...prev,
    ...files.map(file => URL.createObjectURL(file))
  ])
}
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      images.forEach(img => fd.append('images', img))
      const res = await api.post('/api/create-pdf', fd)
      setResult(res.data.filename)
      toast.success('PDF created successfully!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create PDF')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const res = await api.get(`/api/download/${result}`, { responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = `${form.filename}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Download failed')
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <FilePlus className="text-cyan-400" size={26} />
          <h1 className="page-title">Create PDF</h1>
        </div>
        <p className="text-white/40 text-sm">Design a professional PDF document with full control over layout and content.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleSubmit} className="glass-card p-6 space-y-5">

          <div>
            <label className="label">Document Title</label>
            <input className="input-field" placeholder="My Document" value={form.title} onChange={set('title')} />
          </div>

          <div>
            <label className="label">Content</label>
            <textarea
              className="input-field min-h-32 resize-y"
              placeholder="Write your document content here..."
              value={form.content} onChange={set('content')} rows={6}
            />
          </div>

          <div>
            <label className="label">Output Filename</label>
            <div className="flex items-center gap-2">
              <input className="input-field" placeholder="my-document" value={form.filename} onChange={set('filename')} />
              <span className="text-white/30 text-sm font-mono whitespace-nowrap">.pdf</span>
            </div>
          </div>

          {/* Page settings row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Page Size</label>
              <select className="input-field" value={form.page_size} onChange={set('page_size')}>
                {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Orientation</label>
              <select className="input-field" value={form.orientation} onChange={set('orientation')}>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>

          {form.page_size === 'Custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Width (mm)</label>
                <input className="input-field" type="number" placeholder="210" value={form.custom_width} onChange={set('custom_width')} />
              </div>
              <div>
                <label className="label">Height (mm)</label>
                <input className="input-field" type="number" placeholder="297" value={form.custom_height} onChange={set('custom_height')} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Margin (mm)</label>
              <input className="input-field" type="number" min="0" max="60" value={form.margin} onChange={set('margin')} />
            </div>
            <div>
              <label className="label">Font Size</label>
              <input className="input-field" type="number" min="8" max="72" value={form.font_size} onChange={set('font_size')} />
            </div>
            <div>
              <label className="label">Alignment</label>
              <select className="input-field" value={form.text_align} onChange={set('text_align')}>
                {ALIGNMENTS.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Font Style</label>
            <select className="input-field" value={form.font_style} onChange={set('font_style')}>
              {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* Image upload */}
          <div>
            <label className="label">Add Image (optional)</label>
            <button type="button" onClick={() => fileRef.current.click()}
              className="btn-outline w-full py-2.5 text-sm flex items-center justify-center gap-2">
              <ImagePlus size={16} />
              {images.length ? `${images.length} images selected` : 'Choose Images'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
          </div>

          <button type="submit" disabled={loading} className="btn-cyan w-full flex items-center justify-center gap-2">
            {loading ? <Loader size={18} className="animate-spin" /> : <FilePlus size={18} />}
            {loading ? 'Generating PDF…' : 'Generate PDF'}
          </button>

          {result && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              type="button"
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 font-display font-semibold py-3 rounded-xl transition-all"
            >
              <Download size={18} /> Download {form.filename}.pdf
            </motion.button>
          )}
        </motion.form>

        {/* Live Preview */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Eye size={16} className="text-cyan-400" />
            <span className="section-title text-base">Live Preview</span>
          </div>

          <div
            className="flex-1 rounded-xl border border-white/10 bg-white p-6 min-h-80 overflow-auto"
            style={{ fontFamily: form.font_style === 'Times' ? 'Georgia, serif' : form.font_style === 'Courier' ? 'monospace' : 'Arial, sans-serif' }}
          >
            {imagePreviews.length > 0 && (
  <div className="grid grid-cols-2 gap-3 mb-4">
    {imagePreviews.map((src, i) => (
      <img
        key={i}
        src={src}
        className="max-w-full h-auto rounded"
        style={{ maxHeight: 140 }}
      />
    ))}
  </div>
)}
            {form.title && (
              <h2 className="font-bold mb-3" style={{ fontSize: `${parseInt(form.font_size) + 6}px`, textAlign: 'center', color: '#0a0f1e' }}>
                {form.title}
              </h2>
            )}
            {form.content ? (
              <div style={{ fontSize: `${form.font_size}px`, textAlign: form.text_align, color: '#1a1a2e', lineHeight: 1.6 }}>
                {form.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-1">{line || '\u00A0'}</p>
                ))}
              </div>
            ) : (
              <p style={{ color: '#999', fontSize: '13px', textAlign: 'center', marginTop: '40px' }}>
                Your content will appear here…
              </p>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-mono text-white/40">
            <span>Size: {form.page_size}{form.page_size === 'Custom' ? ` ${form.custom_width}×${form.custom_height}mm` : ''}</span>
            <span>Orientation: {form.orientation}</span>
            <span>Font: {form.font_style} {form.font_size}px</span>
            <span>Margin: {form.margin}mm</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
