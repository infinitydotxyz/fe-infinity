export const events = (state, send, settings) => ({
  element: {
    focus: {
      onFocus: (e) => send({ type: 'element.focus', payload: e }),
      onBlur: (e) => send({ type: 'element.blur', payload: e })
    },
    input: {
      onChange: (e) => send({ type: 'input.change', payload: e }),
      onInput: (e) => send({ type: 'input.input', payload: e }),
      onInvalid: (e) => send({ type: 'input.invalid', payload: e }),
      onReset: (e) => send({ type: 'input.reset', payload: e }),
      onSubmit: (e) => send({ type: 'input.submit', payload: e })
    },
    generic: {
      onError: (e) => send({ type: 'generic.error', payload: e }),
      onLoad: (e) => send({ type: 'generic.load', payload: e })
    },
    clipboard: {
      onCopy: (e) => send({ type: 'clipboard.copy', payload: e }),
      onCut: (e) => send({ type: 'clipboard.cut', payload: e }),
      onPaste: (e) => send({ type: 'clipboard.paste', payload: e })
    },
    mouse: {
      onClick: (e) => send({ type: 'mouse.click', payload: e }),
      onContextMenu: (e) => send({ type: 'mouse.context.menu', payload: e }),
      onDoubleClick: (e) => send({ type: 'mouse.double.click', payload: e }),
      onDrag: (e) => send({ type: 'mouse.drag', payload: e }),
      onDragEnd: (e) => send({ type: 'mouse.drag.end', payload: e }),
      onDragEnter: (e) => send({ type: 'mouse.drag.enter', payload: e }),
      onDragExit: (e) => send({ type: 'mouse.drag.exit', payload: e }),
      onDragLeave: (e) => send({ type: 'mouse.drag.leave', payload: e }),
      onDragOver: (e) => send({ type: 'mouse.drag.over', payload: e }),
      onDragStart: (e) => send({ type: 'mouse.drag.start', payload: e }),
      onDrop: (e) => send({ type: 'mouse.drop', payload: e }),
      onMouseDown: (e) => send({ type: 'mouse.down', payload: e }),
      onMouseEnter: (e) => send({ type: 'mouse.enter', payload: e }),
      onMouseLeave: (e) => send({ type: 'mouse.leave', payload: e }),
      onMouseMove: (e) => send({ type: 'mouse.move', payload: e }),
      onMouseOut: (e) => send({ type: 'mouse.out', payload: e }),
      onMouseOver: (e) => send({ type: 'mouse.over', payload: e }),
      onMouseUp: (e) => send({ type: 'mouse.up', payload: e }),
      onWheel: (e) => send({ type: 'mouse.wheel', payload: e }),
      onScroll: (e) => send({ type: 'mouse.scroll', payload: e })
    },
    pointer: {
      onPointerDown: (e) => send({ type: 'pointer.down', payload: e }),
      onPointerMove: (e) => send({ type: 'pointer.move', payload: e }),
      onPointerUp: (e) => send({ type: 'pointer.up', payload: e }),
      onPointerCancel: (e) => send({ type: 'pointer.cancel', payload: e }),
      onGotPointerCapture: (e) => send({ type: 'pointer.capture', payload: e }),
      onLostPointerCapture: (e) => send({ type: 'pointer.lost.capture', payload: e }),
      onPointerEnter: (e) => send({ type: 'pointer.enter', payload: e }),
      onPointerLeave: (e) => send({ type: 'pointer.leave', payload: e }),
      onPointerOver: (e) => send({ type: 'pointer.over', payload: e }),
      onPointerOut: (e) => send({ type: 'pointer.out', payload: e })
    },
    key: {
      onKeyDown: (e) => send({ type: 'key.down', payload: e }),
      onKeyPress: (e) => send({ type: 'key.press', payload: e }),
      onKeyUp: (e) => send({ type: 'key.up', payload: e })
    },
    touch: {
      onTouchCancel: (e) => send({ type: 'touch.cancel', payload: e }),
      onTouchEnd: (e) => send({ type: 'touch.end', payload: e }),
      onTouchMove: (e) => send({ type: 'touch.move', payload: e }),
      onTouchStart: (e) => send({ type: 'touch.start', payload: e })
    },
    media: {
      onAbort: (e) => send({ type: 'media.abort', payload: e }),
      onCanPlay: (e) => send({ type: 'media.can.play', payload: e }),
      onCanPlayThrough: (e) => send({ type: 'media.can.play.through', payload: e }),
      onDurationChange: (e) => send({ type: 'media.duration.change', payload: e }),
      onEmptied: (e) => send({ type: 'media.emptied', payload: e }),
      onEncrypted: (e) => send({ type: 'media.encrypted', payload: e }),
      onEnded: (e) => send({ type: 'media.ended', payload: e }),
      onError: (e) => send({ type: 'media.error', payload: e }),
      onLoadedData: (e) => send({ type: 'media.loaded.data', payload: e }),
      onLoadedMetadata: (e) => send({ type: 'media.loaded.meta.data', payload: e }),
      onLoadStart: (e) => send({ type: 'media.load.start', payload: e }),
      onPause: (e) => send({ type: 'media.pause', payload: e }),
      onPlay: (e) => send({ type: 'media.play', payload: e }),
      onPlaying: (e) => send({ type: 'media.playing', payload: e }),
      onProgress: (e) => send({ type: 'media.progress', payload: e }),
      onRateChange: (e) => send({ type: 'media.rate.change', payload: e }),
      onSeeked: (e) => send({ type: 'media.seeked', payload: e }),
      onSeeking: (e) => send({ type: 'media.seeking', payload: e }),
      onStalled: (e) => send({ type: 'media.stalled', payload: e }),
      onSuspend: (e) => send({ type: 'media.suspend', payload: e }),
      onTimeUpdate: (e) => send({ type: 'media.time.update', payload: e }),
      onVolumeChange: (e) => send({ type: 'media.volume.change', payload: e }),
      onWaiting: (e) => send({ type: 'media.waiting', payload: e })
    },
    image: {
      onLoad: (e) => send({ type: 'image.load', payload: e }),
      onError: (e) => send({ type: 'image.error', payload: e })
    },
    selection: {
      onSelect: (e) => send({ type: 'select', payload: e })
    },
    animation: {
      onAnimationStart: (e) => send({ type: 'animation.start', payload: e }),
      onAnimationEnd: (e) => send({ type: 'animation.end', payload: e }),
      onAnimationIteration: (e) => send({ type: 'animation.iteration', payload: e })
    },
    transition: {
      onTransitionEnd: (e) => send({ type: 'transition.end', payload: e })
    },
    others: {
      onToggle: (e) => send({ type: 'toggle', payload: e })
    }
  },
  send
});

export default events;
