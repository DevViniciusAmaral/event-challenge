import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/browser'
import type { IScannerControls } from '@zxing/browser'
import { Camera, CameraOff, QrCode } from 'lucide-react'
import { Button } from './ui/button'
import { Label } from './ui/label'

interface QrCodeScannerProps {
  onCodeDetected: (code: string) => void
  disabled?: boolean
}

type ScanStatus = 'idle' | 'starting' | 'scanning' | 'error'

const waitForVideoEl = (
  getVideo: () => HTMLVideoElement | null,
  timeoutMs = 3000,
) =>
  new Promise<HTMLVideoElement>((resolve, reject) => {
    const start = Date.now()
    const tick = () => {
      const el = getVideo()
      if (el) {
        resolve(el)
        return
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error('video-element-timeout'))
        return
      }
      window.requestAnimationFrame(tick)
    }
    tick()
  })

type CameraAvailability =
  | 'checking'
  | 'available'
  | 'unavailable'
  | 'insecure-context'
  | 'unsupported-api'

export function QrCodeScanner({ onCodeDetected, disabled }: QrCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const statusRef = useRef<ScanStatus>('idle')
  const onCodeDetectedRef = useRef(onCodeDetected)
  const startingRef = useRef(false)

  const [status, setStatus] = useState<ScanStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [torchSupported, setTorchSupported] = useState(false)
  const [torchOn, setTorchOn] = useState(false)
  const [cameraAvailability, setCameraAvailability] =
    useState<CameraAvailability>('checking')
  const [unavailabilityReason, setUnavailabilityReason] = useState<string>('')

  useEffect(() => {
    onCodeDetectedRef.current = onCodeDetected
  }, [onCodeDetected])

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    let cancelled = false
    const md = (navigator as unknown as { mediaDevices?: MediaDevices })
      .mediaDevices
    const isSecure =
      typeof window !== 'undefined' &&
      (window.isSecureContext ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1')

    if (!isSecure) {
      setCameraAvailability('insecure-context')
      setUnavailabilityReason(
        'Acesso à câmera requer conexão segura (HTTPS) ou localhost.',
      )
      return
    }

    if (!md || typeof md.getUserMedia !== 'function') {
      setCameraAvailability('unsupported-api')
      setUnavailabilityReason(
        'Este navegador não suporta acesso à câmera (MediaDevices API indisponível).',
      )
      return
    }

    const check = async () => {
      try {
        const devices = await md.enumerateDevices()
        const videoInputs = devices.filter((d) => d.kind === 'videoinput')
        if (cancelled) return
        if (videoInputs.length === 0) {
          setCameraAvailability('unavailable')
          setUnavailabilityReason(
            'Nenhuma câmera foi detectada neste dispositivo. A leitura por QR Code via câmera não está disponível.',
          )
        } else {
          setCameraAvailability('available')
          setUnavailabilityReason('')
        }
      } catch {
        if (cancelled) return
        setCameraAvailability('available')
        setUnavailabilityReason('')
      }
    }

    const listener = () => {
      void check()
    }
    md.addEventListener('devicechange', listener)
    void check()

    return () => {
      cancelled = true
      md.removeEventListener('devicechange', listener)
    }
  }, [])

  const stopScanner = () => {
    try {
      if (controlsRef.current) {
        controlsRef.current.stop()
        controlsRef.current = null
      }
    } catch {
      // noop
    }
    startingRef.current = false
    setTorchOn(false)
    setTorchSupported(false)
    setStatus('idle')
  }

  const runScanner = async () => {
    if (startingRef.current) return
    startingRef.current = true
    setErrorMessage('')

    try {
      const video = await waitForVideoEl(() => videoRef.current, 4000)

      if (!readerRef.current) {
        readerRef.current = new BrowserMultiFormatReader()
      }

      const controls = await readerRef.current.decodeFromVideoDevice(
        undefined,
        video,
        (result, _err, ctrl) => {
          const st = statusRef.current
          if (st !== 'scanning' && st !== 'starting') return
          if (result && result.getText()) {
            const code = result.getText().trim()
            if (code) {
              try {
                ctrl.stop()
              } catch {
                // noop
              }
              controlsRef.current = null
              startingRef.current = false
              setTorchOn(false)
              setTorchSupported(false)
              setStatus('idle')
              onCodeDetectedRef.current(code)
            }
          }
        },
      )

      controlsRef.current = controls

      try {
        const stream = video.srcObject as MediaStream | null
        if (stream) {
          const tracks = stream.getVideoTracks()
          if (tracks.length > 0) {
            const track = tracks[0]
            const settings = track.getSettings()
            const hasTorch =
              typeof (settings as unknown as { torch?: boolean }).torch ===
              'boolean'
            if (hasTorch) setTorchSupported(true)

            const getCap = track as unknown as {
              getCapabilities?: () => { torch?: boolean }
            }
            const cap = getCap.getCapabilities
              ? getCap.getCapabilities()
              : undefined
            if (cap && typeof cap.torch === 'boolean' && cap.torch) {
              setTorchSupported(true)
            }
          }
        }
      } catch {
        // noop - torch support detection is optional
      }

      setStatus('scanning')
    } catch (err) {
      startingRef.current = false
      try {
        if (controlsRef.current) {
          controlsRef.current.stop()
          controlsRef.current = null
        }
      } catch {
        // noop
      }

      let friendly: string
      if (err instanceof Error && err.message === 'video-element-timeout') {
        friendly =
          'Não foi possível inicializar a câmera. Recarregue a página e tente novamente.'
      } else {
        const msg =
          err instanceof Error
            ? err.message
            : 'Não foi possível acessar a câmera.'
        const lower = msg.toLowerCase()

        friendly = msg
        if (
          lower.includes('permission') ||
          lower.includes('denied') ||
          lower.includes('not allowed') ||
          lower.includes('permissão') ||
          lower.includes('negada')
        ) {
          friendly =
            'Permissão de câmera negada. Habilite a câmera nas configurações do navegador e recarregue a página.'
        } else if (
          lower.includes('notfound') ||
          lower.includes('not found') ||
          lower.includes('device') ||
          lower.includes('no input') ||
          lower.includes('não encontrado')
        ) {
          friendly =
            'Nenhuma câmera foi encontrada no dispositivo. Verifique se há uma câmera conectada e habilitada.'
        } else if (
          lower.includes('notreadable') ||
          lower.includes('track') ||
          lower.includes('in use') ||
          lower.includes('em uso')
        ) {
          friendly =
            'Câmera está em uso por outro aplicativo. Feche outras janelas ou apps que possam estar usando a câmera e tente novamente.'
        } else if (
          lower.includes('overconstrained') ||
          lower.includes('constraint')
        ) {
          friendly =
            'Configurações da câmera não suportadas. Tente novamente em outro dispositivo.'
        } else if (lower.includes('abort') || lower.includes('aborted')) {
          friendly = 'Acesso à câmera foi interrompido. Tente novamente.'
        }
      }

      setErrorMessage(friendly)
      setStatus('error')
    }
  }

  const startScanner = async () => {
    if (disabled || status === 'starting' || status === 'scanning') return
    if (startingRef.current) return

    const isSecure =
      typeof window !== 'undefined' &&
      (window.isSecureContext ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1')

    const hasMediaDevices = !!(
      typeof navigator !== 'undefined' &&
      (navigator as unknown as { mediaDevices?: MediaDevices }).mediaDevices &&
      typeof (navigator.mediaDevices as unknown as { getUserMedia?: unknown })
        .getUserMedia === 'function'
    )

    if (!isSecure) {
      setErrorMessage(
        'Acesso à câmera requer conexão segura (HTTPS) ou localhost.',
      )
      setStatus('error')
      return
    }

    if (!hasMediaDevices) {
      setErrorMessage('Câmera não disponível neste navegador/dispositivo.')
      setStatus('error')
      return
    }

    setStatus('starting')
  }

  useEffect(() => {
    if (status !== 'starting') return
    void runScanner()
  }, [status])

  const toggleTorch = async () => {
    const video = videoRef.current
    const stream = (video?.srcObject as MediaStream | null) ?? null
    const track = stream?.getVideoTracks()[0]
    if (!track) return
    try {
      const next = !torchOn
      // @ts-expect-error - torch constraint is non-standard
      await track.applyConstraints({ advanced: [{ torch: next }] })
      setTorchOn(next)
    } catch {
      // noop
    }
  }

  useEffect(() => {
    return () => {
      try {
        if (controlsRef.current) {
          controlsRef.current.stop()
          controlsRef.current = null
        }
      } catch {
        // noop
      }
      startingRef.current = false
    }
  }, [])

  const isActive = status === 'starting' || status === 'scanning'
  const cameraDisabled = cameraAvailability !== 'available'

  if (cameraAvailability === 'checking') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-zinc-500">
            Validar por QR Code
          </Label>
        </div>
        <div className="relative w-full overflow-hidden border border-dashed rounded-lg bg-zinc-900 aspect-[4/1] border-zinc-200 flex items-center justify-center gap-2 text-xs text-zinc-400">
          <QrCode className="h-4 w-4" />
          <span>Verificando câmera...</span>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" disabled className="flex-1">
            <Camera className="mr-2 h-4 w-4" />
            Escanear QR Code
          </Button>
        </div>
      </div>
    )
  }

  if (cameraDisabled) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-zinc-500">
            Validar por QR Code
          </Label>
        </div>
        <div className="relative w-full overflow-hidden border rounded-lg bg-zinc-900 aspect-[4/1] border-zinc-200 flex items-center justify-center gap-2 text-xs text-zinc-500 px-3 text-center">
          <CameraOff className="h-4 w-4 shrink-0" />
          <span>{unavailabilityReason || 'Leitura por câmera indisponível.'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-zinc-500">
          Validar por QR Code
        </Label>
        {status === 'scanning' && torchSupported && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleTorch}
            disabled={disabled}
            className="h-7 px-2 text-xs"
          >
            {torchOn ? 'Desligar lanterna' : 'Ligar lanterna'}
          </Button>
        )}
      </div>

      <div
        className={`relative w-full overflow-hidden border rounded-lg bg-zinc-900 ${
          isActive ? 'aspect-video' : 'aspect-[4/1] border-dashed'
        } border-zinc-200`}
      >
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          controls={false}
          className={`h-full w-full object-cover ${
            isActive ? 'block' : 'hidden'
          }`}
          webkit-playsinline="true"
          x5-playsinline="true"
        />
        {isActive ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[55%] w-[65%] border-2 border-white/80 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]">
              <div className="absolute -top-1 -left-1 h-5 w-5 border-t-4 border-l-4 border-emerald-400 rounded-tl-md" />
              <div className="absolute -top-1 -right-1 h-5 w-5 border-t-4 border-r-4 border-emerald-400 rounded-tr-md" />
              <div className="absolute -bottom-1 -left-1 h-5 w-5 border-b-4 border-l-4 border-emerald-400 rounded-bl-md" />
              <div className="absolute -bottom-1 -right-1 h-5 w-5 border-b-4 border-r-4 border-emerald-400 rounded-br-md" />
            </div>
          </div>
        ) : null}
        {isActive ? (
          <div className="absolute top-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-black/60 text-white text-[10px] font-medium px-2 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="uppercase tracking-wider">
              {status === 'starting' ? 'Iniciando...' : 'Ao vivo'}
            </span>
          </div>
        ) : status === 'error' ? (
          <div className="absolute inset-0 flex h-full items-center justify-center gap-2 text-xs text-red-400 px-3 text-center">
            <CameraOff className="h-4 w-4 shrink-0" />
            <span>{errorMessage || 'Erro ao acessar câmera.'}</span>
          </div>
        ) : (
          <div className="absolute inset-0 flex h-full items-center justify-center gap-2 text-xs text-zinc-400">
            <QrCode className="h-4 w-4" />
            <span>Câmera desligada. Clique abaixo para escanear.</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isActive ? (
          <Button
            type="button"
            variant="destructive"
            onClick={stopScanner}
            disabled={disabled || status === 'starting'}
            className="flex-1"
          >
            <CameraOff className="mr-2 h-4 w-4" />
            Desligar câmera
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={startScanner}
            disabled={disabled}
            className="flex-1"
          >
            <Camera className="mr-2 h-4 w-4" />
            Escanear QR Code
          </Button>
        )}
        {status === 'error' && (
          <Button
            type="button"
            variant="ghost"
            onClick={startScanner}
            disabled={disabled}
          >
            Tentar novamente
          </Button>
        )}
      </div>
    </div>
  )
}
