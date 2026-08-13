import { useRef, useState } from 'react'
import { AlertCircle, Camera, ImagePlus, RefreshCw, Trash2, Upload, X } from 'lucide-react'
import CameraModal from './CameraModal'
import { useLanguage } from '../context/LanguageContext'

const MAX_IMAGE_SIZE = 15 * 1024 * 1024

function SkinImageInput({ image, previewUrl, source, onImageChange, onImageRemove }) {
  const { t } = useLanguage()
  const fileInputRef = useRef(null)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) {
      e.target.value = ''
      return
    }

    const isImage = file.type.startsWith('image/')
    if (!isImage || file.size > MAX_IMAGE_SIZE) {
      setUploadError(t('errors.badImage'))
      e.target.value = ''
      return
    }

    setUploadError(null)
    onImageChange({ file, source: 'upload' })
    e.target.value = ''
  }

  function openCamera() {
    if (navigator.mediaDevices?.getUserMedia) {
      setCameraOpen(true)
    } else {
      fileInputRef.current?.click()
    }
  }

  return (
    <div>
      {image ? (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-900">
          <img src={previewUrl} alt={t('skinimage.selectedAlt')} className="w-full h-64 md:h-72 object-cover" />

          <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-gray-700">
            <ImagePlus className="w-3.5 h-3.5 mr-1.5 text-primary-600" />
            {source === 'camera' ? t('skinimage.cameraCapture') : t('skinimage.uploadedImage')}
          </span>

          <div className="absolute bottom-3 right-3 flex flex-col sm:flex-row gap-2">
            <button
              onClick={openCamera}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/90 backdrop-blur text-xs font-medium text-gray-700 hover:bg-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t('skinimage.retake')}
            </button>
            <button
              onClick={onImageRemove}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/90 backdrop-blur text-xs font-medium text-red-600 hover:bg-white transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t('skinimage.remove')}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[16rem] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
            <Camera className="w-7 h-7 text-primary-600" />
          </div>

          <p className="text-sm text-gray-600 mb-1">{t('skinimage.noImage')}</p>
          <p className="text-xs text-gray-400 mb-6">{t('skinimage.chooseOption')}</p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary !px-6 !py-3 text-sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              {t('skinimage.uploadImage')}
            </button>
            <button onClick={openCamera} className="btn-primary !px-6 !py-3 text-sm">
              <Camera className="w-4 h-4 mr-2" />
              {t('skinimage.useCamera')}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      <p className="flex items-start gap-2 mt-3 text-xs text-gray-400">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
        {t('skinimage.photoTip')}
      </p>

      {uploadError && (
        <div className="flex items-start gap-2.5 mt-3 rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-700 flex-1">{uploadError}</p>
          <button
            onClick={() => setUploadError(null)}
            aria-label={t('errors.dismiss')}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {cameraOpen && (
        <CameraModal
          onCapture={onImageChange}
          onClose={() => setCameraOpen(false)}
        />
      )}
    </div>
  )
}

export default SkinImageInput