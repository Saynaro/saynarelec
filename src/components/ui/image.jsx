import React, { useState, useEffect, useRef } from "react"
import { useSize } from "@/hooks/use-size"
import { cn } from "@/lib/utils"
import {
  buildSrcSet,
  buildTransformUrl,
  DEFAULT_TRANSFORM_WIDTH,
  getOriginalImageUrl,
  IMAGE_LOAD_MODE,
  nextImageLoadMode,
  parseWixMediaUrl,
} from "./image-helpers"

const FALLBACK_IMAGE_URL =
  "https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png"

function ImageWrapper({
  aspectRatio = undefined,
  className = "",
  style = undefined,
  children = null,
  innerRef = undefined,
}) {
  return (
    <span
      ref={innerRef}
      className={cn("inline-block relative w-full h-full overflow-hidden", className)}
      style={{ aspectRatio, ...style }}
    >
      {children}
    </span>
  )
}

function ResponsiveImage({
  parsed,
  fittingType = "fill",
  focalPoint = undefined,
  quality = 90,
  className = "",
  style = undefined,
  aspectRatio = undefined,
  onLoad = undefined,
  ...props
}) {
  const wrapperRef = useRef(null)
  const imgRef = useRef(null)
  const size = useSize(wrapperRef)
  const [loaded, setLoaded] = useState(false)

  // Reset blur-up when underlying image changes
  useEffect(() => {
    setLoaded(false)
  }, [parsed?.baseUrl])

  const crop = fittingType !== "fit"
  const options = size && {
    width: size.width || DEFAULT_TRANSFORM_WIDTH,
    height: size.height ? size.height : undefined,
    crop,
    focalPoint: crop ? focalPoint : undefined,
    quality,
  }

  return (
    <ImageWrapper innerRef={wrapperRef} aspectRatio={aspectRatio} className={className} style={style}>
      {options && !loaded && (
        <img
          src={buildTransformUrl(parsed, {
            ...options,
            width: 20,
            height: options.height
              ? Math.max(1, Math.round((20 * options.height) / options.width))
              : undefined,
            quality: 20,
          })}
          alt=""
          aria-hidden="true"
          className="w-full h-full inset-0 absolute object-cover"
          style={{
            objectFit: fittingType === "fit" ? "contain" : "cover",
            filter: "blur(10px)",
            transform: "scale(1.1)",
          }}
        />
      )}
      {options && (
        <img
          ref={imgRef}
          src={buildTransformUrl(parsed, options)}
          srcSet={buildSrcSet(parsed, options)}
          loading="lazy"
          className={cn(
            "w-full h-full inset-0 absolute",
            fittingType === "fit" ? "object-contain" : "object-cover"
          )}
          onLoad={(e) => {
            setLoaded(true)
            onLoad?.(e)
          }}
          {...props}
        />
      )}
    </ImageWrapper>
  )
}

/**
 * Image component with automatic optimization and Cloudinary/Wix support.
 */
export function Image({
  src = "",
  alt = "",
  fittingType = "fill",
  originWidth = undefined,
  originHeight = undefined,
  focalPointX = undefined,
  focalPointY = undefined,
  quality = 90,
  className = "",
  style = undefined,
  onError = undefined,
  ...props
}) {
  const parsedSource = src && src !== FALLBACK_IMAGE_URL ? parseWixMediaUrl(src) : null
  const initialMode = parsedSource ? IMAGE_LOAD_MODE.OPTIMIZED : IMAGE_LOAD_MODE.ORIGINAL
  const [loadState, setLoadState] = useState({ src, mode: initialMode })
  const mode = loadState.src === src ? loadState.mode : initialMode

  useEffect(() => {
    setLoadState({ src, mode: initialMode })
  }, [src, initialMode])

  const handleError = (event) => {
    if (mode === IMAGE_LOAD_MODE.FALLBACK) return
    const nextMode = nextImageLoadMode(mode)
    setLoadState({ src, mode: nextMode })
    if (nextMode === IMAGE_LOAD_MODE.FALLBACK) onError?.(event)
  }

  const isCover = fittingType === "fill" || fittingType === "cover";
  const defaultFitClass = isCover ? "object-cover" : fittingType === "fit" ? "object-contain" : "";
  const mergedClass = cn("w-full h-full", defaultFitClass, className);

  const imageProps = {
    className: mergedClass,
    style: {
      objectFit: isCover ? "cover" : fittingType === "fit" ? "contain" : undefined,
      ...style,
    },
    alt,
    ...props,
    onError: handleError,
  }

  if (!src) {
    return <img src={FALLBACK_IMAGE_URL} {...imageProps} data-empty-image />
  }

  const parsed = mode === IMAGE_LOAD_MODE.OPTIMIZED ? parsedSource : null

  if (!parsed) {
    const isErrorMode = mode === IMAGE_LOAD_MODE.FALLBACK
    const imageSrc = isErrorMode ? FALLBACK_IMAGE_URL : getOriginalImageUrl(src, parsedSource)
    return (
      <img src={imageSrc} {...imageProps} data-error-image={isErrorMode || undefined} />
    )
  }

  const focalPoint =
    typeof focalPointX === "number" && typeof focalPointY === "number"
      ? { x: focalPointX, y: focalPointY }
      : undefined

  const aspectRatio =
    originWidth && originHeight ? `${originWidth} / ${originHeight}` : undefined

  return (
    <ResponsiveImage
      parsed={parsed}
      fittingType={fittingType}
      focalPoint={focalPoint}
      quality={quality}
      aspectRatio={aspectRatio}
      {...imageProps}
    />
  )
}
