import { Slot, component$, $, useSignal, useStore, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { randomString } from "~/utils.js";

/**
 * @typedef {HTMLAttributes<HTMLDialogElement>} DialogAttributes
 */

/**
 * @type {Component<DialogAttributes  & {
 * toggle: string|false,
 * open?: Boolean,
 * onClose$?: import('@builder.io/qwik').PropFunction<() => any>
 * }>}
 */
export default component$(({ toggle, open, onClose$, ...props }) => {
  const id = props.id || randomString(8)

  const dialogRef = useSignal()
  const state = useStore({
    isOpen: false,
  })

  useTask$(({ track }) => {
    track(() => state.isOpen)

    const dialog = dialogRef.value
    if (!dialog) return

    if (state.isOpen) {
      dialog.showModal()
    } else {
      dialog.close()
      onClose$ && onClose$()
    }
  })
  useVisibleTask$(({ track }) => {
    track(() => open)
    state.isOpen = open || false
  })

  const handleDialogClick = $((event) => {
    if (event.target.localName !== 'dialog') return
    state.isOpen = false
  })

  return (
    <div>
      {toggle && (
        <button aria-controls={id} aria-expanded={state.isOpen} onClick$={() => state.isOpen = true}>
          {toggle}
        </button>
      )}

      <dialog
        ref={dialogRef}
        id={id}
        onClick$={handleDialogClick}
        onClose$={() => state.isOpen = false}
        {...props}
      >
        <div class="p-2">
          <Slot></Slot>
        </div>
      </dialog>
    </div>
  )
})