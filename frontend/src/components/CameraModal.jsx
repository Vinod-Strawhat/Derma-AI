import { useEffect, useRef, useState } from 'react'
import { Camera, CameraOff, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function CameraModal({ onCapture, onClose }) {
  const { t } = useLanguage()
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 1280 } },
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setReady(true)
        }
      } catch (err) {
        setError(t('camera.error'))
      }
    }

    startCamera()

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  function handleCapture() {
    const video = videoRef.current
    if (!video || !ready) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
        onCapture({ file, source: 'camera' })
      }
      onClose()
    }, 'image/jpeg', 0.92)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md card p-6 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{t('camera.useCamera')}</h3>
          <button
            onClick={onClose}
            aria-label={t('camera.closeAria')}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error ? (
          <div className="flex flex-col items-center text-center py-8">
            <CameraOff className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-sm text-gray-600 mb-6">{error}</p>
            <button onClick={onClose} className="btn-secondary !px-6 !py-2.5 text-sm">
              {t('camera.close')}
            </button>
          </div>
        ) : (
          <>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-900 mb-4">
              <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
              {!ready && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-gray-400">{t('camera.starting')}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="btn-secondary flex-1 !py-2.5 text-sm">
                {t('camera.cancel')}
              </button>
              <button
                onClick={handleCapture}
                disabled={!ready}
                className="btn-primary flex-1 !py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera className="w-4 h-4 mr-2" />
                {t('camera.capture')}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              {t('camera.footnote')}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default CameraModal