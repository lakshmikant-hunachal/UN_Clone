import os
import tempfile
import logging

logger = logging.getLogger("familyshield.transcriber")

_whisper_model = None

def get_whisper_model():
    """Lazily loads faster-whisper model on CPU."""
    global _whisper_model
    if _whisper_model is None:
        try:
            from faster_whisper import WhisperModel
            model_size = os.getenv("WHISPER_MODEL_SIZE", "base")
            compute_type = os.getenv("WHISPER_COMPUTE_TYPE", "int8")
            logger.info(f"Loading faster-whisper model: {model_size} ({compute_type})...")
            _whisper_model = WhisperModel(model_size, device="cpu", compute_type=compute_type)
        except Exception as e:
            logger.warning(f"Could not initialize faster-whisper: {e}")
            _whisper_model = "UNAVAILABLE"
    return _whisper_model


def transcribe_audio(data: bytes, filename: str = "audio.wav") -> str:
    """
    Transcribes audio bytes into text using faster-whisper.
    v2 Policy: If speech-to-text fails, returns a clear error instead of fake/canned text.
    """
    model = get_whisper_model()
    
    if model == "UNAVAILABLE" or model is None:
        raise RuntimeError(
            "Speech-to-text transcription engine (faster-whisper) is not available on this server. "
            "Please install faster-whisper or use text input mode."
        )

    suffix = os.path.splitext(filename)[1] or ".wav"
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as f:
            f.write(data)
            temp_path = f.name
            
        segments, info = model.transcribe(temp_path, beam_size=5)
        transcript = " ".join(seg.text.strip() for seg in segments).strip()
        
        if not transcript:
            raise RuntimeError("No audible speech could be transcribed from the provided audio file.")
            
        return transcript

    except Exception as e:
        logger.error(f"Whisper transcription failed: {e}")
        raise RuntimeError(f"Audio transcription failed: {str(e)}")
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass
