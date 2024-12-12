'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

/**
 * @function Camera
 * @description Component that accesses the device's camera and captures a photo
 *
 * @returns {JSX.Element} Rendered camera component with video stream and capture button
 */
export const Camera = (): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [photoCaptured, setPhotoCaptured] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    // Verificar si el dispositivo tiene una cámara disponible
    const checkCameraAvailability = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(device => device.kind === 'videoinput');

        if (videoInputDevices.length > 0) {
          setHasCamera(true);
          getCameraStream();
        } else {
          console.warn('No se encontró ninguna cámara en este dispositivo.');
        }
      } catch (err) {
        console.error('Error al verificar la disponibilidad de la cámara: ', err);
      }
    };

    // Solicitar acceso a la cámara cuando se monte el componente
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error al acceder a la cámara: ', err);
      }
    };

    checkCameraAvailability();
  }, []);

  // Función para capturar la foto
  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      // Establecer el tamaño del canvas al tamaño del video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Dibujar el frame del video en el canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      // Obtener la imagen como un data URL
      const imageDataURL = canvas.toDataURL('image/png');
      setPhotoCaptured(imageDataURL);
    }
  };

  return (
    <div>
      <h1>Acceso a la Cámara y Captura de Foto</h1>
      {hasCamera ? (
        <>
          <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }} />
          <button onClick={handleCapturePhoto}>Tomar Foto</button>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          {photoCaptured && (
            <div>
              <h2>Foto Capturada:</h2>
              <Image src={photoCaptured} alt='Foto capturada' style={{ width: '100%', height: 'auto' }} />
            </div>
          )}
        </>
      ) : (
        <p>No se encontró ninguna cámara en este dispositivo.</p>
      )}
    </div>
  );
};
